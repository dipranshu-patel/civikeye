"use strict";

const service = require("./departments.service");
const {
    validateCreateDepartment,
    validateResetDepartmentPassword,
} = require("./departments.validation");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

const createDepartment = asyncHandler(async (req, res) => {
    const errors = validateCreateDepartment(req.body);
    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    const { name, email, category, description, password } = req.body;
    const dept = await service.createDepartment({
        name,
        email,
        category,
        description,
        password,
        actorId: req.user.userId,
    });
    return sendSuccess(res, { department: dept }, 201);
});

const listAdminDepartments = asyncHandler(async (_req, res) => {
    const departments = await service.listAllDepartments();
    return sendSuccess(res, { departments });
});

const listCitizenDepartments = asyncHandler(async (_req, res) => {
    const departments = await service.listActiveDepartments();
    return sendSuccess(res, { departments });
});

const getCitizenDepartmentsStats = asyncHandler(async (_req, res) => {
    const stats = await service.getDepartmentsStats();
    return sendSuccess(res, { stats });
});

const getDepartment = asyncHandler(async (req, res) => {
    const dept = await service.getDepartmentById(req.params.id);
    return sendSuccess(res, { department: dept });
});

const getDepartmentRecentComplaints = asyncHandler(async (req, res) => {
    const complaints = await service.getDepartmentRecentComplaints(
        req.params.id,
    );
    return sendSuccess(res, { complaints });
});

const toggleDepartment = asyncHandler(async (req, res) => {
    const dept = await service.toggleDepartmentActive(
        req.params.id,
        req.user.userId,
    );
    return sendSuccess(res, { department: dept });
});

const resetDepartmentPassword = asyncHandler(async (req, res) => {
    const errors = validateResetDepartmentPassword(req.body);
    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    await service.resetDepartmentPassword(
        req.params.id,
        req.body.password,
        req.user.userId,
    );
    return sendSuccess(res, {
        message: "Department password has been reset successfully.",
    });
});

const getCitizenCategories = asyncHandler(async (_req, res) => {
    const categories = await service.getCategories();
    return sendSuccess(res, { categories });
});

module.exports = {
    createDepartment,
    listAdminDepartments,
    listCitizenDepartments,
    getCitizenDepartmentsStats,
    getCitizenCategories,
    getDepartment,
    getDepartmentRecentComplaints,
    toggleDepartment,
    resetDepartmentPassword,
};
