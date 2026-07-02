"use strict";

const service      = require("./dept.service");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

const getDashboard = asyncHandler(async (req, res) => {
    const data = await service.getDeptDashboard(req.user.departmentId);
    return sendSuccess(res, data);
});

const getComplaints = asyncHandler(async (req, res) => {
    const { tab, search } = req.query;
    const page  = parseInt(req.query.page, 10)  || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const VALID_TABS = ["assigned", "in_progress", "pending_verification", "resolved", "reopened"];
    if (tab && !VALID_TABS.includes(tab)) {
        return res.status(422).json({
            success: false,
            errors: [{ field: "tab", message: `Tab must be one of: ${VALID_TABS.join(", ")}` }],
        });
    }

    const data = await service.getDeptComplaints({
        departmentId: req.user.departmentId,
        tab:   tab   || "assigned",
        search,
        page,
        limit,
    });

    return sendSuccess(res, data);
});

const getComplaintDetail = asyncHandler(async (req, res) => {
    const data = await service.getDeptComplaintDetail(req.params.id, req.user.departmentId);
    return sendSuccess(res, { complaint: data });
});

const updateComplaintStatus = asyncHandler(async (req, res) => {
    const { toStatus, note } = req.body;

    if (!toStatus || typeof toStatus !== "string") {
        return res.status(422).json({
            success: false,
            errors: [{ field: "toStatus", message: "toStatus is required." }],
        });
    }

    const workPhotos = req.files ?? [];

    const result = await service.updateComplaintStatus({
        complaintId:  req.params.id,
        departmentId: req.user.departmentId,
        actorId:      req.user.userId,
        toStatus,
        note,
        workPhotos,
    });

    return sendSuccess(res, { transition: result });
});

module.exports = {
    getDashboard,
    getComplaints,
    getComplaintDetail,
    updateComplaintStatus,
};
