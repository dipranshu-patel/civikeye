"use strict";

const { Router } = require("express");
const controller = require("./auth.controller");
//test require
const { requireAuth } = require("../../shared/middlewares/auth.middleware");
const {
    sendOtpLimiter,
    verifyOtpLimiter,
    loginLimiter,
    registerLimiter,
} = require("../../shared/middlewares/rate-limit.middleware");

const router = Router();

router.post("/send-otp", sendOtpLimiter, controller.sendOtp);
router.post("/verify-otp", verifyOtpLimiter, controller.verifyOtp);

router.post("/register", registerLimiter, controller.register);
router.post("/login", loginLimiter, controller.login);

router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);

//test route
router.get("/me", requireAuth, (req, res) => {
    res.json({ success: true, data: { user: req.user } });
});

module.exports = router;
