CREATE TABLE IF NOT EXISTS email_change_otps (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    new_email  VARCHAR(255) NOT NULL,
    otp        CHAR(6) NOT NULL,
    verified   BOOLEAN NOT NULL DEFAULT FALSE,
    attempts   INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_change_otps_user_id
    ON email_change_otps (user_id);
