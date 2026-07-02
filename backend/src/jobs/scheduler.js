"use strict";

const cron = require("node-cron");
const { runVerificationWindowJob } = require("./verification-window.job");
const { runSlaNotificationsJob } = require("./sla-notifications.job");

function startScheduler() {
    cron.schedule("*/10 * * * *", async () => {
        try {
            await runVerificationWindowJob();
        } catch (err) {
            console.error("[cron:verif-window] Unhandled error:", err.message);
        }
    });

    cron.schedule("*/30 * * * *", async () => {
        try {
            await runSlaNotificationsJob();
        } catch (err) {
            console.error("[cron:sla] Unhandled error:", err.message);
        }
    });

    console.log("Cron scheduler started (verif-window: */10m, sla: */30m)");
}

module.exports = { startScheduler };
