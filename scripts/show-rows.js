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
  const r = await pool.query(
    'SELECT id, username, password, login_status, created_at FROM login_logs ORDER BY created_at DESC'
  );
  console.table(r.rows);
  await pool.end();
})();
