"use strict";

const { query }    = require("../db/query");
const { radiusKm } = require("../../config/verification");

// ─── SAVEPOINT-based safe query runner ───────────────────────────────────────
// When inside a pg transaction (client != null), wrap every notification INSERT
// in a SAVEPOINT so a failure rolls back only the notification — not the whole
// transaction (prevents 25P02 "transaction is aborted" cascade).
const NOTIFY_SP = "notify_best_effort";

async function _safeQuery(client, sql, params, label) {
    if (!client) {
        // Standalone — no transaction to poison, just try/catch
        try {
            await query(sql, params);
        } catch (err) {
            console.error(`[notify] ${label}: ${err.message}`);
        }
        return;
    }
    // Inside transaction — isolate with SAVEPOINT
    try {
        await client.query(`SAVEPOINT ${NOTIFY_SP}`);
        await client.query(sql, params);
        await client.query(`RELEASE SAVEPOINT ${NOTIFY_SP}`);
    } catch (err) {
        // Roll back only the notification, leave the main transaction intact
        await client.query(`ROLLBACK TO SAVEPOINT ${NOTIFY_SP}`).catch(() => {});
        await client.query(`RELEASE SAVEPOINT ${NOTIFY_SP}`).catch(() => {});
        console.error(`[notify] ${label}: ${err.message}`);
    }
}

// ─── Single notification ──────────────────────────────────────────────────────

async function notify(client, {
    userId, type, title, body,
    data       = {},
    entityType = null,
    entityId   = null,
}) {
    await _safeQuery(
        client,
        `INSERT INTO notifications
             (user_id, type, title, body, data, entity_type, entity_id)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7::uuid)`,
        [userId, type, title, body, JSON.stringify(data), entityType, entityId],
        `${type} → ${userId}`,
    );
}

// ─── Multiple users, same notification ───────────────────────────────────────

async function notifyMany(client, userIds, opts) {
    if (!userIds?.length) return;
    await Promise.all(userIds.map((uid) => notify(client, { ...opts, userId: uid })));
}

// ─── Nearby citizens (bulk INSERT … SELECT with Haversine filter) ─────────────

async function notifyNearbyCitizens(client, {
    excludeUserId, lat, lon,
    type, title, body, data = {}, entityType = null, entityId = null,
}) {
    await _safeQuery(
        client,
        `INSERT INTO notifications
             (user_id, type, title, body, data, entity_type, entity_id)
         SELECT u.id, $1, $2, $3, $4::jsonb, $5, $6::uuid
         FROM   users u
         WHERE  u.role = 'citizen'
           AND  u.id          != $7
           AND  u.latitude    IS NOT NULL
           AND  u.longitude   IS NOT NULL
           AND  6371.0 * 2 * ASIN(SQRT(
                    POWER(SIN(RADIANS((u.latitude  - $8) / 2)), 2) +
                    COS(RADIANS($8)) * COS(RADIANS(u.latitude))  *
                    POWER(SIN(RADIANS((u.longitude - $9) / 2)), 2)
                )) <= $10`,
        [type, title, body, JSON.stringify(data), entityType, entityId,
         excludeUserId, lat, lon, radiusKm],
        `nearbyCitizens ${type}`,
    );
}

// ─── Prior verifiers on a complaint (bulk INSERT … SELECT) ───────────────────

async function notifyPriorVerifiers(client, {
    complaintId, excludeVerifierId,
    type, title, body, data = {}, entityType = null, entityId = null,
}) {
    await _safeQuery(
        client,
        `INSERT INTO notifications
             (user_id, type, title, body, data, entity_type, entity_id)
         SELECT DISTINCT cv.verifier_id, $1, $2, $3, $4::jsonb, $5, $6::uuid
         FROM   complaint_verifications cv
         WHERE  cv.complaint_id = $7
           AND  cv.verifier_id != $8`,
        [type, title, body, JSON.stringify(data), entityType, entityId,
         complaintId, excludeVerifierId],
        `priorVerifiers ${type}`,
    );
}

module.exports = { notify, notifyMany, notifyNearbyCitizens, notifyPriorVerifiers };

