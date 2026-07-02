"use strict";

const { query, withTransaction }      = require("../../shared/db/query");
const { uploadBufferToCloudinary }    = require("../../shared/middlewares/upload.middleware");
const repo                            = require("./complaints.repository");
const slaRepo                         = require("../sla/sla.repository");
const AppError                        = require("../../shared/utils/app-error");
const { notify, notifyNearbyCitizens } = require("../../shared/utils/notify");

const UPVOTE_REPORTER_MILESTONES = [5, 10, 25, 50, 100];
const UPVOTE_DEPT_MILESTONES     = [10, 25, 50, 100];

function formatComplaint(row) {
    return {
        id:          row.id,
        publicCode:  row.public_code,
        reporterId:  row.reporter_id,
        reporterName: row.reporter_name ?? "Anonymous",
        title:       row.title,
        description: row.description ?? null,
        category: {
            id:   row.category_id,
            name: row.category_name,
        },
        department: {
            id:   row.department_id,
            name: row.department_name,
            code: row.department_code,
        },
        issueType:              row.issue_type,
        status:                 row.status,
        addressText:            row.address_text ?? null,
        latitude:               parseFloat(row.latitude),
        longitude:              parseFloat(row.longitude),
        slaDeadline:            row.sla_deadline ?? null,
        resolvedAt:             row.resolved_at ?? null,
        reopenCount:            row.reopen_count,
        upvoteCount:            row.upvote_count,
        verificationStartedAt:  row.verification_started_at ?? null,
        verificationDeadline:   row.verification_deadline ?? null,
        coverPhoto:             row.cover_photo ?? null,
        createdAt:              row.created_at,
        updatedAt:              row.updated_at,
    };
}


function formatPhoto(row) {
    return {
        id:       row.id,
        url:      row.url,
        publicId: row.public_id,
        position: row.position,
    };
}

function formatHistoryEntry(row) {
    return {
        id:         row.id,
        fromStatus: row.from_status ?? null,
        toStatus:   row.to_status,
        actorName:  row.actor_name ?? null,
        actorRole:  row.actor_role ?? null,
        note:       row.note ?? null,
        createdAt:  row.created_at,
    };
}

function isOverdue(complaint) {
    if (!complaint.slaDeadline) return false;
    if (["resolved", "pending_verification"].includes(complaint.status)) return false;
    return new Date(complaint.slaDeadline) < new Date();
}

async function createComplaint({ reporterId, title, description, categoryId, issueType, addressText, latitude, longitude, files }) {
    latitude  = parseFloat(latitude);
    longitude = parseFloat(longitude);

    const category = await slaRepo.findSlaCategoryById(categoryId);
    if (!category) {
        throw new AppError("CATEGORY_NOT_FOUND", "The selected category does not exist.", 404);
    }
    const departmentId  = category.department_id;
    const slaDays       = category.sla_duration_days;
    const slaDeadline   = slaDays ? new Date(Date.now() + slaDays * 86_400_000) : null;

    const duplicates = await repo.findDuplicateCandidates({ lat: latitude, lng: longitude, categoryId });
    if (duplicates.length > 0) {
        throw new AppError(
            "DUPLICATE_NEARBY",
            "A similar complaint already exists within 100 m. Consider upvoting it instead.",
            409,
            { conflicts: duplicates.map(formatComplaint) },
        );
    }

    const uploadedPhotos = await Promise.all(
        files.map((file, i) =>
            uploadBufferToCloudinary(file.buffer, { folder: "civikeye/complaints" }).then((res) => ({
                ...res,
                position: i,
            })),
        ),
    );

    const result = await withTransaction(async (client) => {
        const complaint = await repo.insertComplaint(client, {
            reporterId,
            title: title.trim(),
            description,
            categoryId,
            departmentId,
            issueType,
            addressText,
            latitude,
            longitude,
            slaDeadline,
        });

        const photos = await Promise.all(
            uploadedPhotos.map((p) =>
                repo.insertPhoto(client, {
                    complaintId: complaint.id,
                    url:         p.url,
                    publicId:    p.publicId,
                    position:    p.position,
                }),
            ),
        );

        await repo.insertStatusHistory(client, {
            complaintId: complaint.id,
            fromStatus:  null,
            toStatus:    "reported",
            actorId:     reporterId,
            actorRole:   "citizen",
            note:        "Complaint submitted.",
        });

        return { complaint, photos };
    });

    const volunteerRepo = require("../volunteer/volunteer.repository");

    if (issueType === "community_fixable") {
        await volunteerRepo.createVolunteerTask(null, result.complaint.id);
    }

    const c = result.complaint;

    notify(null, {
        userId:     reporterId,
        type:       "COMPLAINT_SUBMITTED",
        title:      "Complaint submitted",
        body:       `Your complaint "${title.trim()}" has been submitted. We'll keep you updated.`,
        data:       { publicCode: c.public_code, complaintId: c.id },
        entityType: "complaint",
        entityId:   c.id,
    });

    if (issueType === "authority_required") {
        const { rows: deptRows } = await query(
            "SELECT user_id FROM departments WHERE id = $1", [departmentId],
        );
        if (deptRows[0]?.user_id) {
            notify(null, {
                userId:     deptRows[0].user_id,
                type:       "NEW_COMPLAINT_DEPT",
                title:      "New complaint in your department",
                body:       `New complaint: "${title.trim()}" (${c.public_code})`,
                data:       { publicCode: c.public_code, complaintId: c.id, issueType },
                entityType: "complaint",
                entityId:   c.id,
            });
        }
    }

    if (issueType === "community_fixable") {
        notifyNearbyCitizens(null, {
            excludeUserId: reporterId,
            lat: latitude, lon: longitude,
            type:       "NEW_TASK_NEARBY",
            title:      "New volunteer task near you",
            body:       `A community task needs fixing near you: "${title.trim()}"`,
            data:       { publicCode: c.public_code, complaintId: c.id },
            entityType: "complaint",
            entityId:   c.id,
        });
    }

    return {
        id:         result.complaint.id,
        publicCode: result.complaint.public_code,
        status:     result.complaint.status,
        photos:     result.photos.map(formatPhoto),
        createdAt:  result.complaint.created_at,
    };
}

async function getComplaintDetail(id, requestingUserId) {
    const complaint = await repo.findComplaintById(id);
    if (!complaint) {
        throw new AppError("COMPLAINT_NOT_FOUND", "Complaint not found.", 404);
    }

    const [photos, history] = await Promise.all([
        repo.findComplaintPhotos(id),
        repo.findStatusHistory(id),
    ]);

    const userUpvoted = requestingUserId
        ? await repo.hasUserUpvoted(id, requestingUserId)
        : false;

    return {
        ...formatComplaint(complaint),
        photos:     photos.map(formatPhoto),
        history:    history.map(formatHistoryEntry),
        userUpvoted,
        isOverdue:  isOverdue(formatComplaint(complaint)),
    };
}

async function exploreComplaints({ search, status, issueType, categoryId, departmentId, sort, page, limit }) {
    const statusList = status ? status.split(",").map((s) => s.trim()) : undefined;

    const authorityRows = await repo.findComplaintsExplore({
        search, statusList, issueType: "authority_required", categoryId, departmentId,
        sort, page, limit,
    });

    const volunteerRows = await repo.findComplaintsExplore({
        search, statusList, issueType: "community_fixable", categoryId, departmentId,
        sort, page, limit,
    });

    const total = Math.max(
        authorityRows[0]?.total_count ?? 0,
        volunteerRows[0]?.total_count ?? 0,
    );

    return {
        authorityRequired: authorityRows.map(formatComplaint),
        volunteerNeeded:   volunteerRows.map(formatComplaint),
        pagination: { page, limit, total },
    };
}

async function getNearbyComplaints({ lat, lng, radius }) {
    const rows = await repo.findNearbyComplaints({ lat, lng, radiusMetres: radius });
    return rows.map(formatComplaint);
}

async function getSimilarComplaints({ lat, lng, categoryId }) {
    const rows = await repo.findSimilarComplaints({ lat, lng, categoryId, excludeId: null });
    return rows.map(formatComplaint);
}

async function getMyComplaints({ reporterId, tab, search, sort, page, limit }) {
    const [rows, summary] = await Promise.all([
        repo.findMyComplaints({ reporterId, tab, search, sort, page, limit }),
        repo.findMyComplaintSummary(reporterId),
    ]);

    const total = rows[0]?.total_count ?? 0;

    return {
        summary: {
            active:              summary.active,
            pendingVerification: summary.pending_verification,
            resolved:            summary.resolved,
            reopened:            summary.reopened,
            overdue:             summary.overdue,
            closesSoonCount:     summary.closes_soon_count,
            avgOverdueHours:     summary.avg_overdue_hours ? parseFloat(summary.avg_overdue_hours) : null,
        },
        complaints: rows.map((r) => ({
            ...formatComplaint(r),
            isOverdue: isOverdue(formatComplaint(r)),
        })),
        pagination: { page, limit, total },
    };
}

async function addUpvote(complaintId, userId) {
    const complaint = await repo.findComplaintById(complaintId);
    if (!complaint) throw new AppError("COMPLAINT_NOT_FOUND", "Complaint not found.", 404);

    const alreadyUpvoted = await repo.hasUserUpvoted(complaintId, userId);
    if (alreadyUpvoted) throw new AppError("ALREADY_UPVOTED", "You have already upvoted this complaint.", 409);

    const newCount = await withTransaction((client) => repo.insertUpvote(client, complaintId, userId));

    if (UPVOTE_REPORTER_MILESTONES.includes(newCount)) {
        notify(null, {
            userId:     complaint.reporter_id,
            type:       "COMPLAINT_UPVOTE_MILESTONE",
            title:      `${newCount} people support your complaint!`,
            body:       `Your complaint "${complaint.title}" has reached ${newCount} upvotes. It's gaining attention!`,
            data:       { upvoteCount: newCount, publicCode: complaint.public_code, complaintId },
            entityType: "complaint",
            entityId:   complaintId,
        });
    }
    if (UPVOTE_DEPT_MILESTONES.includes(newCount) && complaint.issue_type === "authority_required") {
        const { rows: deptRows } = await query(
            "SELECT user_id FROM departments WHERE id = $1", [complaint.department_id],
        );
        if (deptRows[0]?.user_id) {
            notify(null, {
                userId:     deptRows[0].user_id,
                type:       "COMPLAINT_UPVOTE_SURGE",
                title:      `Complaint gaining traction — ${newCount} upvotes`,
                body:       `"${complaint.title}" (${complaint.public_code}) now has ${newCount} community upvotes.`,
                data:       { upvoteCount: newCount, publicCode: complaint.public_code, complaintId },
                entityType: "complaint",
                entityId:   complaintId,
            });
        }
    }

    return { upvoteCount: newCount };
}

async function removeUpvote(complaintId, userId) {
    const complaint = await repo.findComplaintById(complaintId);
    if (!complaint) throw new AppError("COMPLAINT_NOT_FOUND", "Complaint not found.", 404);

    const newCount = await withTransaction((client) => repo.deleteUpvote(client, complaintId, userId));
    if (newCount === null) throw new AppError("NOT_UPVOTED", "You have not upvoted this complaint.", 404);
    return { upvoteCount: newCount };
}

async function getDashboard(userId, { lat, lng }) {
    const data = await repo.findDashboardData(userId, { lat, lng });

    return {
        summary: {
            myActiveComplaints:   data.summary.my_active,
            pendingVerifications: data.summary.my_pending_verification,
            myVolunteerTasks:     0,
            contributionScore:    0,
        },
        myComplaints:               data.myRecentComplaints.map(formatComplaint),
        verificationRequests:       data.nearbyPendingVerifications.map(formatComplaint),
        recentActivity:             data.recentActivity,
        communitySnapshot: {
            communityReports:  null,
            verifications:     null,
            volunteerFixes:    null,
            publicTrustScore:  null,
        },
    };
}

module.exports = {
    createComplaint,
    getComplaintDetail,
    exploreComplaints,
    getNearbyComplaints,
    getSimilarComplaints,
    getMyComplaints,
    addUpvote,
    removeUpvote,
    getDashboard,
};
