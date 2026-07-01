CREATE TABLE IF NOT EXISTS audit_logs (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID         REFERENCES users(id) ON DELETE SET NULL,
    actor_role  VARCHAR(20)  NOT NULL,      
    action      VARCHAR(30)  NOT NULL,      
    entity_type VARCHAR(30)  NOT NULL,      
    entity_id   UUID,
    metadata    JSONB        NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor   ON audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity  ON audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_action  ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at DESC);
