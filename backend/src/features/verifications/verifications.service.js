"use strict";

const repo = require("./verifications.repository");
const AppError = require("../../shared/utils/app-error");
const { radiusKm } = require("../../config/verification");

async function getMyVerifications({ user, tab, filter, search }) {
    const { userId, latitude, longitude } = user;

    if (!latitude || !longitude) {
        throw new AppError(
            "LOCATION_REQUIRED",
            "Your account location is required for verification eligibility. Please update your location.",
            422,
        );
    }

    const summary = await repo.getVerificationSummary(
        userId,
        latitude,
        longitude,
    );

    if (tab === "history") {
        const history = await repo.findVerificationHistory(userId);
        return {
            summary: formatSummary(summary),
            tab: "history",
            items: history.map(formatHistoryItem),
        };
    }

    const VALID_FILTERS = ["urgent", "deadline_soon", "most_recent", "nearest"];
    const safeFilter = VALID_FILTERS.includes(filter) ? filter : "most_recent";

    const pending = await repo.findPendingVerifications({
        userId,
        userLat: latitude,
        userLon: longitude,
        filter: safeFilter,
        search,
    });

    return {
        summary: formatSummary(summary),
        tab: "pending",
        filter: safeFilter,
        items: pending.map(formatPendingItem),
    };
}

async function castVote({ complaintId, user, vote, comment }) {
    const { userId, latitude, longitude } = user;

    if (!latitude || !longitude) {
        throw new AppError(
            "LOCATION_REQUIRED",
            "Your account location is required to cast a verification vote.",
            422,
        );
    }

    const VALID_VOTES = ["confirm", "reject"];
    if (!VALID_VOTES.includes(vote)) {
        throw new AppError(
            "INVALID_VOTE",
            "Vote must be 'confirm' or 'reject'.",
            422,
        );
    }

    const eligibility = await repo.checkEligibility(
        complaintId,
        userId,
        latitude,
        longitude,
    );

    if (!eligibility) {
        throw new AppError("COMPLAINT_NOT_FOUND", "Complaint not found.", 404);
    }

    if (eligibility.status !== "pending_verification") {
        throw new AppError(
            "NOT_PENDING_VERIFICATION",
            "This complaint is not currently awaiting community verification.",
            409,
        );
    }

    if (eligibility.reporter_id === userId) {
        throw new AppError(
            "REPORTER_CANNOT_VERIFY",
            "You cannot verify your own complaint.",
            403,
        );
    }

    if (eligibility.already_voted) {
        throw new AppError(
            "ALREADY_VOTED",
            "You have already cast a vote on this complaint.",
            409,
        );
    }

    if (new Date(eligibility.verification_deadline) < new Date()) {
        throw new AppError(
            "VERIFICATION_CLOSED",
            "The verification window for this complaint has closed.",
            409,
        );
    }

    if (parseFloat(eligibility.distance_km) > radiusKm) {
        throw new AppError(
            "OUT_OF_RANGE",
            `You must be within ${radiusKm} km of the complaint location to verify it.`,
            403,
        );
    }

    const result = await repo.castVoteAndResolve({
        complaintId,
        verifierId: userId,
        vote,
        comment,
    });

    return {
        voteId: result.vote.id,
        vote: result.vote.vote,
        castAt: result.vote.created_at,
        tally: result.tally,
        minVotes: result.minVotes,
        resolution: result.resolution
            ? {
                  newStatus: result.resolution.status,
                  resolvedAt: result.resolution.resolved_at ?? null,
                  reopenCount: result.resolution.reopen_count,
              }
            : null,
    };
}

function formatSummary(row) {
    return {
        pendingCount: row.pending_count ?? 0,
        completedCount: row.completed_count ?? 0,
        approvalAccuracyPct: row.approval_accuracy_pct
            ? parseFloat(row.approval_accuracy_pct)
            : null,
    };
}

function formatPendingItem(row) {
    const total = row.total_votes;
    const confirms = row.confirm_count;
    const rejects = row.reject_count;
    const pct = total > 0 ? Math.round((confirms / total) * 100) : 0;

    const deadline = row.verification_deadline
        ? new Date(row.verification_deadline)
        : null;
    const hoursLeft = deadline
        ? Math.max(0, Math.ceil((deadline - Date.now()) / 3_600_000))
        : null;

    return {
        id: row.id,
        publicCode: row.public_code,
        title: row.title,
        description: row.description ?? null,
        category: row.category_name,
        department: row.department_name,
        addressText: row.address_text ?? null,
        coverPhoto: row.cover_photo ?? null,
        verificationStartedAt: row.verification_started_at,
        verificationDeadline: row.verification_deadline,
        hoursUntilDeadline: hoursLeft,
        slaDead: row.sla_deadline ?? null,
        tally: {
            total,
            confirms,
            rejects,
            confirmPct: pct,
            minVotes: repo.MIN_VOTES,
        },
        distanceKm: parseFloat(parseFloat(row.distance_km).toFixed(2)),
    };
}

function formatHistoryItem(row) {
    const total = row.total_votes;
    const confirms = row.confirm_count;
    const pct = total > 0 ? Math.round((confirms / total) * 100) : 0;

    return {
        voteId: row.vote_id,
        myVote: row.vote,
        comment: row.comment ?? null,
        votedAt: row.voted_at,
        complaint: {
            id: row.complaint_id,
            publicCode: row.public_code,
            title: row.title,
            status: row.status,
            addressText: row.address_text ?? null,
            category: row.category_name,
            department: row.department_name,
            coverPhoto: row.cover_photo ?? null,
        },
        tally: {
            total,
            confirms,
            rejects: row.reject_count,
            confirmPct: pct,
            minVotes: repo.MIN_VOTES,
        },
    };
}

module.exports = {
    getMyVerifications,
    castVote,
};
