"use strict";

const service = require("./verifications.service");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

const getMyVerifications = asyncHandler(async (req, res) => {
    const { tab = "pending", filter, search } = req.query;

    const user = {
        userId: req.user.userId,
        latitude: req.user.latitude ?? null,
        longitude: req.user.longitude ?? null,
    };

    const data = await service.getMyVerifications({
        user,
        tab,
        filter,
        search,
    });
    return sendSuccess(res, data);
});

const castVote = asyncHandler(async (req, res) => {
    const { vote, comment } = req.body;

    const user = {
        userId: req.user.userId,
        latitude: req.user.latitude ?? null,
        longitude: req.user.longitude ?? null,
    };

    const result = await service.castVote({
        complaintId: req.params.id,
        user,
        vote,
        comment,
    });

    return sendSuccess(res, result, 201);
});

module.exports = { getMyVerifications, castVote };
