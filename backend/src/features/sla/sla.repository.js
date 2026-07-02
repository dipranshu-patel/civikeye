"use strict";

const { query } = require("../../shared/db/query");

async function insertSlaCategory({ name, departmentId, slaDurationDays, description }) {
    const sql = `
        INSERT INTO sla_categories
            (name, department_id, sla_duration_days, description)
        VALUES ($1, $2, $3, $4)
        RETURNING
            id, name, department_id, sla_duration_days,
            description, created_at, updated_at;
    `;

    const { rows } = await query(sql, [
        name,
        departmentId,
        slaDurationDays,
        description ?? null,
    ]);
    return rows[0];
}

async function updateSlaCategory(id, fields) {
    const allowed = ["name", "department_id", "sla_duration_days", "description"];
    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const col of allowed) {
        const inputKey =
            col === "department_id"     ? "departmentId" :
            col === "sla_duration_days" ? "slaDurationDays" :
            col;

        if (Object.prototype.hasOwnProperty.call(fields, inputKey)) {
            setClauses.push(`${col} = $${idx}`);
            values.push(fields[inputKey]);
            idx++;
        }
    }

    if (setClauses.length === 0) return null;

    values.push(id);

    const sql = `
        UPDATE sla_categories
        SET ${setClauses.join(", ")}
        WHERE id = $${idx}
        RETURNING
            id, name, department_id, sla_duration_days,
            description, created_at, updated_at;
    `;

    const { rows } = await query(sql, values);
    return rows[0] ?? null;
}

async function findAllSlaCategories() {
    const sql = `
        SELECT
            s.id,
            s.name,
            s.department_id,
            d.name  AS department_name,
            d.slug  AS department_slug,
            d.code  AS department_code,
            s.sla_duration_days,
            s.description,
            s.created_at,
            s.updated_at
        FROM sla_categories s
        JOIN departments d ON d.id = s.department_id
        ORDER BY d.name ASC, s.name ASC;
    `;

    const { rows } = await query(sql);
    return rows;
}

async function findSlaCategories() {
    const sql = `
        SELECT
            s.id,
            s.name,
            s.department_id,
            d.name  AS department_name,
            d.slug  AS department_slug,
            d.code  AS department_code,
            s.sla_duration_days,
            s.description
        FROM sla_categories s
        JOIN departments d ON d.id = s.department_id AND d.is_active = TRUE
        ORDER BY d.name ASC, s.name ASC;
    `;

    const { rows } = await query(sql);
    return rows;
}

async function findSlaCategoryById(id) {
    const sql = `
        SELECT
            s.id,
            s.name,
            s.department_id,
            d.name  AS department_name,
            d.slug  AS department_slug,
            d.code  AS department_code,
            s.sla_duration_days,
            s.description,
            s.created_at,
            s.updated_at
        FROM sla_categories s
        JOIN departments d ON d.id = s.department_id
        WHERE s.id = $1
        LIMIT 1;
    `;

    const { rows } = await query(sql, [id]);
    return rows[0] ?? null;
}

async function getSlaSummary() {
    const sql = `
        SELECT
            COUNT(*)::INT                       AS total,
            ROUND(AVG(sla_duration_days), 1)    AS avg_sla_days,
            MIN(sla_duration_days)::INT         AS fastest_days,
            MAX(sla_duration_days)::INT         AS longest_days
        FROM sla_categories;
    `;

    const { rows } = await query(sql);
    return rows[0];
}

module.exports = {
    insertSlaCategory,
    updateSlaCategory,
    findAllSlaCategories,
    findSlaCategories,
    findSlaCategoryById,
    getSlaSummary,
};
