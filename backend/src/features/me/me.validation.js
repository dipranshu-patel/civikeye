"use strict";

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,24}$/;

function validateAddress(body) {
    const errors = [];
    const { latitude, longitude } = body ?? {};

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (latitude === undefined || latitude === null || isNaN(lat)) {
        errors.push({ field: "latitude", message: "Latitude is required." });
    } else if (lat < -90 || lat > 90) {
        errors.push({ field: "latitude", message: "Latitude must be between -90 and 90." });
    }

    if (longitude === undefined || longitude === null || isNaN(lng)) {
        errors.push({ field: "longitude", message: "Longitude is required." });
    } else if (lng < -180 || lng > 180) {
        errors.push({ field: "longitude", message: "Longitude must be between -180 and 180." });
    }

    return errors;
}

function validateProfileUpdate(body) {
    const errors = [];
    const { fullName, email } = body ?? {};

    if (fullName !== undefined) {
        if (typeof fullName !== "string" || fullName.trim().length < 2) {
            errors.push({ field: "fullName", message: "Full name must be at least 2 characters." });
        } else if (fullName.trim().length > 100) {
            errors.push({ field: "fullName", message: "Full name must not exceed 100 characters." });
        }
    }

    if (email !== undefined) {
        if (typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.includes("..")) {
            errors.push({ field: "email", message: "Please provide a valid email address." });
        } else if (email.trim().length > 255) {
            errors.push({ field: "email", message: "Email must not exceed 255 characters." });
        }
    }

    if (fullName === undefined && email === undefined) {
        errors.push({ field: "body", message: "Provide at least one field to update (fullName or email)." });
    }

    return errors;
}

function validateChangePassword(body) {
    const errors = [];
    const { currentPassword, newPassword } = body ?? {};

    if (!currentPassword || typeof currentPassword !== "string") {
        errors.push({ field: "currentPassword", message: "Current password is required." });
    }

    if (!newPassword || typeof newPassword !== "string") {
        errors.push({ field: "newPassword", message: "New password is required." });
    } else {
        if (newPassword.length < 8) {
            errors.push({ field: "newPassword", message: "New password must be at least 8 characters." });
        } else if (newPassword.length > 128) {
            errors.push({ field: "newPassword", message: "New password must not exceed 128 characters." });
        } else if (!/[A-Z]/.test(newPassword)) {
            errors.push({ field: "newPassword", message: "New password must contain at least one uppercase letter." });
        } else if (!/[a-z]/.test(newPassword)) {
            errors.push({ field: "newPassword", message: "New password must contain at least one lowercase letter." });
        } else if (!/[0-9]/.test(newPassword)) {
            errors.push({ field: "newPassword", message: "New password must contain at least one digit." });
        }
    }

    return errors;
}

module.exports = { validateAddress, validateProfileUpdate, validateChangePassword };
