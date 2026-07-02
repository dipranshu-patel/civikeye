"use strict";

const service = require("./sla.service");
const { validateCreateSlaCategory, validateUpdateSlaCategory } = require("./sla.validation");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

const createSlaCategory = asyncHandler(async (req, res) => {
    const errors = validateCreateSlaCategory(req.body);
    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    const { name, departmentId, slaDurationDays, description } = req.body;
    const category = await service.createSlaCategory({
        name, departmentId, slaDurationDays, description,
        actorId: req.user.userId,
    });
    return sendSuccess(res, { category }, 201);
});

const listAdminSlaCategories = asyncHandler(async (_req, res) => {
    const result = await service.listAllSlaCategories();
    return sendSuccess(res, result);
});

const updateSlaCategory = asyncHandler(async (req, res) => {
    const errors = validateUpdateSlaCategory(req.body);
    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    const category = await service.updateSlaCategory(req.params.id, req.body, req.user.userId);
    return sendSuccess(res, { category });
});

const listPublicSlaCategories = asyncHandler(async (_req, res) => {
    const categories = await service.listPublicSlaCategories();
    return sendSuccess(res, { categories });
});

module.exports = {
    createSlaCategory,
    listAdminSlaCategories,
    updateSlaCategory,
    listPublicSlaCategories,
};
