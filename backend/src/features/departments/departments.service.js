"use strict";

const repo = require("./departments.repository");
const { hashPassword } = require("../../shared/utils/hash");
const AppError = require("../../shared/utils/app-error");

async function createDepartment({ name, email, category, description, password }) {
    const trimmedName = name.trim();

    // Prevent slug collisions
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

    const dept = await repo.insertDepartment({
        name: trimmedName,
        email: email?.trim() || null,
        category: category?.trim() || null,
        description,
        passwordHash,
    });

    return formatDepartment(dept);
}

async function resetDepartmentPassword(id, newPassword) {
    const existing = await repo.findDepartmentById(id);
    if (!existing) {
        throw new AppError("DEPARTMENT_NOT_FOUND", "Department not found.", 404);
    }

    const passwordHash = await hashPassword(newPassword);
    await repo.updateDepartmentPassword(id, passwordHash);

    return { success: true };
}

async function listAllDepartments() {
    const rows = await repo.findAllDepartments();
    return rows.map(formatDepartment);
}

async function listActiveDepartments() {
    const rows = await repo.findActiveDepartments();
    return rows.map(formatDepartment);
}

async function getDepartmentById(id) {
    const dept = await repo.findDepartmentById(id);
    if (!dept) {
        throw new AppError("DEPARTMENT_NOT_FOUND", "Department not found.", 404);
    }
    return formatDepartment(dept);
}

async function toggleDepartmentActive(id) {
    const existing = await repo.findDepartmentById(id);
    if (!existing) {
        throw new AppError("DEPARTMENT_NOT_FOUND", "Department not found.", 404);
    }

    const updated = await repo.toggleActiveById(id);
    return formatDepartment(updated);
}

// ─── formatter ────────────────────────────────────────────────────────────────
// password_hash is NEVER included here — it is stripped in the repository layer

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
        slaCount: row.sla_count ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at ?? undefined,
    };
}

module.exports = {
    createDepartment,
    resetDepartmentPassword,
    listAllDepartments,
    listActiveDepartments,
    getDepartmentById,
    toggleDepartmentActive,
};
