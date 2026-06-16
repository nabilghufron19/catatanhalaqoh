-- Schema Neon untuk aplikasi Catatan Diskusi Idadiyah
-- Gunakan file ini untuk membuat tabel notes di database Neon PostgreSQL.

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  notebook TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  date_full TEXT NOT NULL,
  date_short TEXT NOT NULL,
  month_group TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  saved_at TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_notebook ON notes(notebook);
CREATE INDEX IF NOT EXISTS idx_notes_month_group ON notes(month_group);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_notes_title_body ON notes USING GIN(
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(body, ''))
);
