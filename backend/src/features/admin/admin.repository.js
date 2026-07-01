"use strict";

const { query } = require("../../shared/db/query");

// ─── Dashboard stats ──────────────────────────────────────────────────────────

async function getDashboardStats() {
    const sql = `
        SELECT
            COUNT(*)                                                        ::INT AS total_complaints,
            COUNT(*) FILTER (WHERE issue_type = 'authority_required')      ::INT AS authority_complaints,
            COUNT(*) FILTER (WHERE issue_type = 'community_fixable')       ::INT AS volunteer_complaints,
            COUNT(*) FILTER (
                WHERE status NOT IN ('resolved')
                  AND sla_deadline IS NOT NULL
                  AND sla_deadline < NOW()
            )                                                               ::INT AS overdue_complaints
        FROM complaints;
    `;
    const { rows } = await query(sql);
    return rows[0];
}

async function getDeptCounts() {
    const { rows } = await query(`
        SELECT
            COUNT(*)                              ::INT AS total,
            COUNT(*) FILTER (WHERE is_active)     ::INT AS active,
            COUNT(*) FILTER (WHERE NOT is_active) ::INT AS inactive
        FROM departments;
    `);
    return rows[0];
}

// ─── Recent activity (last N audit log entries for dashboard) ─────────────────

async function getRecentActivity(limit = 8) {
    const sql = `
        SELECT
            al.id,
            al.action,
            al.entity_type,
            al.entity_id,
            al.metadata,
            al.created_at,
            u.full_name  AS actor_name,
            al.actor_role
        FROM audit_logs al
        LEFT JOIN users u ON u.id = al.actor_id
        ORDER BY al.created_at DESC
        LIMIT $1;
    `;
    const { rows } = await query(sql, [limit]);
    return rows;
}

// ─── Audit log summary cards ──────────────────────────────────────────────────

async function getAuditLogSummary() {
    const sql = `
        SELECT
            COUNT(*)                                                          ::INT AS total,
            COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)               ::INT AS today_count,
            COUNT(*) FILTER (WHERE entity_type = 'department')               ::INT AS dept_changes,
            COUNT(*) FILTER (WHERE entity_type = 'sla_category')             ::INT AS sla_updates
        FROM audit_logs;
    `;
    const { rows } = await query(sql);
    return rows[0];
}

// ─── Audit log list (paginated + filtered) ────────────────────────────────────

async function findAuditLogs({ search, action, entityType, dateFrom, dateTo, page, limit }) {
    const conditions = [];
    const values     = [];
    let   idx        = 1;

    if (search) {
        conditions.push(`(
            u.full_name ILIKE $${idx}
            OR al.metadata->>'entityName' ILIKE $${idx}
            OR al.metadata->>'entityCode' ILIKE $${idx}
        )`);
        values.push(`%${search}%`);
        idx++;
    }
    if (action) {
        conditions.push(`al.action = $${idx}`);
        values.push(action.toUpperCase());
        idx++;
    }
    if (entityType) {
        conditions.push(`al.entity_type = $${idx}`);
        values.push(entityType);
        idx++;
    }
    if (dateFrom) {
        conditions.push(`al.created_at >= $${idx}`);
        values.push(dateFrom);
        idx++;
    }
    if (dateTo) {
        conditions.push(`al.created_at <= $${idx}`);
        values.push(dateTo);
        idx++;
    }

    const where  = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    const sql = `
        SELECT
            al.id,
            al.action,
            al.entity_type,
            al.entity_id,
            al.metadata,
            al.actor_role,
            al.created_at,
            u.full_name  AS actor_name,
            -- Sequential LOG-XXX display code (stable order by created_at ASC)
            'LOG-' || LPAD(
                ROW_NUMBER() OVER (ORDER BY al.created_at ASC)::TEXT,
                3, '0'
            ) AS log_code,
            COUNT(*) OVER () ::INT AS total_count
        FROM audit_logs al
        LEFT JOIN users u ON u.id = al.actor_id
        ${where}
        ORDER BY al.created_at DESC
        LIMIT $${idx} OFFSET $${idx + 1};
    `;
    values.push(limit, offset);

    const { rows } = await query(sql, values);
    return rows;
}

// ─── Single audit log detail ──────────────────────────────────────────────────

async function findAuditLogById(id) {
    const sql = `
        SELECT
            al.id,
            al.action,
            al.entity_type,
            al.entity_id,
            al.metadata,
            al.actor_role,
            al.created_at,
            u.full_name AS actor_name,
            'LOG-' || LPAD(
                (
                    SELECT COUNT(*)::TEXT
                    FROM audit_logs older
                    WHERE older.created_at <= al.created_at
                ),
                3, '0'
            ) AS log_code
        FROM audit_logs al
        LEFT JOIN users u ON u.id = al.actor_id
        WHERE al.id = $1
        LIMIT 1;
    `;
    const { rows } = await query(sql, [id]);
    return rows[0] ?? null;
}

module.exports = {
    getDashboardStats,
    getDeptCounts,
    getRecentActivity,
    getAuditLogSummary,
    findAuditLogs,
    findAuditLogById,
};
