CREATE TABLE IF NOT EXISTS volunteer_task_assignments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id         UUID        NOT NULL
                                REFERENCES volunteer_tasks (id) ON DELETE CASCADE,
    volunteer_id    UUID        NOT NULL
                                REFERENCES users (id) ON DELETE CASCADE,
    status          VARCHAR(30) NOT NULL DEFAULT 'active'
                                CONSTRAINT chk_vassign_status
                                CHECK (status IN ('active','pending_verification','completed','abandoned')),
    note            TEXT,
    proof_photo_url TEXT,
    proof_public_id TEXT,
    claimed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    UNIQUE (task_id, volunteer_id)
);

CREATE INDEX IF NOT EXISTS idx_vassign_task        ON volunteer_task_assignments (task_id);
CREATE INDEX IF NOT EXISTS idx_vassign_volunteer   ON volunteer_task_assignments (volunteer_id);
CREATE INDEX IF NOT EXISTS idx_vassign_status      ON volunteer_task_assignments (status);
