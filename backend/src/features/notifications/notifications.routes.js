"use strict";

const { Router } = require("express");
const controller = require("./notifications.controller");
const { requireAuth } = require("../../shared/middlewares/auth.middleware");

const router = Router();

router.use(requireAuth);

router.get("/unread-count", controller.getUnreadCount);

router.patch("/read-all", controller.markAllRead);

router.get("/", controller.listNotifications);

router.patch("/:id/read", controller.markOneRead);

module.exports = router;
