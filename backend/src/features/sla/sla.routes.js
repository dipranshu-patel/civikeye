"use strict";

const { Router } = require("express");
const controller = require("./sla.controller");
const { requireAuth, requireRole } = require("../../shared/middlewares/auth.middleware");

// ─── Admin routes — /api/admin/sla-categories ─────────────────────────────────
const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.post("/", controller.createSlaCategory);
adminRouter.get("/", controller.listAdminSlaCategories);
adminRouter.patch("/:id", controller.updateSlaCategory);

// ─── Public routes — /api/sla-categories ──────────────────────────────────────
const publicRouter = Router();

publicRouter.get("/", controller.listPublicSlaCategories);

module.exports = { adminRouter, publicRouter };
