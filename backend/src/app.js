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
app.use("/api/admin/departments", deptAdminRoutes);
app.use("/api/admin/sla-categories", slaAdminRoutes);
app.use("/api/departments", deptCitizenRoutes);
app.use("/api/sla-categories", slaPublicRoutes);
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
