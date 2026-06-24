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
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_OTP_REQUESTS",
        "Too many OTP requests from this IP. Please try again after an hour.",
    ),
});

const verifyOtpLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_OTP_ATTEMPTS",
        "Too many OTP verification attempts from this IP. Please try again after an hour.",
    ),
});

const loginLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_LOGIN_ATTEMPTS",
        "Too many login attempts from this IP. Please try again after an hour.",
    ),
});

const registerLimiter = rateLimit({
    windowMs: ONE_HOUR_MS,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: makeHandler(
        "TOO_MANY_REGISTRATIONS",
        "Too many registration attempts from this IP. Please try again after an hour.",
    ),
});

module.exports = {
    sendOtpLimiter,
    verifyOtpLimiter,
    loginLimiter,
    registerLimiter,
};
