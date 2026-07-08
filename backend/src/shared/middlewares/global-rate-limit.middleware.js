"use strict";

const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
    windowMs: 60 * 60 * 1_000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json({
            success: false,
            error: {
                code: "TOO_MANY_REQUESTS",
                message: "Too many requests. Please try again later.",
            },
        });
    },
});

module.exports = { globalLimiter };
