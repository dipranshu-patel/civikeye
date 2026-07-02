"use strict";

const { query, withTransaction } = require("../../shared/db/query");

async function getNotifications({ userId, page, limit }) {
    const offset = (page - 1) * limit;
    const sql = `
        SELECT id, type, title, body, data, entity_type, entity_id, is_read, created_at
        FROM   notifications
        WHERE  user_id = $1
        ORDER  BY created_at DESC
        LIMIT  $2 OFFSET $3;
    `;
    const { rows } = await query(sql, [userId, limit, offset]);
    return rows;
}

async function getUnreadCount(userId) {
    const { rows } = await query(
        `SELECT COUNT(*)::INT AS count FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
        [userId],
    );
    return rows[0]?.count ?? 0;
}

async function getTotalCount(userId) {
    const { rows } = await query(
        `SELECT COUNT(*)::INT AS count FROM notifications WHERE user_id = $1`,
        [userId],
    );
    return rows[0]?.count ?? 0;
}

async function markOneRead({ notificationId, userId }) {
    const { rows } = await query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE id = $1 AND user_id = $2
         RETURNING id, is_read`,
        [notificationId, userId],
    );
    return rows[0] ?? null;   
}

async function markAllRead(userId) {
    const { rows } = await query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE user_id = $1 AND is_read = FALSE
         RETURNING id`,
        [userId],
    );
    return rows.length;  
}

module.exports = {
    getNotifications,
    getUnreadCount,
    getTotalCount,
    markOneRead,
    markAllRead,
};
