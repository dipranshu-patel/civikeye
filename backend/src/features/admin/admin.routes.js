"use strict";

const { Router } = require("express");
const controller = require("./admin.controller");
const {
    requireAuth,
    requireRole,
} = require("../../shared/middlewares/auth.middleware");

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", controller.getDashboard);
router.get("/audit-logs", controller.getAuditLogs);
router.get("/audit-logs/:id", controller.getAuditLogDetail);

module.exports = router;
