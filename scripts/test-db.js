// Quick one-off connection test. Run: node scripts/test-db.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load .env.local manually (no dependency needed)
const envPath = path.join(__dirname, '..', '.env.local');
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    const now = await pool.query('SELECT NOW() as now');
    console.log('CONNECTED. Server time:', now.rows[0].now);
    const t = await pool.query(
      "SELECT to_regclass('public.login_logs') as tbl"
    );
    console.log('login_logs table:', t.rows[0].tbl || 'MISSING — run db/schema.sql');
    const c = await pool.query('SELECT COUNT(*) FROM login_logs');
    console.log('rows in login_logs:', c.rows[0].count);
  } catch (e) {
    console.error('FAILED:', e.message);
  } finally {
    await pool.end();
  }
})();
