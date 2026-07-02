"use strict";

const repo     = require("./volunteer.repository");
const AppError = require("../../shared/utils/app-error");
const { minVotes, confirmThreshold } = require("../../config/verification");

// ─── Discover ─────────────────────────────────────────────────────────────────

async function discoverTasks({ search, page = 1, limit = 20 }) {
    page  = Math.max(1, parseInt(page)  || 1);
    limit = Math.min(50, parseInt(limit) || 20);

    const rows = await repo.findOpenTasks({ search, page, limit });
    const total = rows[0]?.total_count ?? 0;

    return {
        tasks:      rows.map(formatTaskCard),
        pagination: { page, limit, total },
    };
}

// ─── Claim task ───────────────────────────────────────────────────────────────

async function claimTask({ taskId, volunteerId }) {
    const result = await repo.claimTask({ taskId, volunteerId });

    if (result.error) {
        const MAP = {
            TASK_NOT_FOUND:          [404, "TASK_NOT_FOUND",          "Volunteer task not found."],
            TASK_NOT_OPEN:           [409, "TASK_NOT_OPEN",           "This task is no longer open for claiming."],
            ALREADY_CLAIMED:         [409, "ALREADY_CLAIMED",         "You have already claimed this task."],
            NOT_COMMUNITY_FIXABLE:   [422, "NOT_COMMUNITY_FIXABLE",   "Only community-fixable complaints can be claimed."],
            REPORTER_CANNOT_CLAIM:   [403, "REPORTER_CANNOT_CLAIM",   "You cannot volunteer for a complaint you reported."],
        };
        const [status, code, msg] = MAP[result.error] ?? [500, "UNKNOWN_ERROR", "Unexpected error."];
        throw new AppError(code, msg, status);
    }

    return {
        taskId:       result.task.id,
        assignmentId: result.assignment.id,
        status:       result.assignment.status,
        claimedAt:    result.assignment.claimed_at,
    };
}

// ─── Submit completion ────────────────────────────────────────────────────────

async function submitTaskCompletion({ taskId, volunteerId, note, proofFile }) {
    const result = await repo.submitTaskCompletion({ taskId, volunteerId, note, proofFile });

    if (result.error) {
        const MAP = {
            ASSIGNMENT_NOT_FOUND:  [404, "ASSIGNMENT_NOT_FOUND",  "You have not claimed this task."],
            ASSIGNMENT_NOT_ACTIVE: [409, "ASSIGNMENT_NOT_ACTIVE", "This assignment is not in active status."],
        };
        const [status, code, msg] = MAP[result.error] ?? [500, "UNKNOWN_ERROR", "Unexpected error."];
        throw new AppError(code, msg, status);
    }

    return {
        message:     "Resolution submitted. Community verification has started.",
        assignmentId: result.assignmentId,
        complaintId:  result.complaintId,
        proofPhoto:   result.proofUrl ?? null,
    };
}

// ─── My tasks ─────────────────────────────────────────────────────────────────

async function getMyTasks({ volunteerId, tab }) {
    const VALID_TABS = ["active", "pending_verification", "completed"];
    const safeTab    = VALID_TABS.includes(tab) ? tab : "active";

    const [rows, summary] = await Promise.all([
        repo.findMyTasks({ volunteerId, tab: safeTab }),
        repo.getMyTasksSummary(volunteerId),
    ]);

    return {
        summary: {
            active:              summary.active              ?? 0,
            pendingVerification: summary.pending_verification ?? 0,
            completed:           summary.completed           ?? 0,
        },
        tab:   safeTab,
        tasks: rows.map((r) => formatMyTaskCard(r, safeTab)),
    };
}

// ─── Impact ───────────────────────────────────────────────────────────────────

async function getImpact(volunteerId) {
    const [stats, rank, city] = await Promise.all([
        repo.getImpactStats(volunteerId),
        repo.getVolunteerRank(volunteerId),
        repo.getCityWideStats(),
    ]);

    return {
        personal: {
            contributionScore:   stats?.total_score         ?? 0,
            scoreThisWeek:       stats?.score_this_week     ?? 0,
            completedFixes:      stats?.completed_fixes     ?? 0,
            fixesThisMonth:      stats?.fixes_this_month    ?? 0,
            verificationRatePct: stats?.verification_rate_pct
                ? parseFloat(stats.verification_rate_pct)
                : null,
            volunteerRank:       rank ?? null,
        },
        cityWide: {
            totalResolved:      city?.total_resolved     ?? 0,
            totalContributors:  city?.total_contributors ?? 0,
        },
    };
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

async function getLeaderboard({ page = 1, limit = 20 }) {
    page  = Math.max(1, parseInt(page)  || 1);
    limit = Math.min(50, parseInt(limit) || 20);

    const rows  = await repo.getLeaderboard({ page, limit });
    const total = rows[0]?.total_count ?? 0;

    return {
        entries:    rows.map(formatLeaderboardEntry),
        pagination: { page, limit, total },
    };
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatTaskCard(row) {
    return {
        taskId:      row.task_id,
        complaintId: row.complaint_id,
        publicCode:  row.public_code,
        title:       row.title,
        description: row.description ?? null,
        category:    row.category_name,
        addressText: row.address_text ?? null,
        coverPhoto:  row.cover_photo  ?? null,
        taskStatus:  row.task_status,
        upvoteCount: row.upvote_count,
        reportedAt:  row.complaint_created_at,
    };
}

function formatMyTaskCard(row, tab) {
    const base = {
        taskId:         row.task_id,
        assignmentId:   row.assignment_id,
        complaintId:    row.complaint_id,
        publicCode:     row.public_code,
        title:          row.title,
        category:       row.category_name,
        addressText:    row.address_text ?? null,
        coverPhoto:     row.cover_photo  ?? null,
        taskStatus:     row.task_status,
        assignStatus:   row.assignment_status,
        note:           row.note          ?? null,
        proofPhoto:     row.proof_photo_url ?? null,
        claimedAt:      row.claimed_at,
        completedAt:    row.completed_at   ?? null,
    };

    if (tab === "pending_verification") {
        const total    = row.total_votes  ?? 0;
        const confirms = row.confirm_count ?? 0;
        const rejects  = row.reject_count  ?? 0;
        const pct      = total > 0 ? Math.round((confirms / total) * 100) : 0;

        base.tally = {
            total, confirms, rejects, confirmPct: pct, minVotes,
        };
        base.verificationDeadline    = row.verification_deadline ?? null;
        base.verificationStartedAt   = row.verification_started_at ?? null;
    }

    if (tab === "completed") {
        base.pointsEarned = row.points_earned ?? 0;
    }

    return base;
}

function formatLeaderboardEntry(row) {
    const displayName = row.appear_on_leaderboard
        ? (row.full_name ?? "Anonymous")
        : "Anonymous";

    return {
        rank:           row.rank,
        displayName,
        isAnonymous:    !row.appear_on_leaderboard,
        totalPoints:    row.total_points    ?? 0,
        completedFixes: row.completed_fixes ?? 0,
        verifyRatePct:  row.verify_rate_pct ? parseFloat(row.verify_rate_pct) : null,
    };
}

module.exports = {
    discoverTasks,
    claimTask,
    submitTaskCompletion,
    getMyTasks,
    getImpact,
    getLeaderboard,
};
