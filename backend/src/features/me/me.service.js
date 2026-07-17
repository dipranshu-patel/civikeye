"use strict";

const repo = require("./me.repository");
const AppError = require("../../shared/utils/app-error");
const { hashPassword, comparePassword } = require("../../shared/utils/hash");
const {
    serializeReporterName,
    canShowContributionHistory,
} = require("../../shared/utils/serialize-public-user");

async function getProfile(userId) {
    const [user, prefs, summary, isVerifiedVolunteer] = await Promise.all([
        repo.findUserById(userId),
        repo.findOrCreatePreferences(userId),
        repo.getContributionSummary(userId),
        repo.getCommunityVerificationStatus(userId),
    ]);

    if (!user) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    return {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        location: user.latitude
            ? {
                  latitude: parseFloat(user.latitude),
                  longitude: parseFloat(user.longitude),
              }
            : null,
        passwordChangedAt: user.password_changed_at ?? null,
        createdAt: user.created_at,

        publicLedgerVisibility: "visible",
        communityVerification: isVerifiedVolunteer
            ? "verified"
            : "not_applicable",

        contributionSummary: {
            complaintsField: summary.complaints_filed ?? 0,
            upvotesCast: summary.upvotes_cast ?? 0,
            verificationsCast: summary.verifications_cast ?? 0,
            tasksCompleted: summary.tasks_completed ?? 0,
            civicPoints: summary.civic_points ?? 0,
        },

        preferences: formatPreferences(prefs),
    };
}

async function updateProfile(userId, { fullName }) {
    if (!fullName) {
        throw new AppError("NO_FIELDS", "Provide fullName to update.", 422);
    }

    const updated = await repo.updateProfile(userId, { fullName });
    if (!updated) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    return {
        id: updated.id,
        fullName: updated.full_name,
        email: updated.email,
    };
}

async function requestEmailChange(userId, { newEmail }) {
    const { sendOtpEmail, EmailError } = require("../../shared/utils/email");
    const crypto = require("crypto");

    const normalisedEmail = newEmail.trim().toLowerCase();

    const taken = await repo.isEmailTaken(normalisedEmail, userId);
    if (taken)
        throw new AppError("EMAIL_TAKEN", "That email is already in use.", 409);

    const OTP_TTL_MS = 10 * 60 * 1000;
    const otp = crypto.randomInt(100_000, 1_000_000).toString();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await repo.createEmailChangeOtp(userId, normalisedEmail, otp, expiresAt);

    if (process.env.SKIP_EMAIL === "true") {
        console.warn(
            `[requestEmailChange] SKIP_EMAIL=true — OTP for ${normalisedEmail}: ${otp}`,
        );
        return { success: true };
    }

    try {
        await sendOtpEmail(normalisedEmail, otp);
    } catch (emailErr) {
        if (emailErr instanceof EmailError) {
            const isConfig =
                emailErr.code === "EMAIL_API_KEY_INVALID" ||
                emailErr.code === "EMAIL_DOMAIN_INVALID";
            throw new AppError(
                emailErr.code,
                isConfig
                    ? "Email service is misconfigured. Please contact support."
                    : "Failed to send verification email. Please try again in a moment.",
                503,
            );
        }
        throw new AppError(
            "EMAIL_SEND_FAILED",
            "An unexpected error occurred while sending the verification email.",
            503,
        );
    }

    return { success: true };
}

async function confirmEmailChange(userId, { otp }) {
    if (!otp) throw new AppError("MISSING_OTP", "OTP is required.", 422);

    const OTP_MAX_ATTEMPTS = 5;
    const record = await repo.findPendingEmailChangeOtp(userId);

    if (!record) {
        throw new AppError(
            "OTP_NOT_FOUND",
            "No pending email change found. Please request a new one.",
            404,
        );
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
        throw new AppError(
            "OTP_MAX_ATTEMPTS",
            "Too many incorrect attempts. Please request a new OTP.",
            429,
        );
    }

    const verified = await repo.verifyEmailChangeOtp(record.id, otp);
    if (!verified || !verified.verified) {
        const attemptsLeft =
            OTP_MAX_ATTEMPTS - (verified?.attempts ?? OTP_MAX_ATTEMPTS);
        throw new AppError(
            "OTP_INVALID",
            `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`,
            400,
        );
    }

    const taken = await repo.isEmailTaken(verified.new_email, userId);
    if (taken)
        throw new AppError("EMAIL_TAKEN", "That email is already in use.", 409);

    const updated = await repo.updateProfile(userId, {
        email: verified.new_email,
    });
    if (!updated) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    return {
        id: updated.id,
        fullName: updated.full_name,
        email: updated.email,
    };
}

async function getPreferences(userId) {
    const prefs = await repo.findOrCreatePreferences(userId);
    return { preferences: formatPreferences(prefs) };
}

async function updatePreferences(userId, fields) {
    const prefs = await repo.updatePreferences(userId, fields);
    return { preferences: formatPreferences(prefs) };
}

async function changePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
        throw new AppError(
            "MISSING_FIELDS",
            "Both currentPassword and newPassword are required.",
            422,
        );
    }
    if (newPassword.length < 8) {
        throw new AppError(
            "PASSWORD_TOO_SHORT",
            "New password must be at least 8 characters.",
            422,
        );
    }
    if (currentPassword === newPassword) {
        throw new AppError(
            "SAME_PASSWORD",
            "New password must differ from the current password.",
            422,
        );
    }

    const currentHash = await repo.findPasswordHash(userId);
    if (!currentHash)
        throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    const match = await comparePassword(currentPassword, currentHash);
    if (!match)
        throw new AppError(
            "WRONG_PASSWORD",
            "Current password is incorrect.",
            401,
        );

    const newHash = await hashPassword(newPassword);
    const result = await repo.updatePassword(userId, newHash);

    return { passwordChangedAt: result.password_changed_at };
}

async function deleteAccount(userId, { confirmation } = {}) {
    if (!confirmation || confirmation.trim().toLowerCase() !== "delete") {
        throw new AppError(
            "CONFIRMATION_REQUIRED",
            'Type "delete" to confirm account deletion.',
            422,
        );
    }

    const user = await repo.findUserById(userId);
    if (!user) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    await repo.softDeleteUser(userId);
    return { deleted: true };
}

async function updateLocation(userId, body) {
    const lat = parseFloat(body.latitude);
    const lng = parseFloat(body.longitude);

    if (
        isNaN(lat) ||
        isNaN(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
    ) {
        throw new AppError(
            "INVALID_COORDINATES",
            "The provided coordinates are invalid.",
            422,
        );
    }

    const updated = await repo.updateUserLocation(userId, {
        latitude: lat,
        longitude: lng,
    });
    if (!updated) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    return {
        id: updated.id,
        fullName: updated.full_name,
        email: updated.email,
        role: updated.role,
        location: {
            latitude: parseFloat(updated.latitude),
            longitude: parseFloat(updated.longitude),
        },
    };
}

function formatPreferences(prefs) {
    return {
        showNameOnComplaints: prefs.show_name_on_complaints,
        appearOnLeaderboard: prefs.appear_on_leaderboard,
        showContributionHistory: prefs.show_contribution_history,
        updatedAt: prefs.updated_at,
    };
}

async function getPublicProfile(userId) {
    const [user, summary, isVerifiedVolunteer] = await Promise.all([
        repo.findPublicProfile(userId),
        repo.getContributionSummary(userId),
        repo.getCommunityVerificationStatus(userId),
    ]);

    if (!user)
        throw new AppError(
            "USER_NOT_FOUND",
            "This profile does not exist.",
            404,
        );

    const displayName = serializeReporterName(user, user);

    const showStats = canShowContributionHistory(user);

    return {
        id: user.id,
        displayName,
        isAnonymous: !user.show_name_on_complaints,
        role: user.role,
        memberSince: user.created_at,
        communityVerification: isVerifiedVolunteer
            ? "verified"
            : "not_applicable",
        contributionSummary: showStats
            ? {
                  complaintsField: summary.complaints_filed ?? 0,
                  upvotesCast: summary.upvotes_cast ?? 0,
                  verificationsCast: summary.verifications_cast ?? 0,
                  tasksCompleted: summary.tasks_completed ?? 0,
                  civicPoints: summary.civic_points ?? 0,
              }
            : null,
    };
}

module.exports = {
    getProfile,
    updateProfile,
    requestEmailChange,
    confirmEmailChange,
    getPreferences,
    updatePreferences,
    changePassword,
    deleteAccount,
    updateLocation,
    getPublicProfile,
};
