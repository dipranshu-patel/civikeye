CREATE TABLE IF NOT EXISTS complaint_upvotes (
    complaint_id  UUID        NOT NULL
                              REFERENCES complaints (id) ON DELETE CASCADE,
    user_id       UUID        NOT NULL
                              REFERENCES users (id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (complaint_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_upvotes_user ON complaint_upvotes (user_id);
