ALTER TABLE users
    ADD COLUMN IF NOT EXISTS latitude  DECIMAL(9, 6),
    ADD COLUMN IF NOT EXISTS longitude DECIMAL(9, 6);

CREATE INDEX IF NOT EXISTS idx_users_location ON users (latitude, longitude)
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
