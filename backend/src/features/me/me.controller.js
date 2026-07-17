"use strict";

const service = require("./me.service");
const {
    validateAddress,
    validateProfileUpdate,
    validateChangePassword,
} = require("./me.validation");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

const getProfile = asyncHandler(async (req, res) => {
    const profile = await service.getProfile(req.user.userId);
    return sendSuccess(res, { user: profile });
});

const updateProfile = asyncHandler(async (req, res) => {
    const errors = validateProfileUpdate(req.body);
    if (errors.length > 0)
        return res.status(422).json({ success: false, errors });

    const { fullName, email } = req.body;
    const result = await service.updateProfile(req.user.userId, {
        fullName,
        email,
    });
    return sendSuccess(res, { user: result });
});

const updateLocation = asyncHandler(async (req, res) => {
    const errors = validateAddress(req.body);
    if (errors.length > 0)
        return res.status(422).json({ success: false, errors });

    const updated = await service.updateLocation(req.user.userId, req.body);
    return sendSuccess(res, { user: updated });
});

const getPreferences = asyncHandler(async (req, res) => {
    const result = await service.getPreferences(req.user.userId);
    return sendSuccess(res, result);
});

const updatePreferences = asyncHandler(async (req, res) => {
    const result = await service.updatePreferences(req.user.userId, req.body);
    return sendSuccess(res, result);
});

const changePassword = asyncHandler(async (req, res) => {
    const errors = validateChangePassword(req.body);
    if (errors.length > 0)
        return res.status(422).json({ success: false, errors });

    const result = await service.changePassword(req.user.userId, req.body);
    return sendSuccess(res, result);
});

const deleteAccount = asyncHandler(async (req, res) => {
    const result = await service.deleteAccount(req.user.userId, req.body);
    return sendSuccess(res, result);
});

const requestEmailChange = asyncHandler(async (req, res) => {
    const { newEmail } = req.body;
    if (!newEmail || typeof newEmail !== "string") {
        return res
            .status(422)
            .json({
                success: false,
                errors: [
                    {
                        field: "newEmail",
                        message: "A valid new email address is required.",
                    },
                ],
            });
    }
    const result = await service.requestEmailChange(req.user.userId, {
        newEmail,
    });
    return sendSuccess(res, result);
});

const confirmEmailChange = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    if (!otp) {
        return res
            .status(422)
            .json({
                success: false,
                errors: [{ field: "otp", message: "OTP is required." }],
            });
    }
    const result = await service.confirmEmailChange(req.user.userId, { otp });
    return sendSuccess(res, { user: result });
});

module.exports = {
    getProfile,
    updateProfile,
    requestEmailChange,
    confirmEmailChange,
    updateLocation,
    getPreferences,
    updatePreferences,
    changePassword,
    deleteAccount,
};
