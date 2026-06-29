-- Complaint status history (powers the timeline in the detail modal)
-- from_status NULL = initial creation entry

CREATE TABLE IF NOT EXISTS complaint_status_history (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id  UUID        NOT NULL
                              REFERENCES complaints (id) ON DELETE CASCADE,
    from_status   VARCHAR(30),           
    to_status     VARCHAR(30) NOT NULL,
    actor_id      UUID
                              REFERENCES users (id) ON DELETE SET NULL,
    actor_role    VARCHAR(30)
                              CONSTRAINT chk_actor_role
                              CHECK (actor_role IN ('citizen', 'department', 'admin', 'system')),
    note          TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_complaint ON complaint_status_history (complaint_id);
