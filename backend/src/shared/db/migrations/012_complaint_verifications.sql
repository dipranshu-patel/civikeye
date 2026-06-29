-- Community verification votes
-- One vote per citizen per complaint; enforced by UNIQUE constraint.
-- vote: 'confirm' = resolution looks good | 'reject' = issue still present

CREATE TABLE IF NOT EXISTS complaint_verifications (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id  UUID        NOT NULL
                              REFERENCES complaints (id) ON DELETE CASCADE,
    verifier_id   UUID        NOT NULL
                              REFERENCES users (id) ON DELETE CASCADE,
    vote          VARCHAR(10) NOT NULL
                              CONSTRAINT chk_verification_vote
                              CHECK (vote IN ('confirm', 'reject')),
    comment       TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (complaint_id, verifier_id)
);

CREATE INDEX IF NOT EXISTS idx_verifications_complaint ON complaint_verifications (complaint_id);
CREATE INDEX IF NOT EXISTS idx_verifications_verifier  ON complaint_verifications (verifier_id);
