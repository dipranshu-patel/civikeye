"use strict";

const multer  = require("multer");
const { v2: cloudinary } = require("cloudinary");
const AppError = require("../utils/app-error");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILES           = 4;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const _multer = multer({
    storage: multer.memoryStorage(),
    limits: {
        files:    MAX_FILES,
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

const uploadPhotos  = _multer.array("photos", MAX_FILES);
const uploadSingle  = (fieldName) => _multer.single(fieldName);

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

function uploadBufferToCloudinary(buffer, options = {}) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder:        options.folder ?? "civikeye/complaints",
                resource_type: "image",
                transformation: [
                    { width: 1280, height: 960, crop: "limit", quality: "auto:good" },
                ],
                ...options,
            },
            (error, result) => {
                if (error) {
                    return reject(
                        new AppError("UPLOAD_FAILED", error.message ?? "Cloudinary upload failed.", 502),
                    );
                }
                resolve({ url: result.secure_url, publicId: result.public_id });
            },
        );
        stream.end(buffer);
    });
}

async function deleteFromCloudinary(publicId) {
    return cloudinary.uploader.destroy(publicId);
}

module.exports = {
    uploadPhotos,
    uploadSingle,
    handleUploadError,
    uploadBufferToCloudinary,
    deleteFromCloudinary,
};
