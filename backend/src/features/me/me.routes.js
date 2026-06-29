"use strict";

const { Router } = require("express");
const controller = require("./me.controller");
const { requireAuth, requireUserLocation } = require("../../shared/middlewares/auth.middleware");
const verificationsController = require("../verifications/verifications.controller");

const router = Router();

router.use(requireAuth);

router.get("/", controller.getProfile);

router.patch("/location", controller.updateLocation);

// Verification requests (needs user lat/lon from DB)
router.get("/verifications", requireUserLocation, verificationsController.getMyVerifications);

module.exports = router;
