
CREATE TABLE IF NOT EXISTS sla_categories (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name                VARCHAR(150) NOT NULL,

    department_id       UUID NOT NULL
        REFERENCES departments (id) ON DELETE CASCADE,

    sla_duration_days   SMALLINT NOT NULL
        CONSTRAINT chk_sla_duration CHECK (sla_duration_days > 0),

    description         TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sla_department ON sla_categories (department_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_sla_categories_updated_at
    BEFORE UPDATE ON sla_categories
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
