"use strict";

const { Router } = require("express");
const controller = require("./sla.controller");
const { requireAuth, requireRole } = require("../../shared/middlewares/auth.middleware");

const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.post("/", controller.createSlaCategory);
adminRouter.get("/", controller.listAdminSlaCategories);
adminRouter.patch("/:id", controller.updateSlaCategory);

const publicRouter = Router();

publicRouter.get("/", controller.listPublicSlaCategories);

module.exports = { adminRouter, publicRouter };
