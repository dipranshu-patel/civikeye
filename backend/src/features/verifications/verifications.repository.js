"use strict";

const { query, withTransaction }              = require("../../shared/db/query");
const { minVotes, confirmThreshold, radiusKm } = require("../../config/verification");

// Re-export so service can reference them in response payloads
const MIN_VOTES        = minVotes;
const CONFIRM_THRESHOLD = confirmThreshold;
const RADIUS_KM        = radiusKm;

// Haversine distance expression (SQL, in km)
// u_lat / u_lon = verifier's registered location
// c_lat / c_lon = complaint location
const DISTANCE_KM_SQL = (uLat, uLon, cLat, cLon) => `
    6371.0 * 2 * ASIN(SQRT(
        POWER(SIN(RADIANS((${cLat}) - (${uLat})) / 2), 2) +
        COS(RADIANS(${uLat})) * COS(RADIANS(${cLat})) *
        POWER(SIN(RADIANS((${cLon}) - (${uLon})) / 2), 2)
    ))
`;

// ─── Summary cards ────────────────────────────────────────────────────────────
// pending_count  = complaints in pending_verification within 2km, not reporter, not voted
// completed      = total votes cast by this user
// approval_accuracy = % of user's confirm votes where complaint eventually resolved

async function getVerificationSummary(userId, userLat, userLon) {
    const sql = `
        SELECT
            -- Pending for this user (eligible + not yet voted)
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
                  AND ${DISTANCE_KM_SQL("$2", "$3", "c.latitude", "c.longitude")} <= 2
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

// ─── Pending verifications (eligible, not yet voted, within 2km) ──────────────

async function findPendingVerifications({ userId, userLat, userLon, filter, search }) {
    const conditions = [
        `c.status = 'pending_verification'`,
        `c.reporter_id != $1`,
        `c.verification_deadline > NOW()`,
        `NOT EXISTS (
            SELECT 1 FROM complaint_verifications cv2
            WHERE cv2.complaint_id = c.id AND cv2.verifier_id = $1
         )`,
        `${DISTANCE_KM_SQL("$2", "$3", "c.latitude", "c.longitude")} <= ${RADIUS_KM}`,
    ];

    const values = [userId, userLat, userLon];
    let   idx    = 4;

    if (search) {
        conditions.push(`(c.title ILIKE $${idx} OR c.public_code ILIKE $${idx})`);
        values.push(`%${search}%`);
        idx++;
    }

    // Filter chip → ORDER BY
    let orderBy;
    switch (filter) {
        case "urgent":
            // complaints with sla_deadline approaching or overdue
            orderBy = "c.sla_deadline ASC NULLS LAST";
            break;
        case "deadline_soon":
            // verification_deadline closest first
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

// ─── Verification history (votes already cast by this user) ───────────────────

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

// ─── Eligibility check ────────────────────────────────────────────────────────

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

// ─── Cast vote (with eager resolution check) ──────────────────────────────────

async function castVoteAndResolve({ complaintId, verifierId, vote, comment }) {
    return withTransaction(async (client) => {
        // Insert vote
        const { rows: voteRows } = await client.query(
            `INSERT INTO complaint_verifications (complaint_id, verifier_id, vote, comment)
             VALUES ($1, $2, $3, $4)
             RETURNING id, vote, created_at`,
            [complaintId, verifierId, vote, comment ?? null],
        );
        const newVote = voteRows[0];

        // Tally current votes
        const { rows: tally } = await client.query(
            `SELECT
                COUNT(*)::INT                                    AS total,
                COUNT(*) FILTER (WHERE vote = 'confirm')::INT   AS confirms,
                COUNT(*) FILTER (WHERE vote = 'reject')::INT    AS rejects
             FROM complaint_verifications
             WHERE complaint_id = $1`,
            [complaintId],
        );
        const { total, confirms } = tally[0];
        const ratio = total > 0 ? confirms / total : 0;

        let resolution = null;

        // Eager resolution: trigger when MIN_VOTES reached
        if (total >= MIN_VOTES) {
            const newStatus = ratio >= CONFIRM_THRESHOLD ? "resolved" : "reopened";

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

                // Write status_history entry
                await client.query(
                    `INSERT INTO complaint_status_history
                         (complaint_id, from_status, to_status, actor_role, note)
                     VALUES ($1, 'pending_verification', $2, 'system',
                             $3)`,
                    [
                        complaintId,
                        newStatus,
                        newStatus === "resolved"
                            ? `Community verified: ${confirms}/${total} confirmed (${Math.round(ratio * 100)}%).`
                            : `Community rejected: ${confirms}/${total} confirmed (${Math.round(ratio * 100)}%). Re-opened.`,
                    ],
                );
            }
        }

        return {
            vote:       newVote,
            tally:      { total, confirms, rejects: tally[0].rejects, ratio: Math.round(ratio * 100) },
            resolution,
            minVotes:   MIN_VOTES,
        };
    });
}

module.exports = {
    getVerificationSummary,
    findPendingVerifications,
    findVerificationHistory,
    checkEligibility,
    castVoteAndResolve,
    MIN_VOTES,
    CONFIRM_THRESHOLD,
};
