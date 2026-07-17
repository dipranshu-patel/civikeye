"use strict";

const { Router } = require("express");
const controller = require("./complaints.controller");
const {
    requireAuth,
    requireRole,
} = require("../../shared/middlewares/auth.middleware");
const {
    uploadPhotos,
    handleUploadError,
} = require("../../shared/middlewares/upload.middleware");
const {
    reportLimiter,
    upvoteLimiter,
    verifyLimiter,
} = require("../../shared/middlewares/rate-limit.middleware");

function optionalAuth(req, _res, next) {
    const header = req.headers["authorization"] ?? "";
    if (!header.startsWith("Bearer ")) return next();
    requireAuth(req, _res, (err) => {
        if (err) req.user = undefined;
        next();
    });
}

const publicRouter = Router();

publicRouter.get("/", controller.exploreComplaints);
publicRouter.get("/nearby", controller.getNearby);
publicRouter.get("/similar", controller.getSimilar);

publicRouter.get("/:id", optionalAuth, controller.getComplaintDetail);

const authRouter = Router();

authRouter.use(requireAuth, requireRole("citizen"));

const {
    requireUserLocation,
} = require("../../shared/middlewares/auth.middleware");
const verifyController = require("../verifications/verifications.controller");

authRouter.post(
    "/",
    reportLimiter,
    uploadPhotos,
    handleUploadError,
    controller.createComplaint,
);
authRouter.post("/:id/upvote", upvoteLimiter, controller.addUpvote);
authRouter.delete("/:id/upvote", upvoteLimiter, controller.removeUpvote);
authRouter.post(
    "/:id/verify",
    verifyLimiter,
    requireUserLocation,
    verifyController.castVote,
);

const meRouter = Router();

meRouter.use(requireAuth);

meRouter.get("/complaints", controller.getMyComplaints);
meRouter.get("/dashboard", controller.getDashboard);

module.exports = { publicRouter, authRouter, meRouter };
