"use strict";

const crypto = require("crypto");

const repo = require("./auth.repository");
const { hashPassword, comparePassword } = require("../../shared/utils/hash");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("../../shared/utils/jwt");

class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
    }
}

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
    const expiry = process.env.JWT_REFRESH_EXPIRY ?? "30d";
    const match = expiry.match(/^(\d+)([smhd])$/);

    if (!match) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

    return new Date(Date.now() + value * multipliers[unit]);
}

async function register({ fullName, email, password }) {
    const normalisedEmail = email.trim().toLowerCase();

    const verified = await repo.findVerifiedEmailVerification(normalisedEmail);
    if (!verified) {
        throw new AppError(
            "Please verify your email address before registering.",
            403,
            "EMAIL_NOT_VERIFIED",
        );
    }

    const existing = await repo.findUserByEmail(normalisedEmail);
    if (existing) {
        throw new AppError(
            "An account with this email already exists.",
            409,
            "EMAIL_TAKEN",
        );
    }

    const passwordHash = await hashPassword(password);

    const user = await repo.insertUser({
        fullName,
        email: normalisedEmail,
        passwordHash,
        role: "citizen",
    });

    return {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
    };
}

async function login({ email, password }) {
    const normalisedEmail = email.trim().toLowerCase();

    const user = await repo.findUserByEmail(normalisedEmail);
    if (!user) {
        throw new AppError(
            "Invalid email or password.",
            401,
            "INVALID_CREDENTIALS",
        );
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
        throw new AppError(
            "Invalid email or password.",
            401,
            "INVALID_CREDENTIALS",
        );
    }

    const accessToken = signAccessToken({ userId: user.id, role: user.role });

    const { refreshToken, tokenHash } = makeRefreshToken({
        userId: user.id,
        role: user.role,
    });

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
        },
    };
}

async function refresh(rawRefreshToken) {
    let payload;
    try {
        payload = verifyRefreshToken(rawRefreshToken);
    } catch {
        throw new AppError(
            "Refresh token is invalid or has expired.",
            401,
            "INVALID_REFRESH_TOKEN",
        );
    }

    const tokenHash = sha256(rawRefreshToken);
    const tokenRow = await repo.findRefreshTokenByHash(tokenHash);

    if (!tokenRow) {
        throw new AppError(
            "Refresh token not recognised.",
            401,
            "TOKEN_NOT_FOUND",
        );
    }

    if (tokenRow.revoked) {
        await repo.revokeAllRefreshTokensForUser(payload.userId);
        throw new AppError(
            "Refresh token has already been used. All sessions have been revoked for your security.",
            401,
            "TOKEN_REUSE_DETECTED",
        );
    }

    if (new Date(tokenRow.expires_at) < new Date()) {
        throw new AppError(
            "Refresh token has expired. Please log in again.",
            401,
            "TOKEN_EXPIRED",
        );
    }

    await repo.revokeRefreshTokenById(tokenRow.id);

    const accessToken = signAccessToken({
        userId: tokenRow.user_id,
        role: payload.role,
    });

    const { refreshToken: newRefreshToken, tokenHash: newHash } =
        makeRefreshToken({
            userId: tokenRow.user_id,
            role: payload.role,
        });
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
            "Refresh token not recognised.",
            401,
            "TOKEN_NOT_FOUND",
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
                isConfig
                    ? "Email service is misconfigured. Please contact support."
                    : "Failed to send verification email. Please try again in a moment.",
                503,
                emailErr.code,
            );
        }

        throw new AppError(
            "An unexpected error occurred while sending the verification email.",
            503,
            "EMAIL_SEND_FAILED",
        );
    }

    return { success: true };
}

async function verifyOtp({ email, otp }) {
    const normalisedEmail = email.trim().toLowerCase();

    const record = await repo.findLatestEmailVerification(normalisedEmail);

    if (!record) {
        throw new AppError(
            "No pending OTP found for this email. Please request a new one.",
            404,
            "OTP_NOT_FOUND",
        );
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
        throw new AppError(
            "Too many incorrect attempts. Please request a new OTP.",
            429,
            "OTP_MAX_ATTEMPTS",
        );
    }

    const updated = await repo.markEmailAsVerified(record.id, otp);

    if (!updated || !updated.verified) {
        const attemptsLeft =
            OTP_MAX_ATTEMPTS - (updated?.attempts ?? OTP_MAX_ATTEMPTS);
        throw new AppError(
            `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`,
            400,
            "OTP_INVALID",
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
    const { sendPasswordResetEmail, EmailError } = require("../../shared/utils/email");

    const normalisedEmail = email.trim().toLowerCase();

    const user = await repo.findUserByEmail(normalisedEmail);

    // Return generic success regardless of whether the email exists —
    // never reveal which addresses are registered.
    if (!user) {
        return { success: true };
    }

    // Generate a cryptographically secure raw token (256 bits of entropy).
    const rawToken = crypto.randomBytes(32).toString("hex");
    // Only the hash is stored; the raw token is never persisted.
    const tokenHash = sha256(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TTL_MS);

    await repo.createPasswordResetToken({ userId: user.id, tokenHash, expiresAt });

    const frontendUrl = process.env.FRONTEND_URL ?? "https://civikeye.online";
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
        // Roll back the token row so it cannot be abused if the email never arrived.
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
                isConfig
                    ? "Email service is misconfigured. Please contact support."
                    : "Failed to send password reset email. Please try again in a moment.",
                503,
                emailErr.code,
            );
        }

        throw new AppError(
            "An unexpected error occurred while sending the password reset email.",
            503,
            "EMAIL_SEND_FAILED",
        );
    }

    return { success: true };
}

async function resetPassword({ token, password }) {
    const tokenHash = sha256(token);
    const record = await repo.findPasswordResetToken(tokenHash);

    if (!record) {
        throw new AppError(
            "Password reset token is invalid.",
            404,
            "TOKEN_NOT_FOUND",
        );
    }

    // Guard against token reuse.
    if (record.used) {
        throw new AppError(
            "This password reset link has already been used. Please request a new one.",
            410,
            "TOKEN_ALREADY_USED",
        );
    }

    if (new Date(record.expires_at) < new Date()) {
        throw new AppError(
            "This password reset link has expired. Please request a new one.",
            410,
            "TOKEN_EXPIRED",
        );
    }

    const passwordHash = await hashPassword(password);

    await repo.updateUserPassword(record.user_id, passwordHash);

    // Delete ALL reset tokens for this user so any older reset emails
    // sent earlier are immediately invalidated.
    await repo.deleteAllPasswordResetTokensForUser(record.user_id);

    // Revoke all active sessions — the password change should force a fresh login.
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
    AppError,
};
