"use strict";

const multer = require("multer");
const AppError = require("../utils/app-error");

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const MAX_FILES = 4;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const _multer = multer({
    storage: multer.memoryStorage(),

    limits: {
        files: MAX_FILES,
        fileSize: MAX_FILE_SIZE_BYTES,
    },

    fileFilter(_req, file, cb) {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            return cb(
                new AppError(
                    "INVALID_FILE_TYPE",
                    `Only JPEG, PNG, and WebP images are accepted. Received: ${file.mimetype}`,
                    415,
                ),
            );
        }
        cb(null, true);
    },
});

const uploadPhotos = _multer.array("photos", MAX_FILES);

function handleUploadError(err, _req, _res, next) {
    if (!err) return next();

    if (err.code === "LIMIT_FILE_SIZE") {
        return next(
            new AppError(
                "FILE_TOO_LARGE",
                `Each photo must be ≤ ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`,
                413,
            ),
        );
    }

    if (err.code === "LIMIT_FILE_COUNT") {
        return next(
            new AppError(
                "TOO_MANY_FILES",
                `You may upload a maximum of ${MAX_FILES} photos per complaint.`,
                422,
            ),
        );
    }

    if (err.name === "AppError") return next(err);

    next(
        new AppError(
            "UPLOAD_ERROR",
            "An error occurred while processing the uploaded files.",
            500,
        ),
    );
}

module.exports = { uploadPhotos, handleUploadError };
