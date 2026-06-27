"use strict";

const pool = require("../../config/db");

async function findUserByEmail(email) {
    const sql = `
    SELECT
      id,
      full_name,
      email,
      password_hash,
      role,
      latitude,
      longitude,
      created_at
    FROM users
    WHERE email = $1
    LIMIT 1;
  `;

    const { rows } = await pool.query(sql, [email]);
    return rows[0] ?? null;
}

async function insertUser({ fullName, email, passwordHash, role = "citizen", latitude = null, longitude = null }) {
    const sql = `
    INSERT INTO users (full_name, email, password_hash, role, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, full_name, email, role, latitude, longitude, created_at;
  `;

    const { rows } = await pool.query(sql, [
        fullName,
        email,
        passwordHash,
        role,
        latitude,
        longitude,
    ]);
    return rows[0];
}

async function insertRefreshToken({ userId, tokenHash, expiresAt }) {
    const sql = `
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, token_hash, expires_at, revoked, created_at;
  `;

    const { rows } = await pool.query(sql, [userId, tokenHash, expiresAt]);
    return rows[0];
}

async function findRefreshTokenByHash(tokenHash) {
    const sql = `
    SELECT
      id,
      user_id,
      token_hash,
      expires_at,
      revoked,
      created_at
    FROM refresh_tokens
    WHERE token_hash = $1
    LIMIT 1;
  `;

    const { rows } = await pool.query(sql, [tokenHash]);
    return rows[0] ?? null;
}

async function revokeRefreshTokenById(tokenId) {
    const sql = `
    UPDATE refresh_tokens
    SET    revoked = TRUE
    WHERE  id = $1
    RETURNING id, user_id, token_hash, expires_at, revoked, created_at;
  `;

    const { rows } = await pool.query(sql, [tokenId]);
    return rows[0] ?? null;
}

async function revokeAllRefreshTokensForUser(userId) {
    const sql = `
    UPDATE refresh_tokens
    SET    revoked = TRUE
    WHERE  user_id = $1
      AND  revoked = FALSE;
  `;

    const result = await pool.query(sql, [userId]);
    return result.rowCount;
}

async function createEmailVerification({ email, otp, expiresAt }) {
    const sql = `
    INSERT INTO email_verifications (email, otp, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, email, otp, verified, expires_at, attempts, created_at;
  `;

    const { rows } = await pool.query(sql, [email, otp, expiresAt]);
    return rows[0];
}

async function deleteEmailVerification(verificationId) {
    await pool.query("DELETE FROM email_verifications WHERE id = $1", [
        verificationId,
    ]);
}

async function findLatestEmailVerification(email) {
    const sql = `
    SELECT
      id,
      email,
      otp,
      verified,
      expires_at,
      attempts,
      created_at
    FROM  email_verifications
    WHERE email      = $1
      AND verified   = FALSE
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
  `;

    const { rows } = await pool.query(sql, [email]);
    return rows[0] ?? null;
}

async function markEmailAsVerified(verificationId, otp) {
    const sql = `
    UPDATE email_verifications
    SET
      attempts = attempts + 1,
      verified = CASE
                   WHEN otp = $2 AND expires_at > NOW() AND verified = FALSE
                   THEN TRUE
                   ELSE verified
                 END
    WHERE id = $1
    RETURNING id, email, otp, verified, expires_at, attempts, created_at;
  `;

    const { rows } = await pool.query(sql, [verificationId, otp]);
    return rows[0] ?? null;
}

async function findVerifiedEmailVerification(email) {
    const sql = `
    SELECT
      id,
      email,
      verified,
      created_at
    FROM  email_verifications
    WHERE email    = $1
      AND verified = TRUE
      AND created_at > NOW() - INTERVAL '30 minutes'
    ORDER BY created_at DESC
    LIMIT 1;
  `;

    const { rows } = await pool.query(sql, [email]);
    return rows[0] ?? null;
}

async function createPasswordResetToken({ userId, tokenHash, expiresAt }) {
    const sql = `
    INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, token_hash, expires_at, used, created_at;
  `;

    const { rows } = await pool.query(sql, [userId, tokenHash, expiresAt]);
    return rows[0];
}

async function findPasswordResetToken(tokenHash) {
    const sql = `
    SELECT
      id,
      user_id,
      token_hash,
      expires_at,
      used,
      created_at
    FROM  password_reset_tokens
    WHERE token_hash = $1
    LIMIT 1;
  `;

    const { rows } = await pool.query(sql, [tokenHash]);
    return rows[0] ?? null;
}

async function deleteAllPasswordResetTokensForUser(userId) {
    const result = await pool.query(
        "DELETE FROM password_reset_tokens WHERE user_id = $1",
        [userId],
    );
    return result.rowCount;
}

async function updateUserPassword(userId, passwordHash) {
    const sql = `
    UPDATE users
    SET    password_hash = $2
    WHERE  id = $1
    RETURNING id, email, role;
  `;

    const { rows } = await pool.query(sql, [userId, passwordHash]);
    return rows[0] ?? null;
}

async function deleteExpiredPasswordResetTokens() {
    const result = await pool.query(
        "DELETE FROM password_reset_tokens WHERE expires_at < NOW()",
    );
    return result.rowCount;
}

module.exports = {
    findUserByEmail,
    insertUser,

    insertRefreshToken,
    findRefreshTokenByHash,
    revokeRefreshTokenById,
    revokeAllRefreshTokensForUser,

    createEmailVerification,
    deleteEmailVerification,
    findLatestEmailVerification,
    markEmailAsVerified,
    findVerifiedEmailVerification,

    createPasswordResetToken,
    findPasswordResetToken,
    deleteAllPasswordResetTokensForUser,
    updateUserPassword,
    deleteExpiredPasswordResetTokens,
};
