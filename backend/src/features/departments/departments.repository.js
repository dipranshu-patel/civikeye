"use strict";

const { query } = require("../../shared/db/query");

function slugify(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

const SAFE_COLUMNS = `
    d.id,
    d.name,
    d.slug,
    d.email,
    d.category,
    d.code,
    d.description,
    d.is_active,
    d.user_id,
    d.created_at,
    d.updated_at
`;

async function insertDepartment({
    name,
    email,
    category,
    description,
    passwordHash,
}) {
    const slug = slugify(name);

    const sql = `
        INSERT INTO departments AS d (name, slug, email, category, code, description, password_hash, is_active)
        VALUES (
            $1, $2, $3, $4,
            'DEP-' || LPAD(nextval('dept_code_seq')::TEXT, 3, '0'),
            $5, $6, TRUE
        )
        RETURNING ${SAFE_COLUMNS};
    `;

    const { rows } = await query(sql, [
        name,
        slug,
        email ?? null,
        category ?? null,
        description ?? null,
        passwordHash,
    ]);
    return rows[0];
}

async function updateDepartmentPassword(id, passwordHash) {
    const sql = `
        UPDATE departments
        SET password_hash = $2
        WHERE id = $1
        RETURNING id;
    `;
    const { rows } = await query(sql, [id, passwordHash]);
    return rows[0] ?? null;
}

async function findAllDepartments() {
    const sql = `
        SELECT
            ${SAFE_COLUMNS},
            COUNT(s.id)::INT AS sla_count
        FROM departments d
        LEFT JOIN sla_categories s ON s.department_id = d.id
        GROUP BY d.id
        ORDER BY d.name ASC;
    `;

    const { rows } = await query(sql);
    return rows;
}

async function findActiveDepartments() {
    const sql = `
        SELECT
            d.id,
            d.name,
            d.slug,
            d.email,
            d.category,
            d.code,
            d.description,
            d.created_at,
            COUNT(s.id)::INT AS sla_count
        FROM departments d
        LEFT JOIN sla_categories s ON s.department_id = d.id
        WHERE d.is_active = TRUE
        GROUP BY d.id
        ORDER BY d.name ASC;
    `;

    const { rows } = await query(sql);
    return rows;
}

async function findDepartmentById(id) {
    const sql = `
        SELECT ${SAFE_COLUMNS}
        FROM departments d
        WHERE d.id = $1
        LIMIT 1;
    `;

    const { rows } = await query(sql, [id]);
    return rows[0] ?? null;
}

async function findDepartmentBySlug(slug) {
    const sql = `
        SELECT id FROM departments WHERE slug = $1 LIMIT 1;
    `;
    const { rows } = await query(sql, [slug]);
    return rows[0] ?? null;
}

async function toggleActiveById(id) {
    const sql = `
        UPDATE departments AS d
        SET is_active = NOT d.is_active
        WHERE d.id = $1
        RETURNING ${SAFE_COLUMNS};
    `;
    const { rows } = await query(sql, [id]);
    return rows[0] ?? null;
}

module.exports = {
    insertDepartment,
    updateDepartmentPassword,
    findAllDepartments,
    findActiveDepartments,
    findDepartmentById,
    findDepartmentBySlug,
    toggleActiveById,
    slugify,
};
