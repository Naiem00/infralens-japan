CREATE TABLE IF NOT EXISTS architectures (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  selected_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  architecture_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessments (
  id BIGSERIAL PRIMARY KEY,
  architecture_id BIGINT REFERENCES architectures(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  category_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  applied_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_architecture_id
  ON assessments(architecture_id);

CREATE INDEX IF NOT EXISTS idx_architectures_created_at
  ON architectures(created_at DESC);
