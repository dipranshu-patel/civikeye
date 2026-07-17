"use strict";

const crypto = require("crypto");

const repo = require("./auth.repository");
const { hashPassword, comparePassword } = require("../../shared/utils/hash");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("../../shared/utils/jwt");
const AppError = require("../../shared/utils/app-error");
const config = require("../../config");

function sha256(rawToken) {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function makeRefreshToken(payload) {
    const refreshToken = signRefreshToken({
        ...payload,
        jti: crypto.randomUUID(),
    });
    const tokenHash = sha256(refreshToken);
    return { refreshToken, tokenHash };
}

function refreshTokenExpiryDate() {
    const expiry = config.jwt.refreshExpiry;
    const match = expiry.match(/^(\d+)([smhd])$/);

    if (!match) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

    return new Date(Date.now() + value * multipliers[unit]);
}

async function register({ fullName, email, password, latitude, longitude }) {
    const normalisedEmail = email.trim().toLowerCase();

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

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
            "The provided location coordinates are invalid.",
            422,
        );
    }

    const verified = await repo.findVerifiedEmailVerification(normalisedEmail);
    if (!verified) {
        throw new AppError(
            "EMAIL_NOT_VERIFIED",
            "Please verify your email address before registering.",
            403,
        );
    }

    const existing = await repo.findUserByEmail(normalisedEmail);
    if (existing) {
        throw new AppError(
            "EMAIL_TAKEN",
            "An account with this email already exists.",
            409,
        );
    }

    const passwordHash = await hashPassword(password);

    const user = await repo.insertUser({
        fullName,
        email: normalisedEmail,
        passwordHash,
        role: "citizen",
        latitude: lat,
        longitude: lng,
    });

    return {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        location: {
            latitude: parseFloat(user.latitude),
            longitude: parseFloat(user.longitude),
        },
        createdAt: user.created_at,
    };
}

async function login({ email, password }) {
    const normalisedEmail = email.trim().toLowerCase();

    const user = await repo.findUserByEmail(normalisedEmail);
    if (!user) {
        throw new AppError(
            "INVALID_CREDENTIALS",
            "Invalid email or password.",
            401,
        );
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
        throw new AppError(
            "INVALID_CREDENTIALS",
            "Invalid email or password.",
            401,
        );
    }

    let deptId = null;
    if (user.role === "official") {
        const dept = await repo.findDepartmentByUserId(user.id);
        deptId = dept?.id ?? null;
    }

    const tokenPayload = { userId: user.id, role: user.role };
    if (deptId) tokenPayload.deptId = deptId;

    const accessToken = signAccessToken(tokenPayload);

    const { refreshToken, tokenHash } = makeRefreshToken(tokenPayload);

    await repo.insertRefreshToken({
        userId: user.id,
        tokenHash,
        expiresAt: refreshTokenExpiryDate(),
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
            deptId,
            location: user.latitude
                ? {
                      latitude: parseFloat(user.latitude),
                      longitude: parseFloat(user.longitude),
                  }
                : null,
        },
    };
}

async function refresh(rawRefreshToken) {
    let payload;
    try {
        payload = verifyRefreshToken(rawRefreshToken);
    } catch {
        throw new AppError(
            "INVALID_REFRESH_TOKEN",
            "Refresh token is invalid or has expired.",
            401,
        );
    }

    const tokenHash = sha256(rawRefreshToken);
    const tokenRow = await repo.findRefreshTokenByHash(tokenHash);

    if (!tokenRow) {
        throw new AppError(
            "TOKEN_NOT_FOUND",
            "Refresh token not recognised.",
            401,
        );
    }

    if (tokenRow.revoked) {
        await repo.revokeAllRefreshTokensForUser(payload.userId);
        throw new AppError(
            "TOKEN_REUSE_DETECTED",
            "Refresh token has already been used. All sessions have been revoked for your security.",
            401,
        );
    }

    if (new Date(tokenRow.expires_at) < new Date()) {
        throw new AppError(
            "TOKEN_EXPIRED",
            "Refresh token has expired. Please log in again.",
            401,
        );
    }

    await repo.revokeRefreshTokenById(tokenRow.id);

    // Re-fetch deptId for officials so it's always present in refreshed tokens
    let deptId = null;
    if (payload.role === "official") {
        const dept = await repo.findDepartmentByUserId(tokenRow.user_id);
        deptId = dept?.id ?? null;
    }

    const tokenPayload = { userId: tokenRow.user_id, role: payload.role };
    if (deptId) tokenPayload.deptId = deptId;

    const accessToken = signAccessToken(tokenPayload);

    const { refreshToken: newRefreshToken, tokenHash: newHash } =
        makeRefreshToken(tokenPayload);
    await repo.insertRefreshToken({
        userId: tokenRow.user_id,
        tokenHash: newHash,
        expiresAt: refreshTokenExpiryDate(),
    });

    return { accessToken, refreshToken: newRefreshToken };
}

async function logout(rawRefreshToken) {
    const tokenHash = sha256(rawRefreshToken);
    const tokenRow = await repo.findRefreshTokenByHash(tokenHash);

    if (!tokenRow) {
        throw new AppError(
            "TOKEN_NOT_FOUND",
            "Refresh token not recognised.",
            401,
        );
    }

    if (tokenRow.revoked) {
        return { success: true };
    }

    await repo.revokeRefreshTokenById(tokenRow.id);
    return { success: true };
}

const OTP_MAX_ATTEMPTS = 5;
const OTP_TTL_MS = 10 * 60 * 1000;

async function sendOtp({ email }) {
    const { sendOtpEmail, EmailError } = require("../../shared/utils/email");

    const normalisedEmail = email.trim().toLowerCase();

    const otp = crypto.randomInt(100_000, 1_000_000).toString();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    const verificationRow = await repo.createEmailVerification({
        email: normalisedEmail,
        otp,
        expiresAt,
    });

    if (process.env.SKIP_EMAIL === "true") {
        console.warn(
            `[sendOtp] SKIP_EMAIL=true — OTP for ${normalisedEmail}: ${otp}  ` +
                "(remove SKIP_EMAIL before deploying to production)",
        );
        return { success: true };
    }

    try {
        await sendOtpEmail(normalisedEmail, otp);
    } catch (emailErr) {
        await repo.deleteEmailVerification(verificationRow.id).catch(() => {
            console.error(
                "[sendOtp] Failed to delete orphaned email_verifications row:",
                verificationRow.id,
            );
        });

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

async function verifyOtp({ email, otp }) {
    const normalisedEmail = email.trim().toLowerCase();

    const record = await repo.findLatestEmailVerification(normalisedEmail);

    if (!record) {
        throw new AppError(
            "OTP_NOT_FOUND",
            "No pending OTP found for this email. Please request a new one.",
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

    const updated = await repo.markEmailAsVerified(record.id, otp);

    if (!updated || !updated.verified) {
        const attemptsLeft =
            OTP_MAX_ATTEMPTS - (updated?.attempts ?? OTP_MAX_ATTEMPTS);
        throw new AppError(
            "OTP_INVALID",
            `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`,
            400,
        );
    }

    return { success: true, email: normalisedEmail };
}

const RESET_TTL_MS = (function () {
    const expiry = process.env.PASSWORD_RESET_TOKEN_EXPIRY ?? "15m";
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 15 * 60 * 1000;
    const value = parseInt(match[1], 10);
    const multipliers = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    return value * multipliers[match[2]];
})();

async function forgotPassword({ email }) {
    const {
        sendPasswordResetEmail,
        EmailError,
    } = require("../../shared/utils/email");

    const normalisedEmail = email.trim().toLowerCase();

    const user = await repo.findUserByEmail(normalisedEmail);

    if (!user) {
        return { success: true };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TTL_MS);

    await repo.createPasswordResetToken({
        userId: user.id,
        tokenHash,
        expiresAt,
    });

    const frontendUrl = (
        process.env.FRONTEND_URL ?? "https://civikeye.online"
    ).replace(/\/$/, "");
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    if (process.env.SKIP_EMAIL === "true") {
        console.warn(
            `[forgotPassword] SKIP_EMAIL=true — reset URL for ${normalisedEmail}: ${resetUrl}  ` +
                "(remove SKIP_EMAIL before deploying to production)",
        );
        return { success: true };
    }

    try {
        await sendPasswordResetEmail(normalisedEmail, resetUrl);
    } catch (emailErr) {
        await repo.deleteAllPasswordResetTokensForUser(user.id).catch(() => {
            console.error(
                "[forgotPassword] Failed to clean up password_reset_tokens for user:",
                user.id,
            );
        });

        if (emailErr instanceof EmailError) {
            const isConfig =
                emailErr.code === "EMAIL_API_KEY_INVALID" ||
                emailErr.code === "EMAIL_DOMAIN_INVALID";

            throw new AppError(
                emailErr.code,
                isConfig
                    ? "Email service is misconfigured. Please contact support."
                    : "Failed to send password reset email. Please try again in a moment.",
                503,
            );
        }

        throw new AppError(
            "EMAIL_SEND_FAILED",
            "An unexpected error occurred while sending the password reset email.",
            503,
        );
    }

    return { success: true };
}

async function resetPassword({ token, password }) {
    const tokenHash = sha256(token);
    const record = await repo.findPasswordResetToken(tokenHash);

    if (!record) {
        throw new AppError(
            "TOKEN_NOT_FOUND",
            "Password reset token is invalid.",
            404,
        );
    }

    if (record.used) {
        throw new AppError(
            "TOKEN_ALREADY_USED",
            "This password reset link has already been used. Please request a new one.",
            410,
        );
    }

    if (new Date(record.expires_at) < new Date()) {
        throw new AppError(
            "TOKEN_EXPIRED",
            "This password reset link has expired. Please request a new one.",
            410,
        );
    }

    const passwordHash = await hashPassword(password);

    await repo.updateUserPassword(record.user_id, passwordHash);

    await repo.deleteAllPasswordResetTokensForUser(record.user_id);

    await repo.revokeAllRefreshTokensForUser(record.user_id);

    return { success: true };
}

module.exports = {
    sendOtp,
    verifyOtp,
    register,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
};
