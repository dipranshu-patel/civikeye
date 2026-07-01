"use strict";

const service      = require("./notifications.service");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

// GET /api/notifications?page=&limit=
const listNotifications = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const data = await service.listNotifications({ userId: req.user.userId, page, limit });
    return sendSuccess(res, data);
});

// GET /api/notifications/unread-count
const getUnreadCount = asyncHandler(async (req, res) => {
    const data = await service.getUnreadCount(req.user.userId);
    return sendSuccess(res, data);
});

// PATCH /api/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
    const data = await service.markAllRead(req.user.userId);
    return sendSuccess(res, data);
});

// PATCH /api/notifications/:id/read
const markOneRead = asyncHandler(async (req, res) => {
    const data = await service.markOneRead({
        notificationId: req.params.id,
        userId:         req.user.userId,
    });
    return sendSuccess(res, data);
});

module.exports = { listNotifications, getUnreadCount, markAllRead, markOneRead };
