"use strict";

const { query } = require("../../shared/db/query");

async function updateUserLocation(userId, { latitude, longitude }, client = null) {
    const executor = client || { query: (sql, params) => query(sql, params) };

    const sql = `
        UPDATE users
        SET
            latitude  = $2,
            longitude = $3
        WHERE id = $1
        RETURNING
            id,
            full_name,
            email,
            role,
            latitude,
            longitude,
            created_at;
    `;

    const { rows } = await executor.query(sql, [userId, latitude, longitude]);
    return rows[0] ?? null;
}

async function findUserById(userId, client = null) {
    const executor = client || { query: (sql, params) => query(sql, params) };

    const sql = `
        SELECT
            id,
            full_name,
            email,
            role,
            latitude,
            longitude,
            created_at
        FROM users
        WHERE id = $1
        LIMIT 1;
    `;

    const { rows } = await executor.query(sql, [userId]);
    return rows[0] ?? null;
}

module.exports = { updateUserLocation, findUserById };
