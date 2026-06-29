"use strict";

const service = require("./complaints.service");
const {
    validateCreateComplaint,
    validateExploreQuery,
    validateNearbyQuery,
    validateMyComplaintsQuery,
} = require("./complaints.validation");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

// ─── POST /api/complaints ─────────────────────────────────────────────────────

const createComplaint = asyncHandler(async (req, res) => {
    const errors = validateCreateComplaint(req.body, req.files);
    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    const { title, description, categoryId, issueType, addressText, latitude, longitude } = req.body;

    const result = await service.createComplaint({
        reporterId:  req.user.userId,
        title,
        description,
        categoryId,
        issueType,
        addressText,
        latitude,
        longitude,
        files:       req.files,
    });

    return sendSuccess(res, { complaint: result }, 201);
});

// ─── GET /api/complaints ──────────────────────────────────────────────────────

const exploreComplaints = asyncHandler(async (req, res) => {
    const errors = validateExploreQuery(req.query);
    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    const { search, status, issue_type, category_id, department_id, sort } = req.query;
    const page  = parseInt(req.query.page, 10)  || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const data = await service.exploreComplaints({
        search, status, issueType: issue_type, categoryId: category_id,
        departmentId: department_id, sort, page, limit,
    });

    return sendSuccess(res, data);
});

// ─── GET /api/complaints/nearby ───────────────────────────────────────────────

const getNearby = asyncHandler(async (req, res) => {
    const errors = validateNearbyQuery(req.query);
    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    const lat    = parseFloat(req.query.lat);
    const lng    = parseFloat(req.query.lng);
    const radius = parseInt(req.query.radius, 10) || 1000;

    const complaints = await service.getNearbyComplaints({ lat, lng, radius });
    return sendSuccess(res, { complaints });
});

// ─── GET /api/complaints/similar ─────────────────────────────────────────────

const getSimilar = asyncHandler(async (req, res) => {
    const { lat, lng, category_id } = req.query;

    if (!lat || !lng || !category_id) {
        return res.status(422).json({
            success: false,
            errors:  [{ field: "query", message: "lat, lng and category_id are required." }],
        });
    }

    const complaints = await service.getSimilarComplaints({
        lat:        parseFloat(lat),
        lng:        parseFloat(lng),
        categoryId: category_id,
    });

    return sendSuccess(res, { complaints });
});

// ─── GET /api/complaints/:id ──────────────────────────────────────────────────

const getComplaintDetail = asyncHandler(async (req, res) => {
    const requestingUserId = req.user?.userId ?? null;
    const data = await service.getComplaintDetail(req.params.id, requestingUserId);
    return sendSuccess(res, { complaint: data });
});

// ─── GET /api/me/complaints ───────────────────────────────────────────────────

const getMyComplaints = asyncHandler(async (req, res) => {
    const errors = validateMyComplaintsQuery(req.query);
    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    const { tab, search, sort } = req.query;
    const page  = parseInt(req.query.page, 10)  || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const data = await service.getMyComplaints({
        reporterId: req.user.userId,
        tab, search, sort, page, limit,
    });

    return sendSuccess(res, data);
});

// ─── POST /api/complaints/:id/upvote ─────────────────────────────────────────

const addUpvote = asyncHandler(async (req, res) => {
    const data = await service.addUpvote(req.params.id, req.user.userId);
    return sendSuccess(res, data);
});

// ─── DELETE /api/complaints/:id/upvote ───────────────────────────────────────

const removeUpvote = asyncHandler(async (req, res) => {
    const data = await service.removeUpvote(req.params.id, req.user.userId);
    return sendSuccess(res, data);
});

// ─── GET /api/me/dashboard ────────────────────────────────────────────────────

const getDashboard = asyncHandler(async (req, res) => {
    const lat = req.query.lat ? parseFloat(req.query.lat) : null;
    const lng = req.query.lng ? parseFloat(req.query.lng) : null;

    const data = await service.getDashboard(req.user.userId, { lat, lng });
    return sendSuccess(res, data);
});

module.exports = {
    createComplaint,
    exploreComplaints,
    getNearby,
    getSimilar,
    getComplaintDetail,
    getMyComplaints,
    addUpvote,
    removeUpvote,
    getDashboard,
};
