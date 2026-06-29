"use strict";

const { query } = require("../../shared/db/query");

// ─── Haversine distance (metres) — pure JS, no PostGIS needed ────────────────

function haversineMetres(lat1, lng1, lat2, lng2) {
    const R  = 6_371_000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a  =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Shared SELECT columns for complaint list/detail ─────────────────────────

const COMPLAINT_COLS = `
    c.id,
    c.public_code,
    c.reporter_id,
    c.title,
    c.description,
    c.category_id,
    cat.name          AS category_name,
    c.department_id,
    d.name            AS department_name,
    d.code            AS department_code,
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

// ─── Insert ───────────────────────────────────────────────────────────────────

async function insertComplaint(
    client,
    { reporterId, title, description, categoryId, departmentId, issueType, addressText, latitude, longitude, slaDeadline },
) {
    const sql = `
        INSERT INTO complaints
            (reporter_id, title, description, category_id, department_id,
             issue_type, address_text, latitude, longitude, sla_deadline)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, public_code, status, created_at;
    `;

    const { rows } = await client.query(sql, [
        reporterId, title, description ?? null, categoryId, departmentId,
        issueType, addressText ?? null, latitude, longitude, slaDeadline ?? null,
    ]);
    return rows[0];
}

async function insertPhoto(client, { complaintId, url, publicId, position }) {
    const sql = `
        INSERT INTO complaint_photos (complaint_id, url, public_id, position)
        VALUES ($1, $2, $3, $4)
        RETURNING id, url, public_id, position;
    `;
    const { rows } = await client.query(sql, [complaintId, url, publicId, position]);
    return rows[0];
}

async function insertStatusHistory(client, { complaintId, fromStatus, toStatus, actorId, actorRole, note }) {
    const sql = `
        INSERT INTO complaint_status_history
            (complaint_id, from_status, to_status, actor_id, actor_role, note)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
    `;
    const { rows } = await client.query(sql, [
        complaintId, fromStatus ?? null, toStatus, actorId ?? null, actorRole ?? "system", note ?? null,
    ]);
    return rows[0];
}

// ─── Read — single ────────────────────────────────────────────────────────────

async function findComplaintById(id) {
    const sql = `
        SELECT ${COMPLAINT_COLS}
        ${COMPLAINT_JOINS}
        WHERE c.id = $1
        LIMIT 1;
    `;
    const { rows } = await query(sql, [id]);
    return rows[0] ?? null;
}

async function findComplaintPhotos(complaintId) {
    const sql = `
        SELECT id, url, public_id, position
        FROM complaint_photos
        WHERE complaint_id = $1
        ORDER BY position ASC;
    `;
    const { rows } = await query(sql, [complaintId]);
    return rows;
}

async function findStatusHistory(complaintId) {
    const sql = `
        SELECT
            csh.id,
            csh.from_status,
            csh.to_status,
            csh.actor_id,
            csh.actor_role,
            csh.note,
            csh.created_at,
            u.full_name AS actor_name
        FROM complaint_status_history csh
        LEFT JOIN users u ON u.id = csh.actor_id
        WHERE csh.complaint_id = $1
        ORDER BY csh.created_at ASC;
    `;
    const { rows } = await query(sql, [complaintId]);
    return rows;
}

// ─── Read — Explore (paginated) ───────────────────────────────────────────────

async function findComplaintsExplore({ search, statusList, issueType, categoryId, departmentId, sort, page, limit }) {
    const conditions = [];
    const values     = [];
    let   idx        = 1;

    if (search) {
        conditions.push(`c.title ILIKE $${idx}`);
        values.push(`%${search}%`);
        idx++;
    }
    if (statusList?.length) {
        conditions.push(`c.status = ANY($${idx}::text[])`);
        values.push(statusList);
        idx++;
    }
    if (issueType) {
        conditions.push(`c.issue_type = $${idx}`);
        values.push(issueType);
        idx++;
    }
    if (categoryId) {
        conditions.push(`c.category_id = $${idx}`);
        values.push(categoryId);
        idx++;
    }
    if (departmentId) {
        conditions.push(`c.department_id = $${idx}`);
        values.push(departmentId);
        idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const orderMap = {
        most_upvoted: "c.upvote_count DESC",
        sla_deadline: "c.sla_deadline ASC NULLS LAST",
        recent:       "c.created_at DESC",
    };
    const orderBy = orderMap[sort] ?? "c.created_at DESC";

    const offset = (page - 1) * limit;

    const sql = `
        SELECT ${COMPLAINT_COLS},
               (SELECT url FROM complaint_photos WHERE complaint_id = c.id ORDER BY position ASC LIMIT 1) AS cover_photo,
               COUNT(*) OVER () ::INT AS total_count
        ${COMPLAINT_JOINS}
        ${where}
        ORDER BY ${orderBy}
        LIMIT $${idx} OFFSET $${idx + 1};
    `;
    values.push(limit, offset);

    const { rows } = await query(sql, values);
    return rows;
}

// ─── Read — Nearby ────────────────────────────────────────────────────────────

async function findNearbyComplaints({ lat, lng, radiusMetres }) {
    // Bounding box pre-filter (~1 deg lat ≈ 111 km)
    const delta = radiusMetres / 111_000;
    const sql   = `
        SELECT ${COMPLAINT_COLS},
               (SELECT url FROM complaint_photos WHERE complaint_id = c.id ORDER BY position ASC LIMIT 1) AS cover_photo
        ${COMPLAINT_JOINS}
        WHERE c.status NOT IN ('resolved')
          AND c.latitude  BETWEEN $1 AND $2
          AND c.longitude BETWEEN $3 AND $4
        ORDER BY c.created_at DESC
        LIMIT 50;
    `;
    const { rows } = await query(sql, [lat - delta, lat + delta, lng - delta, lng + delta]);

    // JS Haversine exact filter
    return rows.filter((r) => haversineMetres(lat, lng, r.latitude, r.longitude) <= radiusMetres);
}

// ─── Read — Similar (duplicate panel, 100 m + same category) ─────────────────

async function findSimilarComplaints({ lat, lng, categoryId, excludeId }) {
    const delta = 0.001; // ~111 m box
    const sql   = `
        SELECT ${COMPLAINT_COLS},
               (SELECT url FROM complaint_photos WHERE complaint_id = c.id ORDER BY position ASC LIMIT 1) AS cover_photo
        ${COMPLAINT_JOINS}
        WHERE c.status NOT IN ('resolved')
          AND c.category_id = $1
          AND c.id != $2
          AND c.latitude  BETWEEN $3 AND $4
          AND c.longitude BETWEEN $5 AND $6
        ORDER BY c.upvote_count DESC
        LIMIT 10;
    `;
    const { rows } = await query(sql, [categoryId, excludeId ?? "00000000-0000-0000-0000-000000000000", lat - delta, lat + delta, lng - delta, lng + delta]);
    return rows.filter((r) => haversineMetres(lat, lng, r.latitude, r.longitude) <= 100);
}

// ─── Read — My Complaints ─────────────────────────────────────────────────────

async function findMyComplaints({ reporterId, tab, search, sort, page, limit }) {
    const conditions = [`c.reporter_id = $1`];
    const values     = [reporterId];
    let   idx        = 2;

    // Map tab → status filter
    if (tab === "active")               conditions.push(`c.status IN ('reported','in_progress','reopened')`);
    if (tab === "pending_verification") conditions.push(`c.status = 'pending_verification'`);
    if (tab === "resolved")             conditions.push(`c.status = 'resolved'`);
    if (tab === "reopened")             conditions.push(`c.status = 'reopened'`);

    if (search) {
        conditions.push(`(c.title ILIKE $${idx} OR c.public_code ILIKE $${idx})`);
        values.push(`%${search}%`);
        idx++;
    }

    const orderMap = {
        most_upvoted:          "c.upvote_count DESC",
        sla_breached:          "c.sla_deadline ASC NULLS LAST",
        awaiting_verification: "c.verification_deadline ASC NULLS LAST",
        recent:                "c.updated_at DESC",
    };
    const orderBy = orderMap[sort] ?? "c.updated_at DESC";
    const offset  = (page - 1) * limit;

    const where = `WHERE ${conditions.join(" AND ")}`;

    const sql = `
        SELECT ${COMPLAINT_COLS},
               (SELECT url FROM complaint_photos WHERE complaint_id = c.id ORDER BY position ASC LIMIT 1) AS cover_photo,
               COUNT(*) OVER () ::INT AS total_count
        ${COMPLAINT_JOINS}
        ${where}
        ORDER BY ${orderBy}
        LIMIT $${idx} OFFSET $${idx + 1};
    `;
    values.push(limit, offset);

    const { rows } = await query(sql, values);
    return rows;
}

async function findMyComplaintSummary(reporterId) {
    const sql = `
        SELECT
            COUNT(*) FILTER (WHERE status IN ('reported','in_progress','reopened'))  ::INT AS active,
            COUNT(*) FILTER (WHERE status = 'pending_verification')                  ::INT AS pending_verification,
            COUNT(*) FILTER (WHERE status = 'resolved')                              ::INT AS resolved,
            COUNT(*) FILTER (WHERE status = 'reopened')                              ::INT AS reopened,
            COUNT(*) FILTER (
                WHERE status IN ('reported','in_progress')
                  AND sla_deadline IS NOT NULL
                  AND sla_deadline < NOW()
            )                                                                        ::INT AS overdue,
            COUNT(*) FILTER (WHERE status = 'pending_verification'
                               AND sla_deadline IS NOT NULL
                               AND sla_deadline < NOW() + INTERVAL '24 hours')       ::INT AS closes_soon_count,
            ROUND(AVG(
                CASE WHEN status = 'resolved' AND sla_deadline IS NOT NULL AND resolved_at > sla_deadline
                     THEN EXTRACT(EPOCH FROM (resolved_at - sla_deadline)) / 3600
                END
            ), 1)                                                                    AS avg_overdue_hours
        FROM complaints
        WHERE reporter_id = $1;
    `;
    const { rows } = await query(sql, [reporterId]);
    return rows[0];
}

// ─── Duplicate guard ──────────────────────────────────────────────────────────

async function findDuplicateCandidates({ lat, lng, categoryId }) {
    const delta = 0.001;
    const sql   = `
        SELECT ${COMPLAINT_COLS}
        ${COMPLAINT_JOINS}
        WHERE c.status NOT IN ('resolved')
          AND c.category_id = $1
          AND c.latitude  BETWEEN $2 AND $3
          AND c.longitude BETWEEN $4 AND $5
        ORDER BY c.upvote_count DESC;
    `;
    const { rows } = await query(sql, [categoryId, lat - delta, lat + delta, lng - delta, lng + delta]);
    return rows.filter((r) => haversineMetres(lat, lng, r.latitude, r.longitude) <= 100);
}

// ─── Upvotes ──────────────────────────────────────────────────────────────────

async function hasUserUpvoted(complaintId, userId) {
    const sql = `SELECT 1 FROM complaint_upvotes WHERE complaint_id=$1 AND user_id=$2 LIMIT 1;`;
    const { rows } = await query(sql, [complaintId, userId]);
    return rows.length > 0;
}

async function insertUpvote(client, complaintId, userId) {
    await client.query(
        `INSERT INTO complaint_upvotes (complaint_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
        [complaintId, userId],
    );
    const { rows } = await client.query(
        `UPDATE complaints SET upvote_count = upvote_count + 1 WHERE id = $1 RETURNING upvote_count;`,
        [complaintId],
    );
    return rows[0]?.upvote_count ?? 0;
}

async function deleteUpvote(client, complaintId, userId) {
    const { rowCount } = await client.query(
        `DELETE FROM complaint_upvotes WHERE complaint_id = $1 AND user_id = $2;`,
        [complaintId, userId],
    );
    if (rowCount > 0) {
        const { rows } = await client.query(
            `UPDATE complaints SET upvote_count = GREATEST(upvote_count - 1, 0) WHERE id = $1 RETURNING upvote_count;`,
            [complaintId],
        );
        return rows[0]?.upvote_count ?? 0;
    }
    return null; // no upvote to delete
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

async function findDashboardData(userId, { lat, lng, nearbyRadius = 2000 }) {
    // Summary counts
    const summarySQL = `
        SELECT
            COUNT(*) FILTER (WHERE reporter_id=$1 AND status IN ('reported','in_progress','reopened')) ::INT AS my_active,
            COUNT(*) FILTER (WHERE reporter_id=$1 AND status = 'pending_verification')                 ::INT AS my_pending_verification
        FROM complaints;
    `;
    const { rows: sumRows } = await query(summarySQL, [userId]);

    // Recent 3 of my complaints
    const myRecentSQL = `
        SELECT ${COMPLAINT_COLS},
               (SELECT url FROM complaint_photos WHERE complaint_id = c.id ORDER BY position ASC LIMIT 1) AS cover_photo
        ${COMPLAINT_JOINS}
        WHERE c.reporter_id = $1 AND c.status NOT IN ('resolved')
        ORDER BY c.updated_at DESC
        LIMIT 3;
    `;
    const { rows: myRecent } = await query(myRecentSQL, [userId]);

    // Pending verifications near user (within nearbyRadius)
    let nearbyPending = [];
    if (lat && lng) {
        const delta = nearbyRadius / 111_000;
        const nearbySQL = `
            SELECT ${COMPLAINT_COLS},
                   (SELECT url FROM complaint_photos WHERE complaint_id = c.id ORDER BY position ASC LIMIT 1) AS cover_photo
            ${COMPLAINT_JOINS}
            WHERE c.status = 'pending_verification'
              AND c.reporter_id != $1
              AND c.latitude  BETWEEN $2 AND $3
              AND c.longitude BETWEEN $4 AND $5
            ORDER BY c.verification_deadline ASC NULLS LAST
            LIMIT 5;
        `;
        const { rows } = await query(nearbySQL, [userId, lat - delta, lat + delta, lng - delta, lng + delta]);
        nearbyPending = rows.filter((r) => haversineMetres(lat, lng, r.latitude, r.longitude) <= nearbyRadius);
    }

    // Recent activity (status changes involving me as reporter)
    const activitySQL = `
        SELECT
            csh.to_status,
            csh.note,
            csh.created_at,
            c.title,
            c.public_code
        FROM complaint_status_history csh
        JOIN complaints c ON c.id = csh.complaint_id
        WHERE c.reporter_id = $1
        ORDER BY csh.created_at DESC
        LIMIT 5;
    `;
    const { rows: activity } = await query(activitySQL, [userId]);

    return {
        summary: sumRows[0],
        myRecentComplaints: myRecent,
        nearbyPendingVerifications: nearbyPending,
        recentActivity: activity,
    };
}

module.exports = {
    insertComplaint,
    insertPhoto,
    insertStatusHistory,
    findComplaintById,
    findComplaintPhotos,
    findStatusHistory,
    findComplaintsExplore,
    findNearbyComplaints,
    findSimilarComplaints,
    findMyComplaints,
    findMyComplaintSummary,
    findDuplicateCandidates,
    hasUserUpvoted,
    insertUpvote,
    deleteUpvote,
    findDashboardData,
    haversineMetres,
};
