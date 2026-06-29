"use strict";

const PG_CODES = {
    NOT_NULL_VIOLATION: "23502",
    FOREIGN_KEY_VIOLATION: "23503",
    UNIQUE_VIOLATION: "23505",
    CHECK_VIOLATION: "23514",
};

function normalise(err) {
    if (err.name === "AppError") {
        return {
            statusCode: err.statusCode ?? 500,
            code: err.code ?? "INTERNAL_ERROR",
            message: err.message,
            isOperational: true,
        };
    }

    if (err instanceof SyntaxError && "body" in err) {
        return {
            statusCode: 400,
            code: "INVALID_JSON",
            message: "Request body contains malformed JSON.",
            isOperational: true,
        };
    }

    if (err.type === "entity.too.large") {
        return {
            statusCode: 413,
            code: "PAYLOAD_TOO_LARGE",
            message: "Request body exceeds the maximum allowed size.",
            isOperational: true,
        };
    }

    if (err.code === PG_CODES.UNIQUE_VIOLATION) {
        return {
            statusCode: 409,
            code: "DUPLICATE_RESOURCE",
            message: "A record with that value already exists.",
            isOperational: true,
        };
    }

    if (err.code === PG_CODES.FOREIGN_KEY_VIOLATION) {
        return {
            statusCode: 409,
            code: "REFERENTIAL_INTEGRITY",
            message: "The referenced record does not exist.",
            isOperational: true,
        };
    }

    if (err.code === PG_CODES.NOT_NULL_VIOLATION) {
        return {
            statusCode: 400,
            code: "MISSING_REQUIRED_FIELD",
            message: "A required field is missing.",
            isOperational: true,
        };
    }

    if (err.code === PG_CODES.CHECK_VIOLATION) {
        return {
            statusCode: 400,
            code: "CONSTRAINT_VIOLATION",
            message: "A value violates a database constraint.",
            isOperational: true,
        };
    }

    if (
        err.code === "ECONNRESET" ||
        err.code === "ECONNREFUSED" ||
        err.code === "57P01"
    ) {
        return {
            statusCode: 503,
            code: "DATABASE_UNAVAILABLE",
            message:
                "The database is temporarily unavailable. Please try again shortly.",
            isOperational: false,
        };
    }

    if (err.name === "TokenExpiredError") {
        return {
            statusCode: 401,
            code: "TOKEN_EXPIRED",
            message: "Access token has expired. Please refresh your session.",
            isOperational: true,
        };
    }

    if (err.name === "JsonWebTokenError" || err.name === "NotBeforeError") {
        return {
            statusCode: 401,
            code: "INVALID_TOKEN",
            message: "Access token is invalid. Please log in again.",
            isOperational: true,
        };
    }

    return {
        statusCode: 500,
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred. Please try again later.",
        isOperational: false,
    };
}

function errorMiddleware(err, req, res, next) {
    const { statusCode, code, message, isOperational } = normalise(err);

    if (isOperational) {
        console.warn(
            `[${new Date().toISOString()}] [AppError] ${req.method} ${req.path} → ${statusCode} ${code}: ${message}`,
        );
    } else {
        console.error(
            `[${new Date().toISOString()}] [UNHANDLED] ${req.method} ${req.path} → ${statusCode} ${code}`,
        );
        console.error(err);
    }

    if (res.headersSent) {
        return;
    }

    const body = { success: false, error: { code, message } };
    if (err.name === "AppError" && err.details != null) {
        body.error.details = err.details;
    }
    res.status(statusCode).json(body);
}

module.exports = errorMiddleware;
