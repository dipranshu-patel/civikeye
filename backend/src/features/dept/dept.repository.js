"use strict";

const { query, withTransaction } = require("../../shared/db/query");
const {
    uploadBufferToCloudinary,
} = require("../../shared/middlewares/upload.middleware");

const COMPLAINT_COLS = `
    c.id,
    c.public_code,
    c.reporter_id,
    c.title,
    c.description,
    c.category_id,
    cat.name              AS category_name,
    c.department_id,
    d.name                AS department_name,
    d.code                AS department_code,
    c.issue_type,
    c.status,
    c.address_text,
    c.latitude,
    c.longitude,
    c.sla_deadline,
    c.resolved_at,
    c.reopen_count,
    c.upvote_count,
    c.verification_started_at,
    c.verification_deadline,
    c.created_at,
    c.updated_at
`;

const COMPLAINT_JOINS = `
    FROM complaints c
    JOIN sla_categories cat ON cat.id = c.category_id
    JOIN departments    d   ON d.id   = c.department_id
`;

const TAB_STATUS = {
    assigned: ["reported"],
    in_progress: ["in_progress"],
    pending_verification: ["pending_verification"],
    resolved: ["resolved"],
    reopened: ["reopened"],
};

async function getDeptSummaryCounts(departmentId) {
    const sql = `
        SELECT
            COUNT(*) FILTER (WHERE status = 'reported')              ::INT  AS assigned,
            COUNT(*) FILTER (WHERE status = 'in_progress')           ::INT  AS in_progress,
            COUNT(*) FILTER (WHERE status = 'pending_verification')  ::INT  AS pending_verification,
            COUNT(*) FILTER (WHERE status = 'resolved'
                             AND DATE_TRUNC('month', resolved_at) = DATE_TRUNC('month', NOW()))
                                                                     ::INT  AS resolved_this_month,
            COUNT(*) FILTER (
                WHERE status IN ('reported', 'in_progress', 'reopened')
                  AND sla_deadline IS NOT NULL
                  AND sla_deadline < NOW()
            )                                                        ::INT  AS overdue,
            COUNT(*) FILTER (WHERE status = 'reopened')              ::INT  AS reopened
        FROM complaints
        WHERE department_id = $1
          AND issue_type = 'authority_required';
    `;
    const { rows } = await query(sql, [departmentId]);
    return rows[0];
}

async function findUrgentComplaints(departmentId) {
    const sql = `
        SELECT ${COMPLAINT_COLS},
               (SELECT url FROM complaint_photos WHERE complaint_id = c.id ORDER BY position ASC LIMIT 1) AS cover_photo
        ${COMPLAINT_JOINS}
        WHERE c.department_id = $1
          AND c.issue_type    = 'authority_required'
          AND c.status IN ('reported', 'in_progress', 'reopened')
          AND c.sla_deadline IS NOT NULL
          AND c.sla_deadline < NOW()
        ORDER BY c.sla_deadline ASC
        LIMIT 6;
    `;
    const { rows } = await query(sql, [departmentId]);
    return rows;
}

async function findDeptRecentActivity(departmentId) {
    const sql = `
        SELECT
            csh.to_status,
            csh.note,
            csh.actor_role,
            csh.created_at,
            c.title,
            c.public_code
        FROM complaint_status_history csh
        JOIN complaints c ON c.id = csh.complaint_id
        WHERE c.department_id = $1
        ORDER BY csh.created_at DESC
        LIMIT 8;
    `;
    const { rows } = await query(sql, [departmentId]);
    return rows;
}

async function getDeptPerformance(departmentId) {
    const sql = `
        SELECT
            resolution_rate_pct,
            avg_resolution_days,
            sla_target_days,
            overdue_rate_pct,
            overdue_count,
            resolved_this_month,
            total_complaints,
            resolved_count
        FROM dept_performance
        WHERE department_id = $1
        LIMIT 1;
    `;
    const { rows } = await query(sql, [departmentId]);
    return rows[0] ?? null;
}

async function findDeptComplaints({ departmentId, tab, search, page, limit }) {
    const statuses = TAB_STATUS[tab] ?? ["reported"];

    const conditions = [
        `c.department_id = $1`,
        `c.issue_type    = 'authority_required'`,
        `c.status = ANY($2::text[])`,
    ];
    const values = [departmentId, statuses];
    let idx = 3;

    if (search) {
        conditions.push(
            `(c.title ILIKE $${idx} OR c.public_code ILIKE $${idx})`,
        );
        values.push(`%${search}%`);
        idx++;
    }

    const where = `WHERE ${conditions.join(" AND ")}`;
    const offset = (page - 1) * limit;

    const sql = `
        SELECT ${COMPLAINT_COLS},
               (SELECT url FROM complaint_photos WHERE complaint_id = c.id ORDER BY position ASC LIMIT 1) AS cover_photo,
               -- Last note from status_history (used as sub-status tag in UI)
               (
                   SELECT note FROM complaint_status_history
                   WHERE complaint_id = c.id
                   ORDER BY created_at DESC LIMIT 1
               ) AS latest_note,
               -- Reopen reason (most recent note where to_status='reopened')
               (
                   SELECT note FROM complaint_status_history
                   WHERE complaint_id = c.id AND to_status = 'reopened'
                   ORDER BY created_at DESC LIMIT 1
               ) AS reopen_reason,
               COUNT(*) OVER () ::INT AS total_count
        ${COMPLAINT_JOINS}
        ${where}
        ORDER BY
            CASE WHEN c.sla_deadline IS NOT NULL AND c.sla_deadline < NOW() THEN 0 ELSE 1 END,
            c.sla_deadline ASC NULLS LAST,
            c.created_at DESC
        LIMIT $${idx} OFFSET $${idx + 1};
    `;
    values.push(limit, offset);

    const { rows } = await query(sql, values);
    return rows;
}

async function findDeptComplaintById(id, departmentId) {
    const sql = `
        SELECT ${COMPLAINT_COLS}
        ${COMPLAINT_JOINS}
        WHERE c.id = $1
          AND c.department_id = $2
          AND c.issue_type    = 'authority_required'
        LIMIT 1;
    `;
    const { rows } = await query(sql, [id, departmentId]);
    return rows[0] ?? null;
}

async function findComplaintPhotos(complaintId) {
    const { rows } = await query(
        `SELECT id, url, public_id, position FROM complaint_photos WHERE complaint_id = $1 ORDER BY position ASC`,
        [complaintId],
    );
    return rows;
}

async function findStatusHistory(complaintId) {
    const sql = `
        SELECT
            csh.id, csh.from_status, csh.to_status, csh.actor_role, csh.note, csh.created_at,
            u.full_name AS actor_name
        FROM complaint_status_history csh
        LEFT JOIN users u ON u.id = csh.actor_id
        WHERE csh.complaint_id = $1
        ORDER BY csh.created_at ASC;
    `;
    const { rows } = await query(sql, [complaintId]);
    return rows;
}

async function applyStatusTransition({
    complaintId,
    fromStatus,
    toStatus,
    actorId,
    note,
    workPhotos,
}) {
    const uploadedPhotos = [];

    if (workPhotos?.length) {
        for (const [i, file] of workPhotos.entries()) {
            const result = await uploadBufferToCloudinary(file.buffer, {
                folder: "civikeye/resolution",
            });
            uploadedPhotos.push({
                url: result.url,
                publicId: result.publicId,
                position: i,
            });
        }
    }

    const result = await withTransaction(async (client) => {
        const updateFields = [`status = $2`];
        const updateValues = [complaintId, toStatus];
        let idx = 3;

        if (toStatus === "pending_verification") {
            updateFields.push(`verification_started_at = NOW()`);
            updateFields.push(
                `verification_deadline = NOW() + INTERVAL '72 hours'`,
            );
        }
        if (toStatus === "in_progress" || toStatus === "pending_verification") {
        }

        const { rows: updRows } = await client.query(
            `UPDATE complaints
             SET ${updateFields.join(", ")}
             WHERE id = $1
             RETURNING id, public_code, status, verification_started_at, verification_deadline, updated_at`,
            updateValues,
        );
        const updated = updRows[0];

        await client.query(
            `INSERT INTO complaint_status_history
                 (complaint_id, from_status, to_status, actor_id, actor_role, note)
             VALUES ($1, $2, $3, $4, 'department', $5)`,
            [complaintId, fromStatus, toStatus, actorId, note ?? null],
        );

        for (const photo of uploadedPhotos) {
            await client.query(
                `INSERT INTO complaint_photos (complaint_id, url, public_id, position)
                 VALUES ($1, $2, $3, $4)`,
                [complaintId, photo.url, photo.publicId, photo.position],
            );
        }

        return updated;
    });

    return { updated: result, photos: uploadedPhotos };
}

module.exports = {
    getDeptSummaryCounts,
    findUrgentComplaints,
    findDeptRecentActivity,
    getDeptPerformance,
    findDeptComplaints,
    findDeptComplaintById,
    findComplaintPhotos,
    findStatusHistory,
    applyStatusTransition,
    TAB_STATUS,
};
