"use strict";

const { verifyAccessToken } = require("../utils/jwt");

class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
    }
}

function requireAuth(req, _res, next) {
    const authHeader =
        req.headers["authorization"] ?? req.headers["Authorization"] ?? "";

    if (!authHeader.startsWith("Bearer ")) {
        return next(
            new AppError(
                "Access token is missing. Please log in.",
                401,
                "MISSING_TOKEN",
            ),
        );
    }

    const token = authHeader.slice(7);

    if (!token) {
        return next(
            new AppError(
                "Access token is missing. Please log in.",
                401,
                "MISSING_TOKEN",
            ),
        );
    }

    let payload;
    try {
        payload = verifyAccessToken(token);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(
                new AppError(
                    "Access token has expired. Please refresh your session.",
                    401,
                    "TOKEN_EXPIRED",
                ),
            );
        }

        return next(
            new AppError(
                "Access token is invalid. Please log in again.",
                401,
                "INVALID_TOKEN",
            ),
        );
    }

    req.user = {
        userId: payload.userId,
        role: payload.role,
    };

    next();
}

function requireRole(...roles) {
    return function roleGuard(req, _res, next) {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    `Access denied. Required role: ${roles.join(" or ")}.`,
                    403,
                    "FORBIDDEN",
                ),
            );
        }

        next();
    };
}

module.exports = {
    requireAuth,
    requireRole,
};
