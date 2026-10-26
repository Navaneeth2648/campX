import { Pool } from 'pg';

// Reuse a single pool across hot reloads / serverless invocations.
let pool = global._pgPool;

export function getPool() {
  if (!process.env.DATABASE_URL) return null; // app still runs without a DB

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_SSL === 'false'
          ? false
          : { rejectUnauthorized: false },
    });
    global._pgPool = pool;
  }
  return pool;
}
