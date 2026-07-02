"use strict";

const { Router }     = require("express");
const asyncHandler   = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");
const service        = require("../me/me.service");

const router = Router();

router.get("/:id/profile", asyncHandler(async (req, res) => {
    const data = await service.getPublicProfile(req.params.id);
    return sendSuccess(res, { profile: data });
}));

module.exports = router;
