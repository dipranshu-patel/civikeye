"use strict";

function serializeReporterName(user, prefs) {
    if (!user?.full_name) return "Anonymous";
    if (prefs?.show_name_on_complaints === false) return "Anonymous";
    return user.full_name;
}

function serializeLeaderboardName(user, prefs) {
    if (!user?.full_name) return "Anonymous";
    if (prefs?.appear_on_leaderboard === false) return "Anonymous";
    return user.full_name;
}

function canShowContributionHistory(prefs) {
    return prefs?.show_contribution_history !== false;
}

module.exports = {
    serializeReporterName,
    serializeLeaderboardName,
    canShowContributionHistory,
};
