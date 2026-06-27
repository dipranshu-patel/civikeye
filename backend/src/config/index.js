"use strict";

const dotenv = require("dotenv");
dotenv.config();

function validateEnv(required) {
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.error(
            "\n[CONFIG] Missing required environment variables:\n" +
                missing.map((k) => `     • ${k}`).join("\n") +
                "\n\n   Add them to your .env file and restart the server.\n",
        );
        process.exit(1);
    }
}

validateEnv([
    "DATABASE_URL",

    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",

    "RESEND_API_KEY",
    "EMAIL_FROM",

    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",

    "FRONTEND_URL",
]);

const config = {
    env: process.env.NODE_ENV ?? "development",
    port: parseInt(process.env.PORT ?? "5000", 10),

    db: {
        url: process.env.DATABASE_URL,
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiry: process.env.JWT_ACCESS_EXPIRY ?? "15m",
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY ?? "30d",
    },

    email: {
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.EMAIL_FROM,
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },

    auth: {
        passwordResetExpiry: process.env.PASSWORD_RESET_TOKEN_EXPIRY ?? "15m",
    },

    frontend: {
        url: (process.env.FRONTEND_URL ?? "https://civikeye.online").replace(
            /\/$/,
            "",
        ),
    },

    skipEmail: process.env.SKIP_EMAIL === "true",
};

module.exports = config;
