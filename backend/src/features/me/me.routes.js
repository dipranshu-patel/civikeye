"use strict";

const { Router } = require("express");
const controller = require("./me.controller");
const { requireAuth, requireUserLocation } = require("../../shared/middlewares/auth.middleware");
const verificationsController = require("../verifications/verifications.controller");

const router = Router();
router.use(requireAuth);

router.get("/",              controller.getProfile);
router.patch("/profile",     controller.updateProfile);
router.patch("/location",    controller.updateLocation);

router.get("/preferences",   controller.getPreferences);
router.patch("/preferences", controller.updatePreferences);

router.post("/change-password", controller.changePassword);
router.delete("/account",       controller.deleteAccount);

router.get("/verifications", requireUserLocation, verificationsController.getMyVerifications);

module.exports = router;
