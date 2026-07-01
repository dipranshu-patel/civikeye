"use strict";

const repo     = require("./admin.repository");
const AppError = require("../../shared/utils/app-error");

// ─── Dashboard ────────────────────────────────────────────────────────────────

async function getAdminDashboard() {
    const [stats, deptCounts, recentActivity] = await Promise.all([
        repo.getDashboardStats(),
        repo.getDeptCounts(),
        repo.getRecentActivity(8),
    ]);

    return {
        summaryCards: {
            totalComplaints:     stats.total_complaints,
            authorityComplaints: stats.authority_complaints,
            volunteerComplaints: stats.volunteer_complaints,
            activeDepartments:   deptCounts.active,
            overdueComplaints:   stats.overdue_complaints,
        },
        recentActivity: recentActivity.map(formatActivity),
        systemSnapshot: {
            departments: {
                total:    deptCounts.total,
                active:   deptCounts.active,
                inactive: deptCounts.inactive,
            },
        },
    };
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

async function getAuditLogs({ search, action, entityType, dateFrom, dateTo, page, limit }) {
    const [summary, rows] = await Promise.all([
        repo.getAuditLogSummary(),
        repo.findAuditLogs({ search, action, entityType, dateFrom, dateTo, page, limit }),
    ]);

    const total = rows[0]?.total_count ?? 0;

    return {
        summaryCards: {
            total:       summary.total,
            todayCount:  summary.today_count,
            deptChanges: summary.dept_changes,
            slaUpdates:  summary.sla_updates,
        },
        logs:       rows.map(formatLog),
        pagination: { page, limit, total },
    };
}

async function getAuditLogDetail(id) {
    const log = await repo.findAuditLogById(id);
    if (!log) throw new AppError("LOG_NOT_FOUND", "Audit log entry not found.", 404);
    return formatLog(log);
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatLog(row) {
    return {
        id:         row.id,
        logCode:    row.log_code,
        action:     row.action,
        entityType: row.entity_type,
        entityId:   row.entity_id ?? null,
        actorName:  row.actor_name ?? "System",
        actorRole:  row.actor_role,
        metadata:   row.metadata ?? {},
        createdAt:  row.created_at,
    };
}

function formatActivity(row) {
    return {
        id:         row.id,
        action:     row.action,
        entityType: row.entity_type,
        entityName: row.metadata?.entityName ?? null,
        entityCode: row.metadata?.entityCode ?? null,
        actorName:  row.actor_name ?? "System",
        actorRole:  row.actor_role,
        createdAt:  row.created_at,
    };
}

module.exports = { getAdminDashboard, getAuditLogs, getAuditLogDetail };
