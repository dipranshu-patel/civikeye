"use strict";

const { Router } = require("express");
const controller = require("./me.controller");
const { requireAuth } = require("../../shared/middlewares/auth.middleware");

const router = Router();

router.use(requireAuth);

router.get("/", controller.getProfile);

router.patch("/location", controller.updateLocation);

module.exports = router;
