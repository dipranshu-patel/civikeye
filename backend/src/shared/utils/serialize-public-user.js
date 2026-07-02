"use strict";

/**
 * serialize-public-user.js
 *
 * Centralizes how a user is displayed publicly.
 * All code that exposes a user's identity (complaints, leaderboard)
 * must go through these helpers — NOT raw `full_name`.
 *
 * @param {object} user  — DB row with at least `full_name`
 * @param {object} prefs — DB row from user_preferences (or null → use defaults)
 */

/**
 * Returns the name to display on complaints, reports, and public complaint cards.
 * If show_name_on_complaints is FALSE → "Anonymous"
 */
function serializeReporterName(user, prefs) {
    if (!user?.full_name) return "Anonymous";
    if (prefs?.show_name_on_complaints === false) return "Anonymous";
    return user.full_name;
}

/**
 * Returns the name to display on the leaderboard.
 * If appear_on_leaderboard is FALSE → "Anonymous"
 */
function serializeLeaderboardName(user, prefs) {
    if (!user?.full_name) return "Anonymous";
    if (prefs?.appear_on_leaderboard === false) return "Anonymous";
    return user.full_name;
}

/**
 * Returns whether contribution stats (count summary) should be shown publicly.
 * When show_contribution_history is FALSE → stats are hidden on public profile.
 */
function canShowContributionHistory(prefs) {
    return prefs?.show_contribution_history !== false;
}

module.exports = {
    serializeReporterName,
    serializeLeaderboardName,
    canShowContributionHistory,
};
