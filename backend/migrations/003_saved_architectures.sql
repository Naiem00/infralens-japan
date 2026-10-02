ALTER TABLE architectures
  ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_architectures_user_id
  ON architectures(user_id);
