"use strict";

const service = require("./volunteer.service");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

const discoverTasks = asyncHandler(async (req, res) => {
    const { search, page, limit } = req.query;
    const data = await service.discoverTasks({ search, page, limit });
    return sendSuccess(res, data);
});

const claimTask = asyncHandler(async (req, res) => {
    const data = await service.claimTask({
        taskId: req.params.id,
        volunteerId: req.user.userId,
    });
    return sendSuccess(res, data, 201);
});

const completeTask = asyncHandler(async (req, res) => {
    const { note } = req.body;
    const proofFile = req.file ?? null;

    if (!proofFile) {
        const AppError = require("../../shared/utils/app-error");
        throw new AppError(
            "PROOF_REQUIRED",
            "A proof photo is required to complete a task.",
            422,
        );
    }

    const data = await service.submitTaskCompletion({
        taskId: req.params.id,
        volunteerId: req.user.userId,
        note,
        proofFile,
    });
    return sendSuccess(res, data);
});

const getMyTasks = asyncHandler(async (req, res) => {
    const { tab = "active" } = req.query;
    const data = await service.getMyTasks({
        volunteerId: req.user.userId,
        tab,
    });
    return sendSuccess(res, data);
});

const getImpact = asyncHandler(async (req, res) => {
    const data = await service.getImpact(req.user.userId);
    return sendSuccess(res, data);
});

const getLeaderboard = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const data = await service.getLeaderboard({ page, limit });
    return sendSuccess(res, data);
});

module.exports = {
    discoverTasks,
    claimTask,
    completeTask,
    getMyTasks,
    getImpact,
    getLeaderboard,
};
