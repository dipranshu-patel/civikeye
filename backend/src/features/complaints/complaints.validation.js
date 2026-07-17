"use strict";

const VALID_ISSUE_TYPES = ["authority_required", "community_fixable"];
const VALID_TABS = [
    "active",
    "pending_verification",
    "resolved",
    "reopened",
    "overdue",
];
const VALID_SORTS_MY = [
    "recent",
    "oldest",
    "sla_breached",
    "most_upvoted",
    "awaiting_verification",
];
const VALID_SORTS_EXP = ["recent", "most_upvoted", "sla_deadline"];

function validateCreateComplaint(body, files) {
    const errors = [];

    if (
        !body.title ||
        typeof body.title !== "string" ||
        body.title.trim().length < 5
    ) {
        errors.push({
            field: "title",
            message: "Title must be at least 5 characters.",
        });
    }
    if (body.title && body.title.trim().length > 150) {
        errors.push({
            field: "title",
            message: "Title must not exceed 150 characters.",
        });
    }

    if (!files || files.length < 1) {
        errors.push({
            field: "photos",
            message: "At least 1 photo is required.",
        });
    }

    if (!body.categoryId || typeof body.categoryId !== "string") {
        errors.push({
            field: "categoryId",
            message: "A valid category (SLA category ID) is required.",
        });
    }

    if (!body.issueType || !VALID_ISSUE_TYPES.includes(body.issueType)) {
        errors.push({
            field: "issueType",
            message: `Issue type must be one of: ${VALID_ISSUE_TYPES.join(", ")}.`,
        });
    }

    if (
        !body.addressText ||
        typeof body.addressText !== "string" ||
        body.addressText.trim().length < 10
    ) {
        errors.push({
            field: "addressText",
            message: "Address must be at least 10 characters.",
        });
    }
    if (body.addressText && body.addressText.trim().length > 300) {
        errors.push({
            field: "addressText",
            message: "Address must not exceed 300 characters.",
        });
    }

    const lat = parseFloat(body.latitude);
    const lng = parseFloat(body.longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push({
            field: "latitude",
            message:
                "A valid latitude is required. Please allow location access.",
        });
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.push({
            field: "longitude",
            message:
                "A valid longitude is required. Please allow location access.",
        });
    }

    if (body.description && body.description.length > 600) {
        errors.push({
            field: "description",
            message: "Description must not exceed 600 characters.",
        });
    }

    return errors;
}

function validateExploreQuery(query) {
    const errors = [];
    const page = parseInt(query.page, 10);
    const limit = parseInt(query.limit, 10);

    if (query.sort && !VALID_SORTS_EXP.includes(query.sort)) {
        errors.push({
            field: "sort",
            message: `Sort must be one of: ${VALID_SORTS_EXP.join(", ")}.`,
        });
    }
    if (query.page && (isNaN(page) || page < 1)) {
        errors.push({
            field: "page",
            message: "Page must be a positive integer.",
        });
    }
    if (query.limit && (isNaN(limit) || limit < 1 || limit > 50)) {
        errors.push({
            field: "limit",
            message: "Limit must be between 1 and 50.",
        });
    }
    return errors;
}

function validateNearbyQuery(query) {
    const errors = [];
    const lat = parseFloat(query.lat);
    const lng = parseFloat(query.lng);
    const radius = parseInt(query.radius, 10);

    if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push({ field: "lat", message: "A valid latitude is required." });
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.push({
            field: "lng",
            message: "A valid longitude is required.",
        });
    }
    if (query.radius && (isNaN(radius) || radius < 100 || radius > 10_000)) {
        errors.push({
            field: "radius",
            message: "Radius must be between 100 and 10000 metres.",
        });
    }
    return errors;
}

function validateMyComplaintsQuery(query) {
    const errors = [];
    if (query.tab && !VALID_TABS.includes(query.tab)) {
        errors.push({
            field: "tab",
            message: `Tab must be one of: ${VALID_TABS.join(", ")}.`,
        });
    }
    if (query.sort && !VALID_SORTS_MY.includes(query.sort)) {
        errors.push({
            field: "sort",
            message: `Sort must be one of: ${VALID_SORTS_MY.join(", ")}.`,
        });
    }
    return errors;
}

module.exports = {
    validateCreateComplaint,
    validateExploreQuery,
    validateNearbyQuery,
    validateMyComplaintsQuery,
};
