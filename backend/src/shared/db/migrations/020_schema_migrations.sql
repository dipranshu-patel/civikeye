CREATE TABLE IF NOT EXISTS schema_migrations (
    filename   VARCHAR(255) PRIMARY KEY,
    run_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
