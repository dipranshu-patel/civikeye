"use strict";

const repo                 = require("./me.repository");
const AppError             = require("../../shared/utils/app-error");
const { hashPassword, comparePassword } = require("../../shared/utils/hash");
const { serializeReporterName, canShowContributionHistory } = require("../../shared/utils/serialize-public-user");

// ─── GET /api/me ──────────────────────────────────────────────────────────────

async function getProfile(userId) {
    const [user, prefs, summary, isVerifiedVolunteer] = await Promise.all([
        repo.findUserById(userId),
        repo.findOrCreatePreferences(userId),
        repo.getContributionSummary(userId),
        repo.getCommunityVerificationStatus(userId),
    ]);

    if (!user) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    return {
        id:        user.id,
        fullName:  user.full_name,
        email:     user.email,
        role:      user.role,
        location:  user.latitude
            ? { latitude: parseFloat(user.latitude), longitude: parseFloat(user.longitude) }
            : null,
        passwordChangedAt: user.password_changed_at ?? null,
        createdAt: user.created_at,

        // §3 Privacy read-only indicators
        publicLedgerVisibility:  "visible",           // system-wide: complaints always visible
        communityVerification:   isVerifiedVolunteer  // derived from completed volunteer tasks
            ? "verified"
            : "not_applicable",

        // §1 Contribution summary
        contributionSummary: {
            complaintsField:    summary.complaints_filed    ?? 0,
            upvotesCast:        summary.upvotes_cast        ?? 0,
            verificationsCast:  summary.verifications_cast ?? 0,
            tasksCompleted:     summary.tasks_completed     ?? 0,
            civicPoints:        summary.civic_points        ?? 0,
        },

        // §2 + §3 Preferences
        preferences: formatPreferences(prefs),
    };
}

// ─── PATCH /api/me/profile ────────────────────────────────────────────────────

async function updateProfile(userId, { fullName, email }) {
    if (!fullName && !email) {
        throw new AppError("NO_FIELDS", "Provide at least fullName or email to update.", 422);
    }

    if (email) {
        const taken = await repo.isEmailTaken(email, userId);
        if (taken) throw new AppError("EMAIL_TAKEN", "That email is already in use.", 409);
    }

    const updated = await repo.updateProfile(userId, { fullName, email });
    if (!updated) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    return { id: updated.id, fullName: updated.full_name, email: updated.email };
}

// ─── GET /api/me/preferences ──────────────────────────────────────────────────

async function getPreferences(userId) {
    const prefs = await repo.findOrCreatePreferences(userId);
    return { preferences: formatPreferences(prefs) };
}

// ─── PATCH /api/me/preferences ────────────────────────────────────────────────

async function updatePreferences(userId, fields) {
    const prefs = await repo.updatePreferences(userId, fields);
    return { preferences: formatPreferences(prefs) };
}

// ─── POST /api/me/change-password ─────────────────────────────────────────────

async function changePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
        throw new AppError("MISSING_FIELDS", "Both currentPassword and newPassword are required.", 422);
    }
    if (newPassword.length < 8) {
        throw new AppError("PASSWORD_TOO_SHORT", "New password must be at least 8 characters.", 422);
    }
    if (currentPassword === newPassword) {
        throw new AppError("SAME_PASSWORD", "New password must differ from the current password.", 422);
    }

    const currentHash = await repo.findPasswordHash(userId);
    if (!currentHash) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    const match = await comparePassword(currentPassword, currentHash);
    if (!match) throw new AppError("WRONG_PASSWORD", "Current password is incorrect.", 401);

    const newHash = await hashPassword(newPassword);
    const result  = await repo.updatePassword(userId, newHash);

    return { passwordChangedAt: result.password_changed_at };
}

// ─── DELETE /api/me/account ───────────────────────────────────────────────────

async function deleteAccount(userId, { confirmation } = {}) {
    if (!confirmation || confirmation.trim().toLowerCase() !== "delete") {
        throw new AppError(
            "CONFIRMATION_REQUIRED",
            "Type \"delete\" to confirm account deletion.",
            422,
        );
    }

    const user = await repo.findUserById(userId);
    if (!user) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    await repo.softDeleteUser(userId);
    return { deleted: true };
}

// ─── Location (existing) ──────────────────────────────────────────────────────

async function updateLocation(userId, body) {
    const lat = parseFloat(body.latitude);
    const lng = parseFloat(body.longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new AppError("INVALID_COORDINATES", "The provided coordinates are invalid.", 422);
    }

    const updated = await repo.updateUserLocation(userId, { latitude: lat, longitude: lng });
    if (!updated) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    return {
        id:       updated.id,
        fullName: updated.full_name,
        email:    updated.email,
        role:     updated.role,
        location: { latitude: parseFloat(updated.latitude), longitude: parseFloat(updated.longitude) },
    };
}


// ─── Formatter ────────────────────────────────────────────────────────────────

function formatPreferences(prefs) {
    return {
        showNameOnComplaints:    prefs.show_name_on_complaints,
        appearOnLeaderboard:     prefs.appear_on_leaderboard,
        showContributionHistory: prefs.show_contribution_history,
        updatedAt:               prefs.updated_at,
    };
}

// ─── GET /api/users/:id/profile (public, no auth) ──────────────────────────────

async function getPublicProfile(userId) {
    const [user, summary, isVerifiedVolunteer] = await Promise.all([
        repo.findPublicProfile(userId),
        repo.getContributionSummary(userId),
        repo.getCommunityVerificationStatus(userId),
    ]);

    if (!user) throw new AppError("USER_NOT_FOUND", "This profile does not exist.", 404);

    // Honor show_name_on_complaints for the display name on their public card
    const displayName = serializeReporterName(user, user);

    // Honor show_contribution_history — zero out stats if hidden
    const showStats = canShowContributionHistory(user);

    return {
        id:          user.id,
        displayName,
        isAnonymous: !user.show_name_on_complaints,
        role:        user.role,                         // 'citizen' (volunteers are citizens too)
        memberSince: user.created_at,
        communityVerification: isVerifiedVolunteer ? "verified" : "not_applicable",
        contributionSummary: showStats ? {
            complaintsField:   summary.complaints_filed    ?? 0,
            upvotesCast:       summary.upvotes_cast        ?? 0,
            verificationsCast: summary.verifications_cast ?? 0,
            tasksCompleted:    summary.tasks_completed     ?? 0,
            civicPoints:       summary.civic_points        ?? 0,
        } : null,           // null = hidden by user's preference
    };
}

module.exports = {
    getProfile,
    updateProfile,
    getPreferences,
    updatePreferences,
    changePassword,
    deleteAccount,
    updateLocation,
    getPublicProfile,
};
