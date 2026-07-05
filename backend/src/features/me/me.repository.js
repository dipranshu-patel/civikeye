"use strict";

const { query, withTransaction } = require("../../shared/db/query");

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
    const KEY_MAP = {
        showNameOnComplaints:    "show_name_on_complaints",
        appearOnLeaderboard:     "appear_on_leaderboard",
        showContributionHistory: "show_contribution_history",
        show_name_on_complaints:   "show_name_on_complaints",
        appear_on_leaderboard:     "appear_on_leaderboard",
        show_contribution_history: "show_contribution_history",
    };

    const setClauses = [];
    const values     = [userId];
    let   idx        = 2;

    for (const [inputKey, dbCol] of Object.entries(KEY_MAP)) {
        if (fields[inputKey] !== undefined) {
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

    if (!rows.length) {
        await findOrCreatePreferences(userId);
        return updatePreferences(userId, fields);
    }

    return rows[0];
}

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

async function softDeleteUser(userId) {
    return withTransaction(async (client) => {
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

        await client.query(
            `DELETE FROM refresh_tokens WHERE user_id = $1`,
            [userId],
        );

        await client.query(
            `DELETE FROM notifications WHERE user_id = $1`,
            [userId],
        );

        await client.query(
            `DELETE FROM user_preferences WHERE user_id = $1`,
            [userId],
        );

        return true;
    });
}

async function isEmailTaken(email, excludeUserId) {
    const { rows } = await query(
        `SELECT id FROM users WHERE email = $1 AND id != $2 AND is_deleted = FALSE LIMIT 1`,
        [email.toLowerCase(), excludeUserId],
    );
    return rows.length > 0;
}

async function createEmailChangeOtp(userId, newEmail, otp, expiresAt) {
    await query(
        `UPDATE email_change_otps SET verified = TRUE WHERE user_id = $1 AND verified = FALSE`,
        [userId],
    );
    const { rows } = await query(
        `INSERT INTO email_change_otps (user_id, new_email, otp, expires_at)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id, new_email, otp, verified, attempts, expires_at, created_at`,
        [userId, newEmail, otp, expiresAt],
    );
    return rows[0];
}

async function findPendingEmailChangeOtp(userId) {
    const { rows } = await query(
        `SELECT id, user_id, new_email, otp, verified, attempts, expires_at
         FROM email_change_otps
         WHERE user_id = $1
           AND verified = FALSE
           AND expires_at > NOW()
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId],
    );
    return rows[0] ?? null;
}

async function verifyEmailChangeOtp(otpId, otp) {
    const { rows } = await query(
        `UPDATE email_change_otps
         SET
           attempts = attempts + 1,
           verified = CASE
                        WHEN otp = $2 AND expires_at > NOW() AND verified = FALSE
                        THEN TRUE
                        ELSE verified
                      END
         WHERE id = $1
         RETURNING id, user_id, new_email, otp, verified, attempts, expires_at`,
        [otpId, otp],
    );
    return rows[0] ?? null;
}

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
    createEmailChangeOtp,
    findPendingEmailChangeOtp,
    verifyEmailChangeOtp,
    getCommunityVerificationStatus,
    findPublicProfile,
};
