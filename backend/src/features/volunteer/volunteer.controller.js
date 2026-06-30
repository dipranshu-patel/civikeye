"use strict";

const service      = require("./volunteer.service");
const asyncHandler = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/respond");

// GET /api/volunteer/discover?search=&page=&limit=
const discoverTasks = asyncHandler(async (req, res) => {
    const { search, page, limit } = req.query;
    const data = await service.discoverTasks({ search, page, limit });
    return sendSuccess(res, data);
});

// POST /api/volunteer/tasks/:id/claim
const claimTask = asyncHandler(async (req, res) => {
    const data = await service.claimTask({
        taskId:      req.params.id,
        volunteerId: req.user.userId,
    });
    return sendSuccess(res, data, 201);
});

// POST /api/volunteer/tasks/:id/complete
// body: { note?: string }  +  REQUIRED file field "proof" (multipart)
const completeTask = asyncHandler(async (req, res) => {
    const { note } = req.body;
    const proofFile = req.file ?? null;   // single file via upload.single("proof")

    // Proof photo is mandatory — reject early if not provided
    if (!proofFile) {
        const AppError = require("../../shared/utils/app-error");
        throw new AppError("PROOF_REQUIRED", "A proof photo is required to complete a task.", 422);
    }

    const data = await service.submitTaskCompletion({
        taskId:      req.params.id,
        volunteerId: req.user.userId,
        note,
        proofFile,
    });
    return sendSuccess(res, data);
});

// GET /api/volunteer/my-tasks?tab=active|pending_verification|completed
const getMyTasks = asyncHandler(async (req, res) => {
    const { tab = "active" } = req.query;
    const data = await service.getMyTasks({ volunteerId: req.user.userId, tab });
    return sendSuccess(res, data);
});

// GET /api/volunteer/impact
const getImpact = asyncHandler(async (req, res) => {
    const data = await service.getImpact(req.user.userId);
    return sendSuccess(res, data);
});

// GET /api/volunteer/leaderboard?page=&limit=  (public)
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
