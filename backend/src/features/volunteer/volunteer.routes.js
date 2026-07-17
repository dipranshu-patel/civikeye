"use strict";

const { Router } = require("express");
const controller = require("./volunteer.controller");
const {
    requireAuth,
    requireRole,
} = require("../../shared/middlewares/auth.middleware");
const { uploadSingle } = require("../../shared/middlewares/upload.middleware");
const {
    claimLimiter,
} = require("../../shared/middlewares/rate-limit.middleware");

const router = Router();

router.get("/leaderboard", controller.getLeaderboard);
router.get("/discover", controller.discoverTasks);

router.use(requireAuth, requireRole("citizen"));

router.get("/my-tasks", controller.getMyTasks);
router.get("/impact", controller.getImpact);
router.post("/tasks/:id/claim", claimLimiter, controller.claimTask);
router.post(
    "/tasks/:id/complete",
    uploadSingle("proof"),
    controller.completeTask,
);

module.exports = router;
