"use strict";

const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./features/auth/auth.routes");
const meRoutes = require("./features/me/me.routes");
const {
    adminRouter: deptAdminRoutes,
    citizenRouter: deptCitizenRoutes,
} = require("./features/departments/departments.routes");
const {
    adminRouter: slaAdminRoutes,
    publicRouter: slaPublicRoutes,
} = require("./features/sla/sla.routes");
const {
    publicRouter: complaintsPublicRoutes,
    authRouter: complaintsAuthRoutes,
    meRouter: complaintsMeRoutes,
} = require("./features/complaints/complaints.routes");
const deptRoutes = require("./features/dept/dept.routes");
const volunteerRoutes = require("./features/volunteer/volunteer.routes");
const notificationRoutes = require("./features/notifications/notifications.routes");
const adminRoutes = require("./features/admin/admin.routes");
const usersRoutes = require("./features/users/users.routes");
const errorMiddleware = require("./shared/middlewares/error.middleware");
const {
    globalLimiter,
} = require("./shared/middlewares/global-rate-limit.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", globalLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/me", complaintsMeRoutes);
app.use("/api/admin/departments", deptAdminRoutes);
app.use("/api/admin/sla-categories", slaAdminRoutes);
app.use("/api/departments", deptCitizenRoutes);
app.use("/api/sla-categories", slaPublicRoutes);
app.use("/api/complaints", complaintsPublicRoutes);
app.use("/api/complaints", complaintsAuthRoutes);
app.use("/api/dept", deptRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", usersRoutes);
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: "NOT_FOUND",
            message: "The requested endpoint does not exist.",
        },
    });
});

app.use(errorMiddleware);

module.exports = app;
