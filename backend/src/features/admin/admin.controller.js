"use strict";

const service      = require("./admin.service");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

// GET /api/admin/dashboard
const getDashboard = asyncHandler(async (_req, res) => {
    const data = await service.getAdminDashboard();
    return sendSuccess(res, data);
});

// GET /api/admin/audit-logs
const getAuditLogs = asyncHandler(async (req, res) => {
    const { search, action, entityType, dateFrom, dateTo } = req.query;
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const data = await service.getAuditLogs({
        search, action, entityType, dateFrom, dateTo, page, limit,
    });
    return sendSuccess(res, data);
});

// GET /api/admin/audit-logs/:id
const getAuditLogDetail = asyncHandler(async (req, res) => {
    const data = await service.getAuditLogDetail(req.params.id);
    return sendSuccess(res, { log: data });
});

module.exports = { getDashboard, getAuditLogs, getAuditLogDetail };
