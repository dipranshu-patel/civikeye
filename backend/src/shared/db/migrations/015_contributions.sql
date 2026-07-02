CREATE TABLE IF NOT EXISTS contributions (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID        NOT NULL
                              REFERENCES users (id) ON DELETE CASCADE,
    complaint_id  UUID
                              REFERENCES complaints (id) ON DELETE SET NULL,
    task_id       UUID
                              REFERENCES volunteer_tasks (id) ON DELETE SET NULL,
    points        INT         NOT NULL,
    type          VARCHAR(30) NOT NULL
                              CONSTRAINT chk_contribution_type
                              CHECK (type IN ('report','verification','community_fix')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contributions_user       ON contributions (user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_complaint  ON contributions (complaint_id);
CREATE INDEX IF NOT EXISTS idx_contributions_type       ON contributions (type);
CREATE INDEX IF NOT EXISTS idx_contributions_created    ON contributions (created_at DESC);
