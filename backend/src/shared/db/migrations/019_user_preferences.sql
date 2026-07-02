CREATE TABLE IF NOT EXISTS user_preferences (
    user_id                   UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    show_name_on_complaints   BOOLEAN     NOT NULL DEFAULT TRUE,
    appear_on_leaderboard     BOOLEAN     NOT NULL DEFAULT TRUE,
    show_contribution_history BOOLEAN     NOT NULL DEFAULT TRUE,
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_deleted          BOOLEAN     NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at          TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_not_deleted ON users (id) WHERE is_deleted = FALSE;
