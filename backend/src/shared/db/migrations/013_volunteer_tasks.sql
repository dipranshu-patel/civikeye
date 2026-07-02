CREATE SEQUENCE IF NOT EXISTS volunteer_task_code_seq START 1;

CREATE TABLE IF NOT EXISTS volunteer_tasks (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id  UUID        NOT NULL UNIQUE
                              REFERENCES complaints (id) ON DELETE CASCADE,
    status        VARCHAR(30) NOT NULL DEFAULT 'open'
                              CONSTRAINT chk_vtask_status
                              CHECK (status IN ('open','claimed','pending_verification','completed')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vtasks_status      ON volunteer_tasks (status);
CREATE INDEX IF NOT EXISTS idx_vtasks_complaint   ON volunteer_tasks (complaint_id);

CREATE OR REPLACE FUNCTION set_vtask_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_vtask_updated_at
    BEFORE UPDATE ON volunteer_tasks
    FOR EACH ROW EXECUTE FUNCTION set_vtask_updated_at();
