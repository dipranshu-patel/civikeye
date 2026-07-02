"use strict";

const pool = require("../config/db");
const { notify } = require("../shared/utils/notify");
const cronRepo = require("./cron.repository");

async function runSlaNotificationsJob() {
    const [breedSoon, overdue] = await Promise.all([
        cronRepo.findSlaBreachSoon(),
        cronRepo.findSlaOverdue(),
    ]);

    const total = breedSoon.length + overdue.length;
    if (!total) return;

    console.log(
        `[cron:sla] ${breedSoon.length} breach-soon, ${overdue.length} overdue`,
    );

    for (const c of breedSoon) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await notify(client, {
                userId: c.dept_official_id,
                type: "SLA_BREACH_SOON",
                title: "SLA deadline approaching",
                body: `Complaint "${c.title}" (${c.public_code}) is due within 24 hours. Please take action.`,
                data: {
                    publicCode: c.public_code,
                    complaintId: c.id,
                    slaDeadline: c.sla_deadline,
                },
                entityType: "complaint",
                entityId: c.id,
            });
            await client.query("COMMIT");
            console.log(`[cron:sla]   SLA_BREACH_SOON → ${c.public_code}`);
        } catch (err) {
            await client.query("ROLLBACK");
            console.error(
                `[cron:sla]   ✗ SLA_BREACH_SOON ${c.public_code}: ${err.message}`,
            );
        } finally {
            client.release();
        }
    }

    for (const c of overdue) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await notify(client, {
                userId: c.dept_official_id,
                type: "SLA_OVERDUE",
                title: "SLA deadline breached",
                body: `Complaint "${c.title}" (${c.public_code}) has exceeded its SLA deadline. Immediate attention required.`,
                data: {
                    publicCode: c.public_code,
                    complaintId: c.id,
                    slaDeadline: c.sla_deadline,
                },
                entityType: "complaint",
                entityId: c.id,
            });
            await client.query("COMMIT");
            console.log(`[cron:sla]   SLA_OVERDUE → ${c.public_code}`);
        } catch (err) {
            await client.query("ROLLBACK");
            console.error(
                `[cron:sla]   ✗ SLA_OVERDUE ${c.public_code}: ${err.message}`,
            );
        } finally {
            client.release();
        }
    }
}

module.exports = { runSlaNotificationsJob };
