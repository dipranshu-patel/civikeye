"use strict";

const service = require("./me.service");
const { validateAddress } = require("./me.validation");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

const getProfile = asyncHandler(async (req, res) => {
    const profile = await service.getProfile(req.user.userId);
    return sendSuccess(res, { user: profile });
});

const updateLocation = asyncHandler(async (req, res) => {
    const errors = validateAddress(req.body);

    if (errors.length > 0) {
        return res.status(422).json({ success: false, errors });
    }

    const updated = await service.updateLocation(req.user.userId, req.body);
    return sendSuccess(res, { user: updated });
});

module.exports = { getProfile, updateLocation };
