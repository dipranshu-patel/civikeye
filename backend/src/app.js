"use strict";

const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./features/auth/auth.routes");
const meRoutes = require("./features/me/me.routes");
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
