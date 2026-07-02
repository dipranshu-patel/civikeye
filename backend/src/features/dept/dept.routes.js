"use strict";

const { Router } = require("express");
const controller   = require("./dept.controller");
const { requireAuth, requireRole } = require("../../shared/middlewares/auth.middleware");
const { uploadPhotos, handleUploadError } = require("../../shared/middlewares/upload.middleware");

const router = Router();

router.use(requireAuth, requireRole("official"));

router.use((req, _res, next) => {
    if (!req.user.departmentId) {
        const AppError = require("../../shared/utils/app-error");
        return next(new AppError("NO_DEPARTMENT", "Your account is not linked to any department.", 403));
    }
    next();
});

router.get("/dashboard",                controller.getDashboard);
router.get("/complaints",               controller.getComplaints);
router.get("/complaints/:id",           controller.getComplaintDetail);
router.patch(
    "/complaints/:id/status",
    uploadPhotos, handleUploadError,  
    controller.updateComplaintStatus,
);

module.exports = router;
