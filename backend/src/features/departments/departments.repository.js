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
            d.category,
            d.code,
            d.description,
            d.created_at,
            COUNT(s.id)::INT                         AS sla_count,
            COALESCE(dp.resolution_rate_pct, 0)      AS resolution_rate_pct,
            COALESCE(dp.avg_resolution_days, 0)      AS avg_resolution_days,
            COALESCE(dp.overdue_count, 0)::INT       AS overdue_count,
            COALESCE(dp.overdue_rate_pct, 0)         AS overdue_rate_pct,
            COALESCE(dp.total_complaints, 0)::INT    AS total_complaints,
            COALESCE(dp.resolved_count, 0)::INT      AS resolved_count,
            COALESCE(dp.resolved_this_month, 0)::INT AS resolved_this_month,
            ROUND(
                COUNT(cv.id) FILTER (WHERE cv.vote = 'confirm') * 100.0
                / NULLIF(COUNT(cv.id), 0), 1
            )                                        AS verified_pct
        FROM departments d
        LEFT JOIN sla_categories s        ON s.department_id  = d.id
        LEFT JOIN dept_performance dp     ON dp.department_id = d.id
        LEFT JOIN complaints c2           ON c2.department_id = d.id
        LEFT JOIN complaint_verifications cv ON cv.complaint_id = c2.id
        WHERE d.is_active = TRUE
        GROUP BY
            d.id,
            dp.resolution_rate_pct,
            dp.avg_resolution_days,
            dp.overdue_count,
            dp.overdue_rate_pct,
            dp.total_complaints,
            dp.resolved_count,
            dp.resolved_this_month
        ORDER BY dp.resolution_rate_pct DESC NULLS LAST;
    `;

    const { rows } = await query(sql);
    return rows;
}

async function findActiveDepartmentsStats() {
    const sql = `
        SELECT
            COUNT(d.id)::INT                         AS total_departments,
            ROUND(AVG(dp.avg_resolution_days), 1)   AS avg_response_days,
            ROUND(AVG(dp.resolution_rate_pct), 1)   AS avg_resolution_rate_pct,
            COALESCE(SUM(dp.overdue_count), 0)::INT  AS total_overdue,
            ROUND(
                COUNT(cv.id) FILTER (WHERE cv.vote = 'confirm') * 100.0
                / NULLIF(COUNT(cv.id), 0), 1
            )                                        AS public_verification_pct
        FROM departments d
        LEFT JOIN dept_performance dp       ON dp.department_id = d.id
        LEFT JOIN complaints c              ON c.department_id  = d.id
        LEFT JOIN complaint_verifications cv ON cv.complaint_id = c.id
        WHERE d.is_active = TRUE;
    `;

    const { rows } = await query(sql);
    return rows[0] ?? null;
}

async function findRecentComplaintsByDepartment(departmentId, limit = 6) {
    const sql = `
        SELECT
            c.id,
            c.public_code,
            c.title,
            c.status,
            c.category_id,
            cat.name AS category_name,
            c.created_at,
            c.resolved_at,
            c.sla_deadline
        FROM complaints c
        LEFT JOIN sla_categories cat ON cat.id = c.category_id
        WHERE c.department_id = $1
          AND c.status IN ('resolved', 'reported', 'in_progress', 'reopened')
        ORDER BY c.updated_at DESC
        LIMIT $2;
    `;

    const { rows } = await query(sql, [departmentId, limit]);
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

async function findDistinctCategories() {
    const sql = `
        SELECT DISTINCT category
        FROM departments
        WHERE is_active = TRUE AND category IS NOT NULL
        ORDER BY category ASC;
    `;
    const { rows } = await query(sql);
    return rows.map((r) => r.category);
}

module.exports = {
    insertDepartment,
    updateDepartmentPassword,
    findAllDepartments,
    findActiveDepartments,
    findActiveDepartmentsStats,
    findRecentComplaintsByDepartment,
    findDepartmentById,
    findDepartmentBySlug,
    toggleActiveById,
    findDistinctCategories,
    slugify,
};
