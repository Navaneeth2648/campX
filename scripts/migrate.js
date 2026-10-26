// One-off: add the password column to an existing login_logs table.
// Run: node scripts/migrate.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const envPath = path.join(__dirname, '..', '.env.local');
for (const l of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
(async () => {
  try {
    await pool.query(
      'ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS password VARCHAR(255)'
    );
    console.log('OK: password column is present on login_logs.');
  } catch (e) {
    console.error('FAILED:', e.message);
  } finally {
    await pool.end();
  }
})();
