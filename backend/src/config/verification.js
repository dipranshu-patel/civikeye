"use strict";

const verification = {
    windowDays: parseInt(process.env.VERIFICATION_WINDOW_DAYS ?? "2", 10),

    minVotes: parseInt(process.env.VERIFICATION_MIN_VOTES ?? "3", 10),

    confirmThreshold: parseFloat(
        process.env.VERIFICATION_CONFIRM_THRESHOLD ?? "0.6",
    ),

    radiusMeters: parseInt(process.env.VERIFICATION_RADIUS_METERS ?? "2000", 10),
};

module.exports = verification;
