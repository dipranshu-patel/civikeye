"use strict";

const verification = {
    windowDays: parseInt(process.env.VERIFICATION_WINDOW_DAYS ?? "2", 10),

    // Votes needed to trigger resolution — lower for volunteer fixes, higher for dept fixes
    minVotesCommunity: parseInt(process.env.VERIFICATION_MIN_VOTES_COMMUNITY ?? "3", 10),
    minVotesAuthority: parseInt(process.env.VERIFICATION_MIN_VOTES_AUTHORITY ?? "5", 10),

    confirmThreshold: parseFloat(
        process.env.VERIFICATION_CONFIRM_THRESHOLD ?? "0.6",
    ),

    radiusKm: parseFloat(process.env.VERIFICATION_RADIUS_KM ?? "2"),
};

module.exports = verification;
