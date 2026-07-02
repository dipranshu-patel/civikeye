"use strict";

const { Router } = require("express");
const controller = require("./departments.controller");
const { requireAuth, requireRole } = require("../../shared/middlewares/auth.middleware");

const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.post("/", controller.createDepartment);
adminRouter.get("/", controller.listAdminDepartments);
adminRouter.patch("/:id", controller.toggleDepartment);
adminRouter.patch("/:id/password", controller.resetDepartmentPassword);

const citizenRouter = Router();

citizenRouter.get("/", controller.listCitizenDepartments);
citizenRouter.get("/:id", controller.getDepartment);

module.exports = { adminRouter, citizenRouter };
