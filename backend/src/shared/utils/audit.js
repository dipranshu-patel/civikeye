"use strict";

const { query } = require("../db/query");

async function audit(
    client,
    { actorId, actorRole, action, entityType, entityId = null, metadata = {} },
) {
    const q = client ? client.query.bind(client) : query;
    const sql = `
        INSERT INTO audit_logs
            (actor_id, actor_role, action, entity_type, entity_id, metadata)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb)
    `;
    try {
        await q(sql, [
            actorId ?? null,
            actorRole,
            action,
            entityType,
            entityId ?? null,
            JSON.stringify(metadata),
        ]);
    } catch (err) {
        console.error(`[audit] ${action} ${entityType}: ${err.message}`);
    }
}

module.exports = { audit };
