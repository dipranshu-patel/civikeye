"use strict";

const repo     = require("./dept.repository");
const AppError = require("../../shared/utils/app-error");
const { notify, notifyNearbyCitizens } = require("../../shared/utils/notify");

const VALID_TRANSITIONS = {
    reported:    ["in_progress"],
    in_progress: ["pending_verification"],
    reopened:    ["in_progress"],
};

function assertValidTransition(fromStatus, toStatus) {
    const allowed = VALID_TRANSITIONS[fromStatus];
    if (!allowed || !allowed.includes(toStatus)) {
        throw new AppError(
            "INVALID_TRANSITION",
            `Cannot move from '${fromStatus}' to '${toStatus}'. Departments may only: reported→in_progress, in_progress→pending_verification, reopened→in_progress.`,
            422,
        );
    }
}

function formatComplaint(row) {
    const now       = new Date();
    const deadline  = row.sla_deadline ? new Date(row.sla_deadline) : null;
    const isOverdue = deadline && !["resolved", "pending_verification"].includes(row.status)
        ? deadline < now
        : false;

    const daysUntilSla = deadline && !isOverdue
        ? Math.ceil((deadline - now) / 86_400_000)
        : null;

    return {
        id:                    row.id,
        publicCode:            row.public_code,
        title:                 row.title,
        description:           row.description ?? null,
        category:              { id: row.category_id, name: row.category_name },
        department:            { id: row.department_id, name: row.department_name, code: row.department_code },
        issueType:             row.issue_type,
        status:                row.status,
        addressText:           row.address_text ?? null,
        latitude:              parseFloat(row.latitude),
        longitude:             parseFloat(row.longitude),
        slaDeadline:           row.sla_deadline ?? null,
        resolvedAt:            row.resolved_at ?? null,
        reopenCount:           row.reopen_count,
        upvoteCount:           row.upvote_count,
        verificationStartedAt: row.verification_started_at ?? null,
        verificationDeadline:  row.verification_deadline ?? null,
        coverPhoto:            row.cover_photo ?? null,
        latestNote:            row.latest_note ?? null,
        reopenReason:          row.reopen_reason ?? null,
        isOverdue,
        daysUntilSla,
        createdAt:             row.created_at,
        updatedAt:             row.updated_at,
    };
}

function formatSummary(row) {
    return {
        assigned:             row.assigned,
        inProgress:           row.in_progress,
        pendingVerification:  row.pending_verification,
        resolvedThisMonth:    row.resolved_this_month,
        overdue:              row.overdue,
        reopened:             row.reopened,
    };
}

function formatPerformance(row) {
    if (!row) return null;
    return {
        resolutionRate:    row.resolution_rate_pct    ? parseFloat(row.resolution_rate_pct)    : null,
        avgResolutionDays: row.avg_resolution_days    ? parseFloat(row.avg_resolution_days)    : null,
        slaTargetDays:     row.sla_target_days        ?? null,
        overdueRate:       row.overdue_rate_pct       ? parseFloat(row.overdue_rate_pct)       : null,
        overdueCount:      row.overdue_count          ?? 0,
        totalComplaints:   row.total_complaints       ?? 0,
        resolvedCount:     row.resolved_count         ?? 0,
        resolvedThisMonth: row.resolved_this_month    ?? 0,
    };
}

async function getDeptDashboard(departmentId) {
    const [summary, urgents, activity, performance] = await Promise.all([
        repo.getDeptSummaryCounts(departmentId),
        repo.findUrgentComplaints(departmentId),
        repo.findDeptRecentActivity(departmentId),
        repo.getDeptPerformance(departmentId),
    ]);

    return {
        summary:           formatSummary(summary),
        urgentComplaints:  urgents.map(formatComplaint),
        recentActivity:    activity,
        performance:       formatPerformance(performance),
    };
}

async function getDeptComplaints({ departmentId, tab = "assigned", search, page = 1, limit = 20 }) {
    const [rows, summary] = await Promise.all([
        repo.findDeptComplaints({ departmentId, tab, search, page, limit }),
        repo.getDeptSummaryCounts(departmentId),
    ]);

    const total = rows[0]?.total_count ?? 0;

    return {
        tabCounts:  formatSummary(summary),
        complaints: rows.map(formatComplaint),
        pagination: { page, limit, total },
    };
}

async function getDeptComplaintDetail(id, departmentId) {
    const complaint = await repo.findDeptComplaintById(id, departmentId);
    if (!complaint) {
        throw new AppError("COMPLAINT_NOT_FOUND", "Complaint not found in your department.", 404);
    }

    const [photos, history] = await Promise.all([
        repo.findComplaintPhotos(id),
        repo.findStatusHistory(id),
    ]);

    return {
        ...formatComplaint(complaint),
        photos:  photos.map((p) => ({ id: p.id, url: p.url, position: p.position })),
        history: history.map((h) => ({
            id:         h.id,
            fromStatus: h.from_status ?? null,
            toStatus:   h.to_status,
            actorName:  h.actor_name ?? null,
            actorRole:  h.actor_role ?? null,
            note:       h.note ?? null,
            createdAt:  h.created_at,
        })),
    };
}

async function updateComplaintStatus({ complaintId, departmentId, actorId, toStatus, note, workPhotos }) {
    const complaint = await repo.findDeptComplaintById(complaintId, departmentId);
    if (!complaint) {
        throw new AppError("COMPLAINT_NOT_FOUND", "Complaint not found in your department.", 404);
    }

    if (complaint.issue_type === "community_fixable") {
        throw new AppError(
            "COMMUNITY_FIXABLE_NOT_DEPT",
            "This complaint is community-fixable and must be handled by a volunteer, not a department official.",
            403,
        );
    }

    assertValidTransition(complaint.status, toStatus);

    if (toStatus === "pending_verification") {
        if (!note?.trim()) {
            throw new AppError("NOTE_REQUIRED", "A resolution note is required when submitting proof.", 422);
        }
        if (!workPhotos?.length) {
            throw new AppError("PHOTO_REQUIRED", "At least one work photo is required as proof of resolution.", 422);
        }
    }

    const { updated, photos } = await repo.applyStatusTransition({
        complaintId,
        fromStatus: complaint.status,
        toStatus,
        actorId,
        note,
        workPhotos,
    });

    const reporterId = complaint.reporter_id;
    const publicCode = complaint.public_code;

    if (toStatus === "in_progress" && reporterId) {
        notify(null, {
            userId:     reporterId,
            type:       "COMPLAINT_IN_PROGRESS",
            title:      "Department is working on your complaint",
            body:       `A department official has started working on "${complaint.title}".`,
            data:       { publicCode, complaintId, newStatus: "in_progress" },
            entityType: "complaint",
            entityId:   complaintId,
        });
    }

    if (toStatus === "pending_verification" && reporterId) {
        notify(null, {
            userId:     reporterId,
            type:       "COMPLAINT_DEPT_PENDING_VERIFICATION",
            title:      "Fix submitted — community verifying",
            body:       `The department has submitted a resolution for "${complaint.title}". Community is now verifying.`,
            data:       { publicCode, complaintId, newStatus: "pending_verification" },
            entityType: "complaint",
            entityId:   complaintId,
        });
        notifyNearbyCitizens(null, {
            excludeUserId: reporterId,
            lat: parseFloat(complaint.latitude),
            lon: parseFloat(complaint.longitude),
            type:       "VERIFICATION_NEEDED",
            title:      "Verification needed near you",
            body:       `A complaint near you needs community verification: "${complaint.title}"`,
            data:       { publicCode, complaintId },
            entityType: "complaint",
            entityId:   complaintId,
        });
    }

    if (note?.trim() && reporterId) {
        const preview = note.trim().length > 100
            ? note.trim().slice(0, 100) + "…"
            : note.trim();
        notify(null, {
            userId:     reporterId,
            type:       "COMPLAINT_ACTIVITY",
            title:      "New update on your complaint",
            body:       `An official left an update: “${preview}”`,
            data:       { publicCode, complaintId, note: note.trim(), actorRole: "official", newStatus: toStatus },
            entityType: "complaint",
            entityId:   complaintId,
        });
    }

    return {
        id:                    updated.id,
        publicCode:            updated.public_code,
        status:                updated.status,
        verificationStartedAt: updated.verification_started_at ?? null,
        verificationDeadline:  updated.verification_deadline ?? null,
        workPhotos:            photos.map((p) => ({ url: p.url, position: p.position })),
        updatedAt:             updated.updated_at,
    };
}

module.exports = {
    getDeptDashboard,
    getDeptComplaints,
    getDeptComplaintDetail,
    updateComplaintStatus,
};
