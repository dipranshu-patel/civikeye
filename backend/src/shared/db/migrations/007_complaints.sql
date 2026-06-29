-- Complaints main table
-- category_id → sla_categories (admin-managed, carries department_id + sla_duration_days)
-- public_code auto-generated: CE-XXXX via sequence

CREATE SEQUENCE IF NOT EXISTS complaint_code_seq START 1;

CREATE TABLE IF NOT EXISTS complaints (
    id                      UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    public_code             VARCHAR(20)  UNIQUE
                                         DEFAULT 'CE-' || LPAD(nextval('complaint_code_seq')::TEXT, 4, '0'),
    reporter_id             UUID         NOT NULL
                                         REFERENCES users (id) ON DELETE CASCADE,
    title                   VARCHAR(150) NOT NULL,
    description             TEXT,
    category_id             UUID         NOT NULL
                                         REFERENCES sla_categories (id) ON DELETE RESTRICT,
    department_id           UUID         NOT NULL
                                         REFERENCES departments (id) ON DELETE RESTRICT,
    issue_type              VARCHAR(30)  NOT NULL
                                         CONSTRAINT chk_complaint_issue_type
                                         CHECK (issue_type IN ('authority_required', 'community_fixable')),
    status                  VARCHAR(30)  NOT NULL DEFAULT 'reported'
                                         CONSTRAINT chk_complaint_status
                                         CHECK (status IN ('reported', 'in_progress', 'pending_verification', 'resolved', 'reopened')),
    address_text            TEXT,
    latitude                DECIMAL(9,6) NOT NULL,
    longitude               DECIMAL(9,6) NOT NULL,
    sla_deadline            TIMESTAMPTZ,
    resolved_at             TIMESTAMPTZ,
    reopen_count            SMALLINT     NOT NULL DEFAULT 0,
    upvote_count            INT          NOT NULL DEFAULT 0,
    verification_started_at TIMESTAMPTZ,
    verification_deadline   TIMESTAMPTZ,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaints_location    ON complaints (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_complaints_status      ON complaints (status);
CREATE INDEX IF NOT EXISTS idx_complaints_category    ON complaints (category_id);
CREATE INDEX IF NOT EXISTS idx_complaints_department  ON complaints (department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_reporter    ON complaints (reporter_id);
CREATE INDEX IF NOT EXISTS idx_complaints_sla         ON complaints (sla_deadline);
CREATE INDEX IF NOT EXISTS idx_complaints_code        ON complaints (public_code);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_complaint_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_complaints_updated_at
    BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION set_complaint_updated_at();
