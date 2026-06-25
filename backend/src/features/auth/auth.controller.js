"use strict";

const service = require("./auth.service");
const {
    validateRegister,
    validateLogin,
    validateRefresh,
    validateLogout,
    validateSendOtp,
    validateVerifyOtp,
    validateForgotPassword,
    validateResetPassword,
} = require("./auth.validation");

function refreshExpiryMs() {
    const expiry = process.env.JWT_REFRESH_EXPIRY ?? "30d";
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000;

    const value = parseInt(match[1], 10);
    const multipliers = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    return value * multipliers[match[2]];
}

function cookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
        path: "/api/auth",
        maxAge: refreshExpiryMs(),
    };
}

function clearCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
    };
}

function rejectIfInvalid(validator, data, res) {
    const errors = validator(data);
    if (errors.length === 0) return false;

    res.status(422).json({
        success: false,
        errors,
    });
    return true;
}

async function register(req, res, next) {
    try {
        if (rejectIfInvalid(validateRegister, req.body, res)) return;

        const { fullName, email, password } = req.body;
        const user = await service.register({ fullName, email, password });

        res.status(201).json({ success: true, data: { user } });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        if (rejectIfInvalid(validateLogin, req.body, res)) return;

        const { accessToken, refreshToken, user } = await service.login(
            req.body,
        );

        res.cookie("refreshToken", refreshToken, cookieOptions());

        res.status(200).json({
            success: true,
            data: { accessToken, user },
        });
    } catch (err) {
        next(err);
    }
}

async function refresh(req, res, next) {
    try {
        if (rejectIfInvalid(validateRefresh, req.cookies, res)) return;

        const { accessToken, refreshToken } = await service.refresh(
            req.cookies.refreshToken,
        );

        res.cookie("refreshToken", refreshToken, cookieOptions());

        res.status(200).json({
            success: true,
            data: { accessToken },
        });
    } catch (err) {
        next(err);
    }
}

async function logout(req, res, next) {
    try {
        if (rejectIfInvalid(validateLogout, req.cookies, res)) return;

        await service.logout(req.cookies.refreshToken);

        res.clearCookie("refreshToken", clearCookieOptions());

        res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (err) {
        res.clearCookie("refreshToken", clearCookieOptions());
        next(err);
    }
}

async function sendOtp(req, res, next) {
    try {
        if (rejectIfInvalid(validateSendOtp, req.body, res)) return;

        const result = await service.sendOtp(req.body);

        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}

async function verifyOtp(req, res, next) {
    try {
        if (rejectIfInvalid(validateVerifyOtp, req.body, res)) return;

        const result = await service.verifyOtp(req.body);

        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}

async function forgotPassword(req, res, next) {
    try {
        if (rejectIfInvalid(validateForgotPassword, req.body, res)) return;

        await service.forgotPassword(req.body);

        // Always return the same generic message — do not reveal if the email exists.
        res.status(200).json({
            success: true,
            message: "If an account exists, a password reset link has been sent.",
        });
    } catch (err) {
        next(err);
    }
}

async function resetPassword(req, res, next) {
    try {
        if (rejectIfInvalid(validateResetPassword, req.body, res)) return;

        await service.resetPassword(req.body);

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully. Please log in with your new password.",
        });
    } catch (err) {
        next(err);
    }
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
