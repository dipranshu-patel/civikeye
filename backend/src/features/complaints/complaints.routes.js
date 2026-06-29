"use strict";

const { Router } = require("express");
const controller  = require("./complaints.controller");
const { requireAuth, requireRole } = require("../../shared/middlewares/auth.middleware");
const { uploadPhotos, handleUploadError } = require("../../shared/middlewares/upload.middleware");

// ─── Optional auth — sets req.user if token present, doesn't block if absent ─
function optionalAuth(req, _res, next) {
    const header = req.headers["authorization"] ?? "";
    if (!header.startsWith("Bearer ")) return next();
    // If a token exists, run requireAuth; errors silently fall through
    requireAuth(req, _res, (err) => {
        if (err) req.user = undefined;
        next();
    });
}

// ─── Public complaint routes (/api/complaints) ────────────────────────────────
const publicRouter = Router();

publicRouter.get("/",        controller.exploreComplaints);
publicRouter.get("/nearby",  controller.getNearby);
publicRouter.get("/similar", controller.getSimilar);

// Detail — optionally auth so userUpvoted is returned when logged in
publicRouter.get("/:id",     optionalAuth, controller.getComplaintDetail);

// ─── Authenticated complaint routes ──────────────────────────────────────────
const authRouter = Router();

authRouter.use(requireAuth, requireRole("citizen"));

authRouter.post("/",              uploadPhotos, handleUploadError, controller.createComplaint);
authRouter.post("/:id/upvote",    controller.addUpvote);
authRouter.delete("/:id/upvote",  controller.removeUpvote);

// ─── /api/me routes (citizen dashboard + my complaints) ──────────────────────
const meRouter = Router();

meRouter.use(requireAuth);

meRouter.get("/complaints", controller.getMyComplaints);
meRouter.get("/dashboard",  controller.getDashboard);

module.exports = { publicRouter, authRouter, meRouter };
