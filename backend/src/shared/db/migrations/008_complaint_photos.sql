-- Complaint photos (Cloudinary hosted, max 4 per complaint)

CREATE TABLE IF NOT EXISTS complaint_photos (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id  UUID        NOT NULL
                              REFERENCES complaints (id) ON DELETE CASCADE,
    url           TEXT        NOT NULL,      
    public_id     VARCHAR(255) NOT NULL,    
    position      SMALLINT    NOT NULL DEFAULT 0
                              CONSTRAINT chk_photo_position CHECK (position BETWEEN 0 AND 3),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_complaint ON complaint_photos (complaint_id);
