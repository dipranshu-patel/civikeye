-- Migration: create password_reset_tokens table
-- Run once against civikeye_db before deploying the forgot-password feature.

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used       BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for token lookup (primary query path)
CREATE UNIQUE INDEX IF NOT EXISTS idx_prt_token_hash
    ON password_reset_tokens (token_hash);

-- Index for user-scoped cleanup
CREATE INDEX IF NOT EXISTS idx_prt_user_id
    ON password_reset_tokens (user_id);

-- Index to support periodic expiry cleanup
CREATE INDEX IF NOT EXISTS idx_prt_expires_at
    ON password_reset_tokens (expires_at);
