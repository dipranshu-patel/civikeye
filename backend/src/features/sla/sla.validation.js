"use strict";

function validateCreateSlaCategory(body) {
    const errors = [];

    if (
        !body.name ||
        typeof body.name !== "string" ||
        body.name.trim().length < 2
    ) {
        errors.push({
            field: "name",
            message: "SLA category name must be at least 2 characters.",
        });
    }
    if (body.name && body.name.trim().length > 150) {
        errors.push({
            field: "name",
            message: "SLA category name must not exceed 150 characters.",
        });
    }

    if (!body.departmentId || typeof body.departmentId !== "string") {
        errors.push({
            field: "departmentId",
            message: "A valid department ID is required.",
        });
    }

    const days = Number(body.slaDurationDays);
    if (
        !body.slaDurationDays ||
        isNaN(days) ||
        !Number.isInteger(days) ||
        days < 1
    ) {
        errors.push({
            field: "slaDurationDays",
            message: "SLA duration must be a positive integer (days).",
        });
    }
    if (days > 365) {
        errors.push({
            field: "slaDurationDays",
            message: "SLA duration cannot exceed 365 days.",
        });
    }

    if (body.description !== undefined && body.description !== null) {
        if (typeof body.description !== "string") {
            errors.push({
                field: "description",
                message: "Description must be a string.",
            });
        } else if (body.description.trim().length > 1000) {
            errors.push({
                field: "description",
                message: "Description must not exceed 1000 characters.",
            });
        }
    }

    return errors;
}

function validateUpdateSlaCategory(body) {
    const errors = [];

    if (body.name !== undefined) {
        if (typeof body.name !== "string" || body.name.trim().length < 2) {
            errors.push({
                field: "name",
                message: "SLA category name must be at least 2 characters.",
            });
        }
        if (body.name.trim().length > 150) {
            errors.push({
                field: "name",
                message: "SLA category name must not exceed 150 characters.",
            });
        }
    }

    if (
        body.departmentId !== undefined &&
        typeof body.departmentId !== "string"
    ) {
        errors.push({
            field: "departmentId",
            message: "A valid department ID is required.",
        });
    }

    if (body.slaDurationDays !== undefined) {
        const days = Number(body.slaDurationDays);
        if (isNaN(days) || !Number.isInteger(days) || days < 1) {
            errors.push({
                field: "slaDurationDays",
                message: "SLA duration must be a positive integer (days).",
            });
        } else if (days > 365) {
            errors.push({
                field: "slaDurationDays",
                message: "SLA duration cannot exceed 365 days.",
            });
        }
    }

    if (body.description !== undefined && body.description !== null) {
        if (typeof body.description !== "string") {
            errors.push({
                field: "description",
                message: "Description must be a string.",
            });
        } else if (body.description.trim().length > 1000) {
            errors.push({
                field: "description",
                message: "Description must not exceed 1000 characters.",
            });
        }
    }

    if (Object.keys(body).length === 0) {
        errors.push({
            field: "body",
            message: "At least one field must be provided to update.",
        });
    }

    return errors;
}

module.exports = { validateCreateSlaCategory, validateUpdateSlaCategory };
