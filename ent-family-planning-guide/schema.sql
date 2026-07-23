CREATE TABLE IF NOT EXISTS submissions (
  slug TEXT NOT NULL,
  field TEXT NOT NULL,
  program TEXT NOT NULL,
  value TEXT NOT NULL,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  PRIMARY KEY (slug, field)
);
