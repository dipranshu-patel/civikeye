"use strict";

const repo = require("./departments.repository");
const { hashPassword } = require("../../shared/utils/hash");
const AppError = require("../../shared/utils/app-error");
const { withTransaction } = require("../../shared/db/query");
const { insertUser } = require("../auth/auth.repository");
const { audit } = require("../../shared/utils/audit");

async function createDepartment({
    name,
    email,
    category,
    description,
    password,
    actorId,
}) {
    const trimmedName = name.trim();

    if (!email || !email.trim()) {
        throw new AppError(
            "MISSING_EMAIL",
            "Department email is required.",
            422,
        );
    }
    if (!password) {
        throw new AppError(
            "MISSING_PASSWORD",
            "Department password is required.",
            422,
        );
    }

    const slug = repo.slugify(trimmedName);
    const existing = await repo.findDepartmentBySlug(slug);
    if (existing) {
        throw new AppError(
            "DEPARTMENT_EXISTS",
            `A department with the name "${trimmedName}" already exists.`,
            409,
        );
    }

    const passwordHash = await hashPassword(password);

    const { dept } = await withTransaction(async (client) => {
        const user = await insertUser({
            fullName: trimmedName,
            email: email.trim().toLowerCase(),
            passwordHash,
            role: "official",
        });

        const slug2 = repo.slugify(trimmedName);
        const insertSQL = `
            INSERT INTO departments (name, slug, email, category, code, description, password_hash, is_active, user_id)
            VALUES (
                $1, $2, $3, $4,
                'DEP-' || LPAD(nextval('dept_code_seq')::TEXT, 3, '0'),
                $5, $6, TRUE, $7
            )
            RETURNING
                id, name, slug, email, category, code,
                description, is_active, user_id, created_at, updated_at;
        `;

        const { rows } = await client.query(insertSQL, [
            trimmedName,
            slug2,
            email.trim().toLowerCase(),
            category?.trim() || null,
            description ?? null,
            passwordHash,
            user.id,
        ]);

        return { dept: rows[0], user };
    });

    audit(null, {
        actorId,
        actorRole: "admin",
        action: "CREATE",
        entityType: "department",
        entityId: dept.id,
        metadata: {
            entityName: dept.name,
            entityCode: dept.code,
            changes: [
                { field: "name", before: null, after: dept.name },
                { field: "email", before: null, after: dept.email },
                {
                    field: "category",
                    before: null,
                    after: dept.category ?? null,
                },
            ],
        },
    });

    return formatDepartment(dept);
}

async function resetDepartmentPassword(id, newPassword, actorId) {
    const existing = await repo.findDepartmentById(id);
    if (!existing) {
        throw new AppError(
            "DEPARTMENT_NOT_FOUND",
            "Department not found.",
            404,
        );
    }

    const passwordHash = await hashPassword(newPassword);

    await withTransaction(async (client) => {
        await client.query(
            `UPDATE departments SET password_hash = $2 WHERE id = $1`,
            [id, passwordHash],
        );
        if (existing.user_id) {
            await client.query(
                `UPDATE users SET password_hash = $2 WHERE id = $1`,
                [existing.user_id, passwordHash],
            );
        }
    });

    audit(null, {
        actorId,
        actorRole: "admin",
        action: "PASSWORD_RESET",
        entityType: "department",
        entityId: id,
        metadata: { entityName: existing.name, entityCode: existing.code },
    });

    return { success: true };
}

async function listAllDepartments() {
    const rows = await repo.findAllDepartments();
    return rows.map(formatDepartment);
}

async function listActiveDepartments() {
    const rows = await repo.findActiveDepartments();
    return rows.map(formatActiveDepartment);
}

async function getDepartmentsStats() {
    const stats = await repo.findActiveDepartmentsStats();
    if (!stats) {
        return {
            totalDepartments: 0,
            avgResponseDays: null,
            avgResolutionRatePct: null,
            totalOverdue: 0,
            publicVerificationPct: null,
        };
    }
    return {
        totalDepartments: stats.total_departments,
        avgResponseDays:
            stats.avg_response_days !== null
                ? Number(stats.avg_response_days)
                : null,
        avgResolutionRatePct:
            stats.avg_resolution_rate_pct !== null
                ? Number(stats.avg_resolution_rate_pct)
                : null,
        totalOverdue: stats.total_overdue,
        publicVerificationPct:
            stats.public_verification_pct !== null
                ? Number(stats.public_verification_pct)
                : null,
    };
}

async function getDepartmentRecentComplaints(id) {
    const dept = await repo.findDepartmentById(id);
    if (!dept) {
        throw new AppError(
            "DEPARTMENT_NOT_FOUND",
            "Department not found.",
            404,
        );
    }

    const rows = await repo.findRecentComplaintsByDepartment(id, 6);
    return rows.map((c) => ({
        id: c.id,
        publicCode: c.public_code,
        title: c.title,
        status: c.status,
        categoryName: c.category_name ?? null,
        createdAt: c.created_at,
        resolvedAt: c.resolved_at ?? null,
        slaDeadline: c.sla_deadline ?? null,
    }));
}

async function getDepartmentById(id) {
    const dept = await repo.findDepartmentById(id);
    if (!dept) {
        throw new AppError(
            "DEPARTMENT_NOT_FOUND",
            "Department not found.",
            404,
        );
    }
    return formatDepartment(dept);
}

async function toggleDepartmentActive(id, actorId) {
    const existing = await repo.findDepartmentById(id);
    if (!existing) {
        throw new AppError(
            "DEPARTMENT_NOT_FOUND",
            "Department not found.",
            404,
        );
    }

    const updated = await repo.toggleActiveById(id);
    const action = updated.is_active ? "REACTIVATE" : "DEACTIVATE";

    audit(null, {
        actorId,
        actorRole: "admin",
        action,
        entityType: "department",
        entityId: id,
        metadata: {
            entityName: existing.name,
            entityCode: existing.code,
            changes: [
                {
                    field: "isActive",
                    before: existing.is_active,
                    after: updated.is_active,
                },
            ],
        },
    });

    return formatDepartment(updated);
}

function formatDepartment(row) {
    return {
        id: row.id,
        code: row.code ?? null,
        name: row.name,
        slug: row.slug,
        email: row.email ?? null,
        category: row.category ?? null,
        description: row.description ?? null,
        isActive: row.is_active ?? true,
        userId: row.user_id ?? null,
        slaCount: row.sla_count ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at ?? undefined,
    };
}

function formatActiveDepartment(row) {
    return {
        id: row.id,
        code: row.code ?? null,
        name: row.name,
        slug: row.slug,
        category: row.category ?? null,
        description: row.description ?? null,
        slaCount: row.sla_count ?? 0,
        createdAt: row.created_at,
        resolutionRatePct:
            row.resolution_rate_pct !== null
                ? Number(row.resolution_rate_pct)
                : null,
        avgResolutionDays:
            row.avg_resolution_days !== null
                ? Number(row.avg_resolution_days)
                : null,
        overdueCount: row.overdue_count ?? 0,
        overdueRatePct:
            row.overdue_rate_pct !== null ? Number(row.overdue_rate_pct) : null,
        totalComplaints: row.total_complaints ?? 0,
        resolvedCount: row.resolved_count ?? 0,
        resolvedThisMonth: row.resolved_this_month ?? 0,
        verifiedPct:
            row.verified_pct !== null ? Number(row.verified_pct) : null,
    };
}

async function getCategories() {
    const categories = await repo.findDistinctCategories();
    return categories;
}

module.exports = {
    createDepartment,
    resetDepartmentPassword,
    listAllDepartments,
    listActiveDepartments,
    getDepartmentsStats,
    getDepartmentRecentComplaints,
    getDepartmentById,
    toggleDepartmentActive,
    getCategories,
};
