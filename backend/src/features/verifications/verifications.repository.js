"use strict";

const { query, withTransaction } = require("../../shared/db/query");
const {
    minVotesCommunity,
    minVotesAuthority,
    confirmThreshold,
    radiusKm,
} = require("../../config/verification");
const {
    notify,
    notifyPriorVerifiers,
    notifyNearbyCitizens,
} = require("../../shared/utils/notify");

const MIN_VOTES_COMMUNITY = minVotesCommunity;
const MIN_VOTES_AUTHORITY = minVotesAuthority;
const CONFIRM_THRESHOLD = confirmThreshold;
const RADIUS_KM = radiusKm;

const DISTANCE_KM_SQL = (uLat, uLon, cLat, cLon) => `
    6371.0 * 2 * ASIN(SQRT(
        POWER(SIN(RADIANS((${cLat}) - (${uLat})) / 2), 2) +
        COS(RADIANS(${uLat})) * COS(RADIANS(${cLat})) *
        POWER(SIN(RADIANS((${cLon}) - (${uLon})) / 2), 2)
    ))
`;

async function getVerificationSummary(userId, userLat, userLon) {
    const sql = `
        SELECT
            -- Pending for this user (eligible + not yet voted + not the fixer)
            (
                SELECT COUNT(*)::INT
                FROM complaints c
                WHERE c.status = 'pending_verification'
                  AND c.reporter_id != $1
                  AND c.verification_deadline > NOW()
                  AND NOT EXISTS (
                      SELECT 1 FROM complaint_verifications cv
                      WHERE cv.complaint_id = c.id AND cv.verifier_id = $1
                  )
                  AND NOT EXISTS (
                      SELECT 1 FROM volunteer_task_assignments vta
                      JOIN volunteer_tasks vt ON vt.id = vta.task_id
                      WHERE vt.complaint_id = c.id
                        AND vta.volunteer_id = $1
                        AND vta.status IN ('pending_verification', 'completed')
                  )
                  AND ${DISTANCE_KM_SQL("$2", "$3", "c.latitude", "c.longitude")} <= ${RADIUS_KM}
            ) AS pending_count,

            -- Completed verifications by this user
            (
                SELECT COUNT(*)::INT
                FROM complaint_verifications
                WHERE verifier_id = $1
            ) AS completed_count,

            -- Approval accuracy: % of confirms that matched final resolved status
            (
                SELECT ROUND(
                    COUNT(*) FILTER (
                        WHERE cv.vote = 'confirm'
                          AND c.status = 'resolved'
                    ) * 100.0
                    / NULLIF(COUNT(*) FILTER (WHERE cv.vote = 'confirm'), 0),
                1)
                FROM complaint_verifications cv
                JOIN complaints c ON c.id = cv.complaint_id
                WHERE cv.verifier_id = $1
            ) AS approval_accuracy_pct;
    `;
    const { rows } = await query(sql, [userId, userLat, userLon]);
    return rows[0];
}

async function findPendingVerifications({
    userId,
    userLat,
    userLon,
    filter,
    search,
}) {
    const conditions = [
        `c.status = 'pending_verification'`,
        `c.reporter_id != $1`,
        `c.verification_deadline > NOW()`,
        `NOT EXISTS (
            SELECT 1 FROM complaint_verifications cv2
            WHERE cv2.complaint_id = c.id AND cv2.verifier_id = $1
         )`,
        `NOT EXISTS (
            SELECT 1 FROM volunteer_task_assignments vta
            JOIN volunteer_tasks vt ON vt.id = vta.task_id
            WHERE vt.complaint_id = c.id 
              AND vta.volunteer_id = $1 
              AND vta.status IN ('pending_verification', 'completed')
         )`,
        `${DISTANCE_KM_SQL("$2", "$3", "c.latitude", "c.longitude")} <= ${RADIUS_KM}`,
    ];

    const values = [userId, userLat, userLon];
    let idx = 4;

    if (search) {
        conditions.push(
            `(c.title ILIKE $${idx} OR c.public_code ILIKE $${idx})`,
        );
        values.push(`%${search}%`);
        idx++;
    }

    let orderBy;
    switch (filter) {
        case "urgent":
            orderBy = "c.sla_deadline ASC NULLS LAST";
            break;
        case "deadline_soon":
            orderBy = "c.verification_deadline ASC";
            break;
        case "nearest":
            orderBy = `${DISTANCE_KM_SQL("$2", "$3", "c.latitude", "c.longitude")} ASC`;
            break;
        case "most_recent":
        default:
            orderBy = "c.verification_started_at DESC";
    }

    const sql = `
        SELECT
            c.id,
            c.public_code,
            c.title,
            c.description,
            c.status,
            c.address_text,
            c.latitude,
            c.longitude,
            c.verification_started_at,
            c.verification_deadline,
            c.sla_deadline,
            c.created_at,
            cat.name            AS category_name,
            d.name              AS department_name,

            -- Cover photo
            (
                SELECT url FROM complaint_photos
                WHERE complaint_id = c.id
                ORDER BY position ASC LIMIT 1
            )                   AS cover_photo,

            -- Vote counts
            COUNT(cv.id)::INT                                       AS total_votes,
            COUNT(cv.id) FILTER (WHERE cv.vote = 'confirm')::INT    AS confirm_count,
            COUNT(cv.id) FILTER (WHERE cv.vote = 'reject')::INT     AS reject_count,

            -- Distance from verifier
            ${DISTANCE_KM_SQL("$2", "$3", "c.latitude", "c.longitude")} AS distance_km

        FROM complaints c
        JOIN sla_categories cat ON cat.id = c.category_id
        JOIN departments    d   ON d.id   = c.department_id
        LEFT JOIN complaint_verifications cv ON cv.complaint_id = c.id

        WHERE ${conditions.join(" AND ")}
        GROUP BY c.id, cat.name, d.name
        ORDER BY ${orderBy};
    `;

    const { rows } = await query(sql, values);
    return rows;
}

async function findVerificationHistory(userId) {
    const sql = `
        SELECT
            cv.id                AS vote_id,
            cv.vote,
            cv.comment,
            cv.created_at        AS voted_at,
            c.id                 AS complaint_id,
            c.public_code,
            c.title,
            c.status,
            c.address_text,
            c.verification_deadline,
            cat.name             AS category_name,
            d.name               AS department_name,
            (
                SELECT url FROM complaint_photos
                WHERE complaint_id = c.id
                ORDER BY position ASC LIMIT 1
            )                    AS cover_photo,

            -- Final vote tally at time of query
            (SELECT COUNT(*)::INT FROM complaint_verifications WHERE complaint_id = c.id)                             AS total_votes,
            (SELECT COUNT(*)::INT FROM complaint_verifications WHERE complaint_id = c.id AND vote = 'confirm')        AS confirm_count,
            (SELECT COUNT(*)::INT FROM complaint_verifications WHERE complaint_id = c.id AND vote = 'reject')         AS reject_count

        FROM complaint_verifications cv
        JOIN complaints     c   ON c.id  = cv.complaint_id
        JOIN sla_categories cat ON cat.id = c.category_id
        JOIN departments    d   ON d.id   = c.department_id
        WHERE cv.verifier_id = $1
        ORDER BY cv.created_at DESC;
    `;
    const { rows } = await query(sql, [userId]);
    return rows;
}

async function checkEligibility(complaintId, userId, userLat, userLon) {
    const sql = `
        SELECT
            c.id,
            c.status,
            c.reporter_id,
            c.verification_deadline,
            ${DISTANCE_KM_SQL(`$3`, `$4`, `c.latitude`, `c.longitude`)} AS distance_km,
            EXISTS (
                SELECT 1 FROM complaint_verifications
                WHERE complaint_id = $1 AND verifier_id = $2
            ) AS already_voted
        FROM complaints c
        WHERE c.id = $1
        LIMIT 1;
    `;
    const { rows } = await query(sql, [complaintId, userId, userLat, userLon]);
    return rows[0] ?? null;
}

async function castVoteAndResolve({ complaintId, verifierId, vote, comment }) {
    return withTransaction(async (client) => {
        const { rows: voteRows } = await client.query(
            `INSERT INTO complaint_verifications (complaint_id, verifier_id, vote, comment)
             VALUES ($1, $2, $3, $4)
             RETURNING id, vote, created_at`,
            [complaintId, verifierId, vote, comment ?? null],
        );
        const newVote = voteRows[0];

        const { rows: tally } = await client.query(
            `SELECT
                COUNT(*)::INT                                    AS total,
                COUNT(*) FILTER (WHERE vote = 'confirm')::INT   AS confirms,
                COUNT(*) FILTER (WHERE vote = 'reject')::INT    AS rejects,
                c.issue_type
             FROM complaint_verifications cv
             JOIN complaints c ON c.id = cv.complaint_id
             WHERE cv.complaint_id = $1
             GROUP BY c.issue_type`,
            [complaintId],
        );
        const { total, confirms, issue_type } = tally[0];
        const ratio = total > 0 ? confirms / total : 0;

        const MIN_VOTES =
            issue_type === "community_fixable"
                ? MIN_VOTES_COMMUNITY
                : MIN_VOTES_AUTHORITY;

        let resolution = null;

        if (total >= MIN_VOTES) {
            const newStatus =
                ratio >= CONFIRM_THRESHOLD ? "resolved" : "reopened";

            const { rows: updated } = await client.query(
                `UPDATE complaints
                 SET status       = $2::text,
                     resolved_at  = CASE WHEN $2::text = 'resolved' THEN NOW() ELSE NULL END,
                     reopen_count = CASE WHEN $2::text = 'reopened' THEN reopen_count + 1 ELSE reopen_count END,
                     sla_deadline = CASE
                         WHEN $2::text = 'reopened' THEN NOW() + (
                             SELECT sla_duration_days * INTERVAL '1 day'
                             FROM sla_categories WHERE id = (
                                 SELECT category_id FROM complaints WHERE id = $1
                             )
                         )
                         ELSE sla_deadline
                     END
                 WHERE id = $1
                   AND status = 'pending_verification'
                 RETURNING id, status, resolved_at, reopen_count, sla_deadline`,
                [complaintId, newStatus],
            );

            if (updated.length > 0) {
                resolution = updated[0];

                await client.query(
                    `INSERT INTO complaint_status_history
                         (complaint_id, from_status, to_status, actor_role, note)
                     VALUES ($1, 'pending_verification', $2, 'system', $3)`,
                    [
                        complaintId,
                        newStatus,
                        newStatus === "resolved"
                            ? `Community verified: ${confirms}/${total} confirmed (${Math.round(ratio * 100)}%).`
                            : `Community rejected: ${confirms}/${total} confirmed (${Math.round(ratio * 100)}%). Re-opened.`,
                    ],
                );

                if (newStatus === "resolved") {
                    const volRepo = require("../volunteer/volunteer.repository");

                    await volRepo.finalizeTaskOnResolution(client, complaintId);

                    const { rows: reporterRows } = await client.query(
                        `SELECT reporter_id, title, public_code FROM complaints WHERE id = $1`,
                        [complaintId],
                    );
                    if (reporterRows[0]?.reporter_id) {
                        await volRepo.awardPoints(client, {
                            userId: reporterRows[0].reporter_id,
                            complaintId,
                            taskId: null,
                            points: volRepo.POINTS.report,
                            type: "report",
                        });

                        const { reporter_id, title, public_code } =
                            reporterRows[0];

                        await notify(client, {
                            userId: reporter_id,
                            type: "COMPLAINT_RESOLVED",
                            title: "🎉 Your complaint has been resolved!",
                            body: `Your complaint "${title}" has been successfully resolved by the community.`,
                            data: { publicCode: public_code, complaintId },
                            entityType: "complaint",
                            entityId: complaintId,
                        });

                        await notify(client, {
                            userId: reporter_id,
                            type: "REPORT_POINTS_EARNED",
                            title: `+${volRepo.POINTS.report} points for your report!`,
                            body: `Your complaint "${title}" was resolved. You earned ${volRepo.POINTS.report} points.`,
                            data: {
                                points: volRepo.POINTS.report,
                                publicCode: public_code,
                                complaintId,
                            },
                            entityType: "complaint",
                            entityId: complaintId,
                        });
                    }

                    await notifyPriorVerifiers(client, {
                        complaintId,
                        excludeVerifierId: verifierId,
                        type: "COMPLAINT_YOU_VERIFIED_RESOLVED",
                        title: "A complaint you verified is resolved",
                        body: "A complaint you helped verify has been successfully resolved by the community.",
                        data: { complaintId },
                        entityType: "complaint",
                        entityId: complaintId,
                    });

                    // Notify the department official that their complaint was community-resolved
                    const { rows: deptRows } = await client.query(
                        `SELECT d.user_id AS official_id, c.title, c.public_code
                         FROM complaints c
                         JOIN departments d ON d.id = c.department_id
                         WHERE c.id = $1 AND d.user_id IS NOT NULL`,
                        [complaintId],
                    );
                    if (deptRows[0]?.official_id) {
                        await notify(client, {
                            userId:     deptRows[0].official_id,
                            type:       "COMPLAINT_COMMUNITY_RESOLVED",
                            title:      "A complaint was resolved by the community",
                            body:       `The complaint "${deptRows[0].title}" assigned to your department was resolved by the community without departmental action.`,
                            data:       { publicCode: deptRows[0].public_code, complaintId },
                            entityType: "complaint",
                            entityId:   complaintId,
                        });
                    }
                } else {
                    const { rows: compRows } = await client.query(
                        `SELECT reporter_id, title, public_code, latitude, longitude, issue_type
                         FROM complaints WHERE id = $1`,
                        [complaintId],
                    );

                    if (compRows[0]?.reporter_id) {
                        await notify(client, {
                            userId: compRows[0].reporter_id,
                            type: "COMPLAINT_REOPENED",
                            title: "Your complaint has been reopened",
                            body: `The community rejected the fix for "${compRows[0].title}". It has been reopened for re-review.`,
                            data: {
                                publicCode: compRows[0].public_code,
                                complaintId,
                            },
                            entityType: "complaint",
                            entityId: complaintId,
                        });
                    }

                    const { rows: assignRows } = await client.query(
                        `SELECT vta.volunteer_id, vta.id AS assignment_id, vt.id AS task_id
                         FROM volunteer_tasks vt
                         JOIN volunteer_task_assignments vta ON vta.task_id = vt.id
                         WHERE vt.complaint_id = $1 AND vta.status = 'pending_verification'
                         LIMIT 1`,
                        [complaintId],
                    );
                    if (assignRows[0]) {
                        const { volunteer_id, assignment_id, task_id } =
                            assignRows[0];

                        await client.query(
                            `UPDATE volunteer_task_assignments
                             SET status = 'abandoned', completed_at = NOW()
                             WHERE id = $1`,
                            [assignment_id],
                        );

                        await client.query(
                            `UPDATE volunteer_tasks SET status = 'open' WHERE id = $1`,
                            [task_id],
                        );

                        await client.query(
                            `DELETE FROM complaint_verifications WHERE complaint_id = $1`,
                            [complaintId],
                        );

                        await notify(client, {
                            userId: volunteer_id,
                            type: "FIX_REJECTED",
                            title: "Your fix was rejected",
                            body: "The community rejected your fix. The complaint has been reopened — another volunteer can now try.",
                            data: { complaintId },
                            entityType: "complaint",
                            entityId: complaintId,
                        });
                    }

                    await notifyPriorVerifiers(client, {
                        complaintId,
                        excludeVerifierId: verifierId,
                        type: "COMPLAINT_YOU_VERIFIED_REOPENED",
                        title: "A complaint you verified was reopened",
                        body: "The community rejected the fix. A complaint you helped verify has been reopened.",
                        data: { complaintId },
                        entityType: "complaint",
                        entityId: complaintId,
                    });

                    if (assignRows[0]) {
                        await client.query(
                            `DELETE FROM complaint_verifications WHERE complaint_id = $1`,
                            [complaintId],
                        );

                        if (compRows[0]?.issue_type === "community_fixable") {
                            await notifyNearbyCitizens(client, {
                                excludeUserId:
                                    compRows[0]?.reporter_id ?? verifierId,
                                lat: parseFloat(compRows[0].latitude),
                                lon: parseFloat(compRows[0].longitude),
                                type: "NEW_TASK_NEARBY",
                                title: "Volunteer task reopened near you",
                                body: `A community task near you was reopened and needs a new volunteer: "${compRows[0].title}".`,
                                data: {
                                    publicCode: compRows[0].public_code,
                                    complaintId,
                                },
                                entityType: "complaint",
                                entityId: complaintId,
                            });
                        }
                    }
                }
            }
        }

        const volRepo = require("../volunteer/volunteer.repository");
        await volRepo.awardPoints(client, {
            userId: verifierId,
            complaintId,
            taskId: null,
            points: volRepo.POINTS.verification,
            type: "verification",
        });

        await notify(client, {
            userId: verifierId,
            type: "VERIFICATION_POINTS_EARNED",
            title: `+${volRepo.POINTS.verification} points for verifying!`,
            body: "Thanks for helping your community. You earned points for your verification vote.",
            data: { points: volRepo.POINTS.verification, complaintId, vote },
            entityType: "complaint",
            entityId: complaintId,
        });

        return {
            vote: newVote,
            tally: {
                total,
                confirms,
                rejects: tally[0].rejects,
                ratio: Math.round(ratio * 100),
            },
            resolution,
            minVotes: MIN_VOTES,
        };
    });
}

module.exports = {
    getVerificationSummary,
    findPendingVerifications,
    findVerificationHistory,
    checkEligibility,
    castVoteAndResolve,
    MIN_VOTES_COMMUNITY,
    MIN_VOTES_AUTHORITY,
    CONFIRM_THRESHOLD,
};
