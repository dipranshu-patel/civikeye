"use strict";

const { Router } = require("express");
const controller = require("./departments.controller");
const { requireAuth, requireRole } = require("../../shared/middlewares/auth.middleware");

// ─── Admin routes — /api/admin/departments ────────────────────────────────────
const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.post("/", controller.createDepartment);
adminRouter.get("/", controller.listAdminDepartments);
adminRouter.patch("/:id", controller.toggleDepartment);
adminRouter.patch("/:id/password", controller.resetDepartmentPassword);

// ─── Citizen routes — /api/departments ───────────────────────────────────────
const citizenRouter = Router();

citizenRouter.get("/", controller.listCitizenDepartments);
citizenRouter.get("/:id", controller.getDepartment);

module.exports = { adminRouter, citizenRouter };
