"use strict";

const { Router } = require("express");
const controller = require("./me.controller");
const { requireAuth, requireUserLocation } = require("../../shared/middlewares/auth.middleware");
const verificationsController = require("../verifications/verifications.controller");

const router = Router();
router.use(requireAuth);

// ─── Profile ──────────────────────────────────────────────────────────────────
router.get("/",              controller.getProfile);
router.patch("/profile",     controller.updateProfile);
router.patch("/location",    controller.updateLocation);

// ─── Preferences ──────────────────────────────────────────────────────────────
router.get("/preferences",   controller.getPreferences);
router.patch("/preferences", controller.updatePreferences);

// ─── Account actions ──────────────────────────────────────────────────────────
router.post("/change-password", controller.changePassword);
router.delete("/account",       controller.deleteAccount);

// ─── Verifications (existing) ─────────────────────────────────────────────────
router.get("/verifications", requireUserLocation, verificationsController.getMyVerifications);

module.exports = router;
