"use strict";

const repo     = require("./notifications.repository");
const AppError = require("../../shared/utils/app-error");

async function listNotifications({ userId, page = 1, limit = 20 }) {
    page  = Math.max(1, parseInt(page)  || 1);
    limit = Math.min(50, parseInt(limit) || 20);

    const [rows, total, unread] = await Promise.all([
        repo.getNotifications({ userId, page, limit }),
        repo.getTotalCount(userId),
        repo.getUnreadCount(userId),
    ]);

    return {
        notifications: rows.map(formatNotification),
        pagination:    { page, limit, total },
        unreadCount:   unread,
    };
}

async function getUnreadCount(userId) {
    const count = await repo.getUnreadCount(userId);
    return { count };
}

async function markOneRead({ notificationId, userId }) {
    const row = await repo.markOneRead({ notificationId, userId });
    if (!row) {
        throw new AppError("NOTIFICATION_NOT_FOUND", "Notification not found.", 404);
    }
    return { id: row.id, isRead: row.is_read };
}

async function markAllRead(userId) {
    const count = await repo.markAllRead(userId);
    return { markedRead: count };
}

function formatNotification(row) {
    return {
        id:         row.id,
        type:       row.type,
        title:      row.title,
        body:       row.body,
        data:       row.data ?? {},
        entityType: row.entity_type ?? null,
        entityId:   row.entity_id   ?? null,
        isRead:     row.is_read,
        createdAt:  row.created_at,
    };
}

module.exports = {
    listNotifications,
    getUnreadCount,
    markOneRead,
    markAllRead,
};
