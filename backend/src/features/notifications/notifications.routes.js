"use strict";

const { Router }   = require("express");
const controller   = require("./notifications.controller");
const { requireAuth } = require("../../shared/middlewares/auth.middleware");

const router = Router();

router.use(requireAuth);

// Unread count (bell badge)
router.get("/unread-count", controller.getUnreadCount);

// IMPORTANT: read-all must be registered BEFORE /:id/read
// otherwise Express matches "read-all" as an :id param
router.patch("/read-all", controller.markAllRead);

// Paginated feed
router.get("/", controller.listNotifications);

// Single mark-read
router.patch("/:id/read", controller.markOneRead);

module.exports = router;
