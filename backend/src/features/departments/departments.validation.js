"use strict";

function validateCreateDepartment(body) {
    const errors = [];

    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
        errors.push({ field: "name", message: "Department name must be at least 2 characters." });
    }
    if (body.name && body.name.trim().length > 100) {
        errors.push({ field: "name", message: "Department name must not exceed 100 characters." });
    }

    if (body.email !== undefined && body.email !== null && body.email !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof body.email !== "string" || !emailRegex.test(body.email.trim())) {
            errors.push({ field: "email", message: "Please enter a valid email address." });
        } else if (body.email.trim().length > 255) {
            errors.push({ field: "email", message: "Email must not exceed 255 characters." });
        }
    }

    if (body.category !== undefined && body.category !== null) {
        if (typeof body.category !== "string") {
            errors.push({ field: "category", message: "Category must be a string." });
        } else if (body.category.trim().length > 100) {
            errors.push({ field: "category", message: "Category must not exceed 100 characters." });
        }
    }

    // Password is required on creation
    if (!body.password || typeof body.password !== "string") {
        errors.push({ field: "password", message: "A department password is required." });
    } else if (body.password.length < 8) {
        errors.push({ field: "password", message: "Password must be at least 8 characters." });
    } else if (body.password.length > 128) {
        errors.push({ field: "password", message: "Password must not exceed 128 characters." });
    }

    if (body.description !== undefined && body.description !== null) {
        if (typeof body.description !== "string") {
            errors.push({ field: "description", message: "Description must be a string." });
        } else if (body.description.trim().length > 1000) {
            errors.push({ field: "description", message: "Description must not exceed 1000 characters." });
        }
    }

    return errors;
}

function validateResetDepartmentPassword(body) {
    const errors = [];

    if (!body.password || typeof body.password !== "string") {
        errors.push({ field: "password", message: "A new password is required." });
    } else if (body.password.length < 8) {
        errors.push({ field: "password", message: "Password must be at least 8 characters." });
    } else if (body.password.length > 128) {
        errors.push({ field: "password", message: "Password must not exceed 128 characters." });
    }

    return errors;
}

module.exports = { validateCreateDepartment, validateResetDepartmentPassword };
