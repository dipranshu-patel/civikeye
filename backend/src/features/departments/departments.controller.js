"use strict";

const service = require("./departments.service");
const {
    validateCreateDepartment,
    validateResetDepartmentPassword,
} = require("./departments.validation");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

// POST /api/admin/departments
const createDepartment = asyncHandler(async (req, res) => {
    const errors = validateCreateDepartment(req.body);
    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    const { name, email, category, description, password } = req.body;
    const dept = await service.createDepartment({
        name, email, category, description, password,
        actorId: req.user.userId,
    });
    return sendSuccess(res, { department: dept }, 201);
});

// GET /api/admin/departments
const listAdminDepartments = asyncHandler(async (_req, res) => {
    const departments = await service.listAllDepartments();
    return sendSuccess(res, { departments });
});

// GET /api/departments
const listCitizenDepartments = asyncHandler(async (_req, res) => {
    const departments = await service.listActiveDepartments();
    return sendSuccess(res, { departments });
});

// GET /api/departments/:id
const getDepartment = asyncHandler(async (req, res) => {
    const dept = await service.getDepartmentById(req.params.id);
    return sendSuccess(res, { department: dept });
});

// PATCH /api/admin/departments/:id — toggle is_active
const toggleDepartment = asyncHandler(async (req, res) => {
    const dept = await service.toggleDepartmentActive(req.params.id, req.user.userId);
    return sendSuccess(res, { department: dept });
});

// PATCH /api/admin/departments/:id/password — reset department password
const resetDepartmentPassword = asyncHandler(async (req, res) => {
    const errors = validateResetDepartmentPassword(req.body);
    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    await service.resetDepartmentPassword(req.params.id, req.body.password, req.user.userId);
    return sendSuccess(res, { message: "Department password has been reset successfully." });
});

module.exports = {
    createDepartment,
    listAdminDepartments,
    listCitizenDepartments,
    getDepartment,
    toggleDepartment,
    resetDepartmentPassword,
};
