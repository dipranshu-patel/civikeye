"use strict";

const { query, withTransaction }                            = require("../../shared/db/query");
const { uploadBufferToCloudinary }                          = require("../../shared/middlewares/upload.middleware");
const { notify, notifyNearbyCitizens }                      = require("../../shared/utils/notify");

const POINTS = {
    community_fix: parseInt(process.env.POINTS_COMMUNITY_FIX ?? "25", 10),
    verification:  parseInt(process.env.POINTS_VERIFICATION  ?? "5",  10),
    report:        parseInt(process.env.POINTS_REPORT        ?? "10", 10),
};

const TASK_COLS = `
    vt.id           AS task_id,
    vt.status       AS task_status,
    vt.created_at   AS task_created_at,
    c.id            AS complaint_id,
    c.public_code,
    c.title,
    c.description,
    c.address_text,
    c.latitude,
    c.longitude,
    c.issue_type,
    c.status        AS complaint_status,
    c.upvote_count,
    c.verification_started_at,
    c.verification_deadline,
    c.created_at    AS complaint_created_at,
    cat.name        AS category_name,
    (
        SELECT url FROM complaint_photos
        WHERE complaint_id = c.id
        ORDER BY position ASC LIMIT 1
    )               AS cover_photo
`;

const TASK_JOINS = `
    FROM volunteer_tasks vt
    JOIN complaints    c   ON c.id   = vt.complaint_id
    JOIN sla_categories cat ON cat.id = c.category_id
`;

async function createVolunteerTask(client, complaintId) {
    const q = client ? client.query.bind(client) : query;
    const { rows } = await q(
        `INSERT INTO volunteer_tasks (complaint_id) VALUES ($1)
         RETURNING id, status, created_at`,
        [complaintId],
    );
    return rows[0];
}

async function findOpenTasks({ search, page, limit }) {
    const conditions = [`vt.status = 'open'`, `c.status = 'reported'`];
    const values     = [];
    let   idx        = 1;

    if (search) {
        conditions.push(`(c.title ILIKE $${idx} OR c.public_code ILIKE $${idx} OR c.address_text ILIKE $${idx})`);
        values.push(`%${search}%`);
        idx++;
    }

    const offset = (page - 1) * limit;

    const sql = `
        SELECT ${TASK_COLS},
               COUNT(*) OVER ()::INT AS total_count
        ${TASK_JOINS}
        WHERE ${conditions.join(" AND ")}
        ORDER BY c.created_at DESC
        LIMIT $${idx} OFFSET $${idx + 1};
    `;
    values.push(limit, offset);

    const { rows } = await query(sql, values);
    return rows;
}

async function claimTask({ taskId, volunteerId }) {
    return withTransaction(async (client) => {
        const { rows: taskRows } = await client.query(
            `SELECT vt.id, vt.status, vt.complaint_id,
                    c.issue_type,
                    c.reporter_id,
                    EXISTS (
                        SELECT 1 FROM volunteer_task_assignments
                        WHERE task_id = $1 AND volunteer_id = $2
                    ) AS already_claimed
             FROM volunteer_tasks vt
             JOIN complaints c ON c.id = vt.complaint_id
             WHERE vt.id = $1
             FOR UPDATE`,
            [taskId, volunteerId],
        );

        const task = taskRows[0] ?? null;

        if (!task)                                        return { error: "TASK_NOT_FOUND" };
        if (task.status !== "open")                       return { error: "TASK_NOT_OPEN" };
        if (task.already_claimed)                         return { error: "ALREADY_CLAIMED" };
        if (task.issue_type !== "community_fixable")     return { error: "NOT_COMMUNITY_FIXABLE" };
        if (task.reporter_id === volunteerId)             return { error: "REPORTER_CANNOT_CLAIM" };

        await client.query(
            `UPDATE volunteer_tasks SET status = 'claimed' WHERE id = $1`,
            [taskId],
        );

        const { rows: assignRows } = await client.query(
            `INSERT INTO volunteer_task_assignments (task_id, volunteer_id)
             VALUES ($1, $2)
             RETURNING id, status, claimed_at`,
            [taskId, volunteerId],
        );

        await notify(client, {
            userId:     volunteerId,
            type:       "TASK_CLAIMED",
            title:      "Task claimed!",
            body:       "You've claimed a volunteer task. Head to the location and fix it!",
            data:       { taskId, complaintId: task.complaint_id },
            entityType: "task",
            entityId:   taskId,
        });

        return { task, assignment: assignRows[0] };
    });
}

async function submitTaskCompletion({ taskId, volunteerId, note, proofFile }) {
    let proofUrl = null, proofPublicId = null;
    if (proofFile) {
        const uploaded = await uploadBufferToCloudinary(proofFile.buffer, {
            folder: "civikeye/volunteer-proof",
        });
        proofUrl      = uploaded.url;
        proofPublicId = uploaded.publicId;
    }

    return withTransaction(async (client) => {
        const { rows: assignRows } = await client.query(
            `SELECT vta.id, vta.status, vta.task_id,
                    vt.complaint_id, vt.status AS task_status
             FROM volunteer_task_assignments vta
             JOIN volunteer_tasks vt ON vt.id = vta.task_id
             WHERE vta.task_id = $1 AND vta.volunteer_id = $2
             FOR UPDATE`,
            [taskId, volunteerId],
        );

        const assignment = assignRows[0] ?? null;

        if (!assignment) return { error: "ASSIGNMENT_NOT_FOUND" };
        if (assignment.status !== "active") return { error: "ASSIGNMENT_NOT_ACTIVE" };


        await client.query(
            `UPDATE volunteer_task_assignments
             SET status          = 'pending_verification',
                 note            = $3,
                 proof_photo_url = $4,
                 proof_public_id = $5,
                 completed_at    = NOW()
             WHERE id = $1 AND volunteer_id = $2`,
            [assignment.id, volunteerId, note ?? null, proofUrl, proofPublicId],
        );

        await client.query(
            `UPDATE volunteer_tasks SET status = 'pending_verification' WHERE id = $1`,
            [taskId],
        );

        await client.query(
            `UPDATE complaints
             SET status                  = 'pending_verification',
                 verification_started_at = NOW(),
                 verification_deadline   = NOW() + INTERVAL '2 days'
             WHERE id = $1`,
            [assignment.complaint_id],
        );

        await client.query(
            `INSERT INTO complaint_status_history
                 (complaint_id, from_status, to_status, actor_id, actor_role, note)
             VALUES ($1, 'reported', 'pending_verification', $2, 'citizen', $3)`,
            [assignment.complaint_id, volunteerId, note ?? "Volunteer submitted resolution proof."],
        );

        const { rows: cRows } = await client.query(
            `SELECT reporter_id, title, latitude, longitude, public_code
             FROM complaints WHERE id = $1`, [assignment.complaint_id],
        );
        const comp = cRows[0];

        await notify(client, {
            userId:     volunteerId,
            type:       "TASK_SUBMITTED",
            title:      "Fix submitted for verification",
            body:       "Your resolution has been submitted. Community verification has started.",
            data:       { taskId, complaintId: assignment.complaint_id },
            entityType: "task",
            entityId:   taskId,
        });

        if (comp) {
            await notify(client, {
                userId:     comp.reporter_id,
                type:       "COMPLAINT_PENDING_VERIFICATION",
                title:      "Community is verifying your complaint",
                body:       `A volunteer has submitted a fix for "${comp.title}". Community is now verifying it.`,
                data:       { publicCode: comp.public_code, complaintId: assignment.complaint_id },
                entityType: "complaint",
                entityId:   assignment.complaint_id,
            });

            if (note?.trim()) {
                const preview = note.trim().length > 100
                    ? note.trim().slice(0, 100) + "…"
                    : note.trim();
                await notify(client, {
                    userId:     comp.reporter_id,
                    type:       "COMPLAINT_ACTIVITY",
                    title:      "New update on your complaint",
                    body:       `The volunteer left a note: “${preview}”`,
                    data:       { publicCode: comp.public_code, complaintId: assignment.complaint_id,
                                  note: note.trim(), actorRole: "volunteer" },
                    entityType: "complaint",
                    entityId:   assignment.complaint_id,
                });
            }

            await notifyNearbyCitizens(client, {
                excludeUserId: comp.reporter_id,
                lat: parseFloat(comp.latitude),
                lon: parseFloat(comp.longitude),
                type:       "VERIFICATION_NEEDED",
                title:      "Verification needed near you",
                body:       `A complaint near you needs community verification: "${comp.title}"`,
                data:       { publicCode: comp.public_code, complaintId: assignment.complaint_id },
                entityType: "complaint",
                entityId:   assignment.complaint_id,
            });
        }

        return { assignmentId: assignment.id, complaintId: assignment.complaint_id, proofUrl };
    });
}

async function findMyTasks({ volunteerId, tab }) {
    const TAB_ASSIGNMENT_STATUS = {
        active:               ["active"],
        pending_verification: ["pending_verification"],
        completed:            ["completed"],
    };

    const statuses = TAB_ASSIGNMENT_STATUS[tab] ?? ["active"];

    const sql = `
        SELECT ${TASK_COLS},
               vta.id              AS assignment_id,
               vta.status          AS assignment_status,
               vta.note,
               vta.proof_photo_url,
               vta.claimed_at,
               vta.completed_at,
               -- verification tally (for pending_verification tab)
               (SELECT COUNT(*)::INT FROM complaint_verifications WHERE complaint_id = c.id)                           AS total_votes,
               (SELECT COUNT(*)::INT FROM complaint_verifications WHERE complaint_id = c.id AND vote = 'confirm')      AS confirm_count,
               (SELECT COUNT(*)::INT FROM complaint_verifications WHERE complaint_id = c.id AND vote = 'reject')       AS reject_count,
               -- points awarded (for completed tab)
               (SELECT SUM(points)::INT FROM contributions WHERE user_id = $1 AND task_id = vt.id) AS points_earned
        ${TASK_JOINS}
        JOIN volunteer_task_assignments vta ON vta.task_id = vt.id AND vta.volunteer_id = $1
        WHERE vta.status = ANY($2::text[])
        ORDER BY
            CASE WHEN vta.status = 'active' THEN vta.claimed_at END DESC,
            CASE WHEN vta.status = 'pending_verification' THEN c.verification_deadline END ASC,
            vta.completed_at DESC NULLS LAST;
    `;

    const { rows } = await query(sql, [volunteerId, statuses]);
    return rows;
}

async function getMyTasksSummary(volunteerId) {
    const sql = `
        SELECT
            COUNT(*) FILTER (WHERE vta.status = 'active')               ::INT AS active,
            COUNT(*) FILTER (WHERE vta.status = 'pending_verification')  ::INT AS pending_verification,
            COUNT(*) FILTER (WHERE vta.status = 'completed')             ::INT AS completed
        FROM volunteer_task_assignments vta
        WHERE vta.volunteer_id = $1;
    `;
    const { rows } = await query(sql, [volunteerId]);
    return rows[0];
}

async function getImpactStats(volunteerId) {
    const sql = `
        SELECT
            -- Personal
            COALESCE(SUM(con.points), 0)::INT                                   AS total_score,
            COALESCE(SUM(con.points) FILTER (
                WHERE con.created_at > NOW() - INTERVAL '7 days'), 0)::INT       AS score_this_week,
            COUNT(DISTINCT vta.id) FILTER (WHERE vta.status = 'completed')::INT  AS completed_fixes,
            COUNT(DISTINCT vta.id) FILTER (
                WHERE vta.status = 'completed'
                  AND vta.completed_at > DATE_TRUNC('month', NOW()))::INT         AS fixes_this_month,
            -- Verification rate: confirms / total votes user cast where complaint ended resolved
            (
                SELECT ROUND(
                    COUNT(*) FILTER (WHERE cv.vote = 'confirm' AND c2.status = 'resolved') * 100.0
                    / NULLIF(COUNT(*) FILTER (WHERE cv.vote = 'confirm'), 0), 1
                )
                FROM complaint_verifications cv
                JOIN complaints c2 ON c2.id = cv.complaint_id
                WHERE cv.verifier_id = $1
            )                                                                    AS verification_rate_pct
        FROM users u
        LEFT JOIN contributions con ON con.user_id = u.id
        LEFT JOIN volunteer_task_assignments vta ON vta.volunteer_id = u.id
        WHERE u.id = $1
        GROUP BY u.id;
    `;
    const { rows } = await query(sql, [volunteerId]);
    return rows[0] ?? null;
}

async function getVolunteerRank(volunteerId) {
    const sql = `
        SELECT rank
        FROM (
            SELECT user_id,
                   RANK() OVER (ORDER BY SUM(points) DESC) AS rank
            FROM contributions
            GROUP BY user_id
        ) ranked
        WHERE user_id = $1;
    `;
    const { rows } = await query(sql, [volunteerId]);
    return rows[0]?.rank ?? null;
}

async function getCityWideStats() {
    const sql = `
        SELECT
            (SELECT COUNT(*)::INT FROM complaints WHERE status = 'resolved')                   AS total_resolved,
            (SELECT COUNT(DISTINCT volunteer_id)::INT FROM volunteer_task_assignments
             WHERE status = 'completed')                                                        AS total_contributors
        ;
    `;
    const { rows } = await query(sql);
    return rows[0];
}

async function getLeaderboard({ page, limit }) {
    const offset = (page - 1) * limit;

    const sql = `
        SELECT
            RANK() OVER (ORDER BY SUM(con.points) DESC)::INT     AS rank,
            u.id,
            u.full_name,
            COALESCE(up.appear_on_leaderboard, TRUE)             AS appear_on_leaderboard,
            SUM(con.points)::INT                                  AS total_points,
            COUNT(DISTINCT vta.id) FILTER (WHERE vta.status = 'completed')::INT AS completed_fixes,
            ROUND(
                COUNT(cv.id) FILTER (
                    WHERE cv.vote = 'confirm' AND c2.status = 'resolved'
                ) * 100.0 / NULLIF(COUNT(cv.id) FILTER (WHERE cv.vote = 'confirm'), 0), 1
            )                                                     AS verify_rate_pct,
            COUNT(*) OVER ()::INT                                 AS total_count
        FROM contributions con
        JOIN users u ON u.id = con.user_id AND u.is_deleted = FALSE
        LEFT JOIN user_preferences             up  ON up.user_id       = u.id
        LEFT JOIN volunteer_task_assignments vta ON vta.volunteer_id = u.id
        LEFT JOIN complaint_verifications cv ON cv.verifier_id = u.id
        LEFT JOIN complaints c2 ON c2.id = cv.complaint_id
        GROUP BY u.id, u.full_name, up.appear_on_leaderboard
        ORDER BY SUM(con.points) DESC
        LIMIT $1 OFFSET $2;
    `;

    const { rows } = await query(sql, [limit, offset]);
    return rows;
}

async function awardPoints(client, { userId, complaintId, taskId, points, type }) {
    const { rows } = await client.query(
        `INSERT INTO contributions (user_id, complaint_id, task_id, points, type)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, points, type, created_at`,
        [userId, complaintId ?? null, taskId ?? null, points, type],
    );
    return rows[0];
}

async function finalizeTaskOnResolution(client, complaintId) {
    const { rows } = await client.query(
        `SELECT vta.id AS assignment_id, vta.volunteer_id, vt.id AS task_id
         FROM volunteer_tasks vt
         JOIN volunteer_task_assignments vta ON vta.task_id = vt.id
         WHERE vt.complaint_id = $1
           AND vta.status = 'pending_verification'
         LIMIT 1`,
        [complaintId],
    );

    if (!rows.length) return null;
    const { assignment_id, volunteer_id, task_id } = rows[0];

    await client.query(
        `UPDATE volunteer_task_assignments SET status = 'completed', completed_at = NOW() WHERE id = $1`,
        [assignment_id],
    );
    await client.query(
        `UPDATE volunteer_tasks SET status = 'completed' WHERE id = $1`,
        [task_id],
    );

    await awardPoints(client, {
        userId:      volunteer_id,
        complaintId,
        taskId:      task_id,
        points:      POINTS.community_fix,
        type:        "community_fix",
    });

    await notify(client, {
        userId:     volunteer_id,
        type:       "FIX_VERIFIED",
        title:      "🎉 Your fix was accepted!",
        body:       "The community verified your fix. The complaint has been resolved!",
        data:       { taskId: task_id, complaintId, pointsEarned: POINTS.community_fix },
        entityType: "task",
        entityId:   task_id,
    });

    await notify(client, {
        userId:     volunteer_id,
        type:       "COMMUNITY_FIX_POINTS_EARNED",
        title:      `+${POINTS.community_fix} points earned!`,
        body:       `You earned ${POINTS.community_fix} points for resolving a community complaint. Keep it up!`,
        data:       { points: POINTS.community_fix, taskId: task_id, complaintId },
        entityType: "task",
        entityId:   task_id,
    });

    return { volunteerId: volunteer_id, taskId: task_id, pointsAwarded: POINTS.community_fix };
}

module.exports = {
    createVolunteerTask,
    findOpenTasks,
    claimTask,
    submitTaskCompletion,
    findMyTasks,
    getMyTasksSummary,
    getImpactStats,
    getVolunteerRank,
    getCityWideStats,
    getLeaderboard,
    awardPoints,
    finalizeTaskOnResolution,
    POINTS,
};
