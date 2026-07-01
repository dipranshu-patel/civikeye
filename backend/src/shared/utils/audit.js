"use strict";

/**
 * audit.js — Best-effort audit log helper.
 *
 * Rules (same pattern as notify.js):
 *  - NEVER throws. Catches all errors and logs them.
 *  - Pass a pg PoolClient to insert inside an existing transaction.
 *  - Pass null to use the shared pool (fire-and-forget after transaction).
 *
 * metadata shape:
 *  {
 *    entityName:  string,               // human-readable display name
 *    entityCode:  string|null,          // e.g. "DEP-001"
 *    changes:     [{field, before, after}],
 *    reason:      string|null,
 *  }
 */

const { query } = require("../db/query");

async function audit(client, {
    actorId,
    actorRole,
    action,
    entityType,
    entityId   = null,
    metadata   = {},
}) {
    const q   = client ? client.query.bind(client) : query;
    const sql = `
        INSERT INTO audit_logs
            (actor_id, actor_role, action, entity_type, entity_id, metadata)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb)
    `;
    try {
        await q(sql, [
            actorId    ?? null,
            actorRole,
            action,
            entityType,
            entityId   ?? null,
            JSON.stringify(metadata),
        ]);
    } catch (err) {
        console.error(`[audit] ${action} ${entityType}: ${err.message}`);
    }
}

module.exports = { audit };
