"use strict";

const service = require("./me.service");
const { validateAddress } = require("./me.validation");
const asyncHandler  = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

// GET /api/me
const getProfile = asyncHandler(async (req, res) => {
    const profile = await service.getProfile(req.user.userId);
    return sendSuccess(res, { user: profile });
});

// PATCH /api/me/profile
const updateProfile = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
    const result = await service.updateProfile(req.user.userId, { fullName, email });
    return sendSuccess(res, { user: result });
});

// PATCH /api/me/location
const updateLocation = asyncHandler(async (req, res) => {
    const errors = validateAddress(req.body);
    if (errors.length > 0) return res.status(422).json({ success: false, errors });

    const updated = await service.updateLocation(req.user.userId, req.body);
    return sendSuccess(res, { user: updated });
});

// GET /api/me/preferences
const getPreferences = asyncHandler(async (req, res) => {
    const result = await service.getPreferences(req.user.userId);
    return sendSuccess(res, result);
});

// PATCH /api/me/preferences
const updatePreferences = asyncHandler(async (req, res) => {
    const result = await service.updatePreferences(req.user.userId, req.body);
    return sendSuccess(res, result);
});

// POST /api/me/change-password
const changePassword = asyncHandler(async (req, res) => {
    const result = await service.changePassword(req.user.userId, req.body);
    return sendSuccess(res, result);
});

// DELETE /api/me/account
const deleteAccount = asyncHandler(async (req, res) => {
    const result = await service.deleteAccount(req.user.userId, req.body);
    return sendSuccess(res, result);
});


module.exports = {
    getProfile,
    updateProfile,
    updateLocation,
    getPreferences,
    updatePreferences,
    changePassword,
    deleteAccount,
};
