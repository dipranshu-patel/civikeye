CREATE SEQUENCE IF NOT EXISTS dept_code_seq START 1;

CREATE TABLE IF NOT EXISTS departments (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name          VARCHAR(100)  NOT NULL,

    slug          VARCHAR(100)  NOT NULL UNIQUE,

    email         VARCHAR(255),

    category      VARCHAR(100),

    code          VARCHAR(20)   UNIQUE,

    password_hash TEXT,

    description   TEXT,

    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,

    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_departments_slug      ON departments (slug);
CREATE INDEX IF NOT EXISTS idx_departments_is_active ON departments (is_active);
CREATE INDEX IF NOT EXISTS idx_departments_code      ON departments (code);

CREATE OR REPLACE FUNCTION set_dept_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION set_dept_updated_at();
