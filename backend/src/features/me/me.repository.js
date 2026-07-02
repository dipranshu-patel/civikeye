"use strict";

const { query, withTransaction } = require("../../shared/db/query");

// ─── Find user ────────────────────────────────────────────────────────────────

async function findUserById(userId) {
    const { rows } = await query(
        `SELECT id, full_name, email, role, latitude, longitude,
                is_deleted, deleted_at, password_changed_at, created_at
         FROM users
         WHERE id = $1 AND is_deleted = FALSE
         LIMIT 1`,
        [userId],
    );
    return rows[0] ?? null;
}

// ─── Update profile (name + email) ───────────────────────────────────────────

async function updateProfile(userId, { fullName, email }) {
    const fields = [];
    const values = [userId];
    let   idx    = 2;

    if (fullName !== undefined) { fields.push(`full_name = $${idx++}`); values.push(fullName.trim()); }
    if (email    !== undefined) { fields.push(`email = $${idx++}`);     values.push(email.trim().toLowerCase()); }

    if (!fields.length) return findUserById(userId);

    const { rows } = await query(
        `UPDATE users SET ${fields.join(", ")} WHERE id = $1 AND is_deleted = FALSE
         RETURNING id, full_name, email, role, created_at`,
        values,
    );
    return rows[0] ?? null;
}

// ─── Update location ──────────────────────────────────────────────────────────

async function updateUserLocation(userId, { latitude, longitude }, client = null) {
    const q = client
        ? (sql, params) => client.query(sql, params)
        : (sql, params) => query(sql, params);

    const { rows } = await q(
        `UPDATE users SET latitude = $2, longitude = $3
         WHERE id = $1 AND is_deleted = FALSE
         RETURNING id, full_name, email, role, latitude, longitude, created_at`,
        [userId, latitude, longitude],
    );
    return rows[0] ?? null;
}

// ─── Preferences (upsert on first access) ─────────────────────────────────────

async function findOrCreatePreferences(userId) {
    const { rows } = await query(
        `INSERT INTO user_preferences (user_id)
         VALUES ($1)
         ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id
         RETURNING *`,
        [userId],
    );
    return rows[0];
}

async function updatePreferences(userId, fields) {
    // Accept both camelCase (from request body) and snake_case (internal calls)
    const KEY_MAP = {
        showNameOnComplaints:    "show_name_on_complaints",
        appearOnLeaderboard:     "appear_on_leaderboard",
        showContributionHistory: "show_contribution_history",
        // snake_case passthrough (for internal service callers)
        show_name_on_complaints:   "show_name_on_complaints",
        appear_on_leaderboard:     "appear_on_leaderboard",
        show_contribution_history: "show_contribution_history",
    };

    const setClauses = [];
    const values     = [userId];
    let   idx        = 2;

    for (const [inputKey, dbCol] of Object.entries(KEY_MAP)) {
        if (fields[inputKey] !== undefined) {
            // Avoid adding the same column twice when both forms present
            if (!setClauses.some(c => c.startsWith(dbCol))) {
                setClauses.push(`${dbCol} = $${idx++}`);
                values.push(Boolean(fields[inputKey]));
            }
        }
    }

    if (!setClauses.length) return findOrCreatePreferences(userId);

    setClauses.push(`updated_at = NOW()`);

    const { rows } = await query(
        `UPDATE user_preferences
         SET ${setClauses.join(", ")}
         WHERE user_id = $1
         RETURNING *`,
        values,
    );

    // Row might not exist yet — upsert then retry
    if (!rows.length) {
        await findOrCreatePreferences(userId);
        return updatePreferences(userId, fields);
    }

    return rows[0];
}

// ─── Contribution summary ─────────────────────────────────────────────────────

async function getContributionSummary(userId) {
    const { rows } = await query(
        `SELECT
            (SELECT COUNT(*) FROM complaints
             WHERE reporter_id = $1)                                              ::INT AS complaints_filed,

            (SELECT COUNT(*) FROM complaint_upvotes
             WHERE user_id = $1)                                                  ::INT AS upvotes_cast,

            (SELECT COUNT(*) FROM complaint_verifications
             WHERE verifier_id = $1)                                              ::INT AS verifications_cast,

            (SELECT COUNT(*) FROM volunteer_task_assignments
             WHERE volunteer_id = $1 AND status = 'completed')                   ::INT AS tasks_completed,

            COALESCE(
                (SELECT SUM(points) FROM contributions WHERE user_id = $1), 0
            )                                                                     ::INT AS civic_points`,
        [userId],
    );
    return rows[0];
}

// ─── Change password ──────────────────────────────────────────────────────────

async function updatePassword(userId, newHash) {
    const { rows } = await query(
        `UPDATE users
         SET password_hash = $2, password_changed_at = NOW()
         WHERE id = $1 AND is_deleted = FALSE
         RETURNING id, password_changed_at`,
        [userId, newHash],
    );
    return rows[0] ?? null;
}

async function findPasswordHash(userId) {
    const { rows } = await query(
        `SELECT password_hash FROM users WHERE id = $1 AND is_deleted = FALSE LIMIT 1`,
        [userId],
    );
    return rows[0]?.password_hash ?? null;
}

// ─── Soft delete account ──────────────────────────────────────────────────────

async function softDeleteUser(userId) {
    return withTransaction(async (client) => {
        // Anonymize user row
        await client.query(
            `UPDATE users
             SET full_name     = 'Deleted User',
                 email         = 'deleted_' || $1 || '@civikeye.deleted',
                 password_hash = 'DELETED',
                 latitude      = NULL,
                 longitude     = NULL,
                 is_deleted    = TRUE,
                 deleted_at    = NOW()
             WHERE id = $1`,
            [userId],
        );

        // Delete all active refresh tokens (terminate sessions)
        await client.query(
            `DELETE FROM refresh_tokens WHERE user_id = $1`,
            [userId],
        );

        // Delete all notifications
        await client.query(
            `DELETE FROM notifications WHERE user_id = $1`,
            [userId],
        );

        // Delete preferences (CASCADE handles this, but explicit for clarity)
        await client.query(
            `DELETE FROM user_preferences WHERE user_id = $1`,
            [userId],
        );

        return true;
    });
}

// ─── Check email uniqueness (for profile update) ─────────────────────────────

async function isEmailTaken(email, excludeUserId) {
    const { rows } = await query(
        `SELECT id FROM users WHERE email = $1 AND id != $2 AND is_deleted = FALSE LIMIT 1`,
        [email.toLowerCase(), excludeUserId],
    );
    return rows.length > 0;
}

// ─── Community verification status ───────────────────────────────────────────
// Derived: TRUE if user has at least one completed volunteer task

async function getCommunityVerificationStatus(userId) {
    const { rows } = await query(
        `SELECT EXISTS (
            SELECT 1
            FROM volunteer_task_assignments vta
            WHERE vta.volunteer_id = $1 AND vta.status = 'completed'
         ) AS is_verified_volunteer`,
        [userId],
    );
    return rows[0]?.is_verified_volunteer ?? false;
}

// ─── Public profile (anyone can view) ────────────────────────────────────────

async function findPublicProfile(userId) {
    const { rows } = await query(
        `SELECT
             u.id,
             u.full_name,
             u.role,
             u.created_at,
             COALESCE(up.show_name_on_complaints,   TRUE)  AS show_name_on_complaints,
             COALESCE(up.appear_on_leaderboard,     TRUE)  AS appear_on_leaderboard,
             COALESCE(up.show_contribution_history, TRUE)  AS show_contribution_history
         FROM users u
         LEFT JOIN user_preferences up ON up.user_id = u.id
         WHERE u.id = $1 AND u.is_deleted = FALSE
         LIMIT 1`,
        [userId],
    );
    return rows[0] ?? null;
}

module.exports = {
    findUserById,
    updateProfile,
    updateUserLocation,
    findOrCreatePreferences,
    updatePreferences,
    getContributionSummary,
    updatePassword,
    findPasswordHash,
    softDeleteUser,
    isEmailTaken,
    getCommunityVerificationStatus,
    findPublicProfile,
};
