"use strict";

const { Router } = require("express");
const controller = require("./auth.controller");
const {
    sendOtpLimiter,
    verifyOtpLimiter,
    loginLimiter,
    registerLimiter,
    forgotPasswordLimiter,
    resetPasswordLimiter,
} = require("../../shared/middlewares/rate-limit.middleware");

const router = Router();

router.post("/send-otp", sendOtpLimiter, controller.sendOtp);
router.post("/verify-otp", verifyOtpLimiter, controller.verifyOtp);

router.post("/register", registerLimiter, controller.register);
router.post("/login", loginLimiter, controller.login);

router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);

router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    controller.forgotPassword,
);
router.post("/reset-password", resetPasswordLimiter, controller.resetPassword);

module.exports = router;
