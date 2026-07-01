CREATE TABLE IF NOT EXISTS notifications (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(60)  NOT NULL,
    title       VARCHAR(255) NOT NULL,
    body        TEXT         NOT NULL,
    data        JSONB        NOT NULL DEFAULT '{}',
    entity_type VARCHAR(30),          
    entity_id   UUID,                 
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_user_unread
    ON notifications (user_id, created_at DESC)
    WHERE is_read = FALSE;

CREATE INDEX IF NOT EXISTS idx_notif_user_all
    ON notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notif_entity
    ON notifications (entity_type, entity_id)
    WHERE entity_id IS NOT NULL;
