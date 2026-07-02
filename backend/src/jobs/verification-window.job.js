"use strict";

const { withTransaction } = require("../shared/db/query");
const { notify, notifyNearbyCitizens } = require("../shared/utils/notify");
const cronRepo = require("./cron.repository");
const volRepo = require("../features/volunteer/volunteer.repository");

const { MIN_VOTES_COMMUNITY, MIN_VOTES_AUTHORITY, CONFIRM_THRESHOLD } =
    cronRepo;

async function runVerificationWindowJob() {
    const expired = await cronRepo.findExpiredVerificationWindows();

    if (!expired.length) return;

    console.log(
        `[cron:verif-window] Processing ${expired.length} expired window(s)...`,
    );

    for (const complaint of expired) {
        const {
            id: complaintId,
            total_votes: total,
            confirms,
            issue_type,
            title,
            reporter_id,
            public_code,
            latitude,
            longitude,
        } = complaint;

        const MIN_VOTES =
            issue_type === "community_fixable"
                ? MIN_VOTES_COMMUNITY
                : MIN_VOTES_AUTHORITY;

        const ratio = total > 0 ? confirms / total : 0;

        let newStatus;
        let note;

        if (total >= MIN_VOTES) {
            if (ratio >= CONFIRM_THRESHOLD) {
                newStatus = "resolved";
                note = `Window closed: ${confirms}/${total} confirmed (${Math.round(ratio * 100)}%). Auto-resolved.`;
            } else {
                newStatus = "reopened";
                note = `Window closed: ${confirms}/${total} confirmed (${Math.round(ratio * 100)}%). Auto-reopened.`;
            }
        } else {
            newStatus = "in_progress";
            note = `Window closed with only ${total} vote(s) (need ${MIN_VOTES}). Escalated to department.`;
        }

        try {
            await withTransaction(async (client) => {
                const updated = await cronRepo.transitionComplaint(
                    client,
                    complaintId,
                    newStatus,
                    note,
                );
                if (!updated) return;

                if (newStatus === "resolved") {
                    await volRepo.finalizeTaskOnResolution(client, complaintId);

                    await volRepo.awardPoints(client, {
                        userId: reporter_id,
                        complaintId,
                        taskId: null,
                        points: volRepo.POINTS.report,
                        type: "report",
                    });

                    await notify(client, {
                        userId: reporter_id,
                        type: "COMPLAINT_RESOLVED",
                        title: "Your complaint has been resolved!",
                        body: `Your complaint "${title}" was resolved by the community (verification window closed).`,
                        data: { publicCode: public_code, complaintId },
                        entityType: "complaint",
                        entityId: complaintId,
                    });
                } else if (newStatus === "reopened") {
                    const volunteerId = await cronRepo.resetVolunteerAssignment(
                        client,
                        complaintId,
                    );

                    await notify(client, {
                        userId: reporter_id,
                        type: "COMPLAINT_REOPENED",
                        title: "Your complaint has been reopened",
                        body: `The verification window closed without a clear majority for "${title}". It has been reopened.`,
                        data: { publicCode: public_code, complaintId },
                        entityType: "complaint",
                        entityId: complaintId,
                    });

                    if (volunteerId) {
                        await notify(client, {
                            userId: volunteerId,
                            type: "FIX_REJECTED",
                            title: "Verification window expired",
                            body: "The community didn't reach consensus on your fix. The complaint has been reopened.",
                            data: { complaintId },
                            entityType: "complaint",
                            entityId: complaintId,
                        });
                    }

                    if (issue_type === "community_fixable") {
                        await notifyNearbyCitizens(client, {
                            excludeUserId: reporter_id,
                            lat: parseFloat(latitude),
                            lon: parseFloat(longitude),
                            type: "NEW_TASK_NEARBY",
                            title: "Volunteer task reopened near you",
                            body: `A community task near you was reopened: "${title}".`,
                            data: { publicCode: public_code, complaintId },
                            entityType: "complaint",
                            entityId: complaintId,
                        });
                    }
                } else {
                    await notify(client, {
                        userId: reporter_id,
                        type: "COMPLAINT_ESCALATED",
                        title: "Your complaint has been escalated",
                        body: `Not enough community votes were cast on "${title}". It's been referred back to the department.`,
                        data: { publicCode: public_code, complaintId },
                        entityType: "complaint",
                        entityId: complaintId,
                    });
                }
            });

            console.log(`[cron:verif-window]   → ${public_code}: ${newStatus}`);
        } catch (err) {
            console.error(
                `[cron:verif-window]   ✗ ${public_code}: ${err.message}`,
            );
        }
    }
}

module.exports = { runVerificationWindowJob };
