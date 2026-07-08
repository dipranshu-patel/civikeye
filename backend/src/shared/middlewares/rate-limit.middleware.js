"use strict";

const rateLimit = require("express-rate-limit");

const ONE_HOUR_MS = 60 * 60 * 1_000;

function makeHandler(code, message) {
    return (_req, res) => {
        res.status(429).json({
            success: false,
            error: { code, message },
        });
    };
}

const sendOtpLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 5,           // for pruduction - 5
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_OTP_REQUESTS",
        "Too many OTP requests from this IP. Please try again after an hour.",
    ),
});

const verifyOtpLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 10,            // for pruduction - 10
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_OTP_ATTEMPTS",
        "Too many OTP verification attempts from this IP. Please try again after an hour.",
    ),
});

const loginLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 50,           // for pruduction - 10
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_LOGIN_ATTEMPTS",
        "Too many login attempts from this IP. Please try again after an hour.",
    ),
});

const registerLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 5,             // for pruduction - 5
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_REGISTRATIONS",
        "Too many registration attempts from this IP. Please try again after an hour.",
    ),
});

const forgotPasswordLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 5,             // for production - 5
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_FORGOT_PASSWORD_REQUESTS",
        "Too many password reset requests from this IP. Please try again after an hour.",
    ),
});

const resetPasswordLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 5,             // for production - 5
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_RESET_PASSWORD_ATTEMPTS",
        "Too many password reset attempts from this IP. Please try again after an hour.",
    ),
});

const reportLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 5,              // for production - 5
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_REPORTS",
        "You have filed too many complaints this hour. Please try again later.",
    ),
});

const upvoteLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 30,             // for production - 30
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_UPVOTES",
        "Too many upvote actions this hour. Please try again later.",
    ),
});

const verifyLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 20,             // for production - 20
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_VERIFICATIONS",
        "Too many verification votes this hour. Please try again later.",
    ),
});

const claimLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 5,             // for production - 5
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_CLAIMS",
        "Too many task claims this hour. Please try again later.",
    ),
});

module.exports = {
    sendOtpLimiter,
    verifyOtpLimiter,
    loginLimiter,
    registerLimiter,
    forgotPasswordLimiter,
    resetPasswordLimiter,
    reportLimiter,
    upvoteLimiter,
    verifyLimiter,
    claimLimiter,
};
