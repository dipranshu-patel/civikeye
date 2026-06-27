"use strict";

const cloudinary = require("../../config/cloudinary");

function uploadBuffer(buffer, options = {}) {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            resource_type: "image",
            ...options,
        };

        const stream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            },
        );

        stream.end(buffer);
    });
}

async function destroy(publicId, resourceType = "image") {
    return cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
    });
}

module.exports = { uploadBuffer, destroy };
