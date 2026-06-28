"use strict";

const repo = require("./sla.repository");
const deptRepo = require("../departments/departments.repository");
const AppError = require("../../shared/utils/app-error");

// ─── write ─────────────────────────────────────────────────────────────────────

async function createSlaCategory({ name, departmentId, slaDurationDays, description }) {
    // Verify department exists
    const dept = await deptRepo.findDepartmentById(departmentId);
    if (!dept) {
        throw new AppError("DEPARTMENT_NOT_FOUND", "The specified department does not exist.", 404);
    }

    const row = await repo.insertSlaCategory({
        name: name.trim(),
        departmentId,
        slaDurationDays: Number(slaDurationDays),
        description,
    });

    return formatSlaCategory(row);
}

async function updateSlaCategory(id, fields) {
    const existing = await repo.findSlaCategoryById(id);
    if (!existing) {
        throw new AppError("SLA_CATEGORY_NOT_FOUND", "SLA category not found.", 404);
    }

    // If departmentId is changing, verify the new dept exists
    if (fields.departmentId) {
        const dept = await deptRepo.findDepartmentById(fields.departmentId);
        if (!dept) {
            throw new AppError("DEPARTMENT_NOT_FOUND", "The specified department does not exist.", 404);
        }
    }

    const updated = await repo.updateSlaCategory(id, fields);
    return formatSlaCategory(updated);
}

// ─── read ──────────────────────────────────────────────────────────────────────

async function listAllSlaCategories() {
    const [rows, summary] = await Promise.all([
        repo.findAllSlaCategories(),
        repo.getSlaSummary(),
    ]);

    return {
        summary: formatSummary(summary),
        categories: rows.map(formatSlaCategory),
    };
}

async function listPublicSlaCategories() {
    const rows = await repo.findSlaCategories();
    return rows.map(formatSlaCategory);
}

// ─── formatters ───────────────────────────────────────────────────────────────

function formatSlaCategory(row) {
    return {
        id: row.id,
        name: row.name,
        department: {
            id: row.department_id,
            name: row.department_name ?? undefined,
            slug: row.department_slug ?? undefined,
            code: row.department_code ?? undefined,
        },
        slaDurationDays: row.sla_duration_days,
        description: row.description ?? null,
        createdAt: row.created_at ?? undefined,
        updatedAt: row.updated_at ?? undefined,
    };
}

function formatSummary(row) {
    return {
        total: row.total,
        avgSlaDays: row.avg_sla_days ? parseFloat(row.avg_sla_days) : null,
        fastestDays: row.fastest_days,
        longestDays: row.longest_days,
    };
}

module.exports = {
    createSlaCategory,
    updateSlaCategory,
    listAllSlaCategories,
    listPublicSlaCategories,
};
