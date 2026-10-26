-- Run this once against your Postgres database (Supabase SQL editor, psql, etc.)

CREATE TABLE IF NOT EXISTS login_logs (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(255) NOT NULL,
  password      VARCHAR(255),           -- demo only: plain text. Real apps store a HASH.
  login_status  VARCHAR(20)  NOT NULL,  -- 'success' or 'failed'
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- If the table already exists without the password column, add it:
ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS password VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_login_logs_created_at ON login_logs (created_at DESC);
