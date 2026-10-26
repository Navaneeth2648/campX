# Campus Login Demo (student project)

A full-stack login demo built with **Next.js (App Router)** + **Postgres**.
It reproduces a clean, modern login-card design (neutral `eduX` branding — not a
clone of any real organization), authenticates against a **demo** user list, logs
every attempt (username, status, timestamp) to a hosted database, and redirects a
successful login to a **demo dashboard** inside this app.

> Learning project. The social buttons are decorative, and the credentials are
> fake demo values — do not put real passwords in it.

## Tech stack

- **Frontend + Backend:** Next.js 14 (one deployable app, API routes included)
- **Database:** any Postgres (Supabase / Neon / Vercel Postgres / local)
- **Hosting:** Vercel

## Demo credentials

| Username        | Password    |
| --------------- | ----------- |
| `student`       | `demo1234`  |
| `admin@demo.edu`| `admin1234` |

Anything else returns "Invalid username or password" (and is still logged as a
`failed` attempt).

## Project structure

```
app/
  layout.js            root layout
  page.js              redirects / -> /login
  globals.css          all styling
  login/page.js        the login UI (client component)
  dashboard/page.js    demo dashboard shown after login
  api/login/route.js   POST /api/login — validates + logs to DB
lib/db.js              Postgres connection pool
db/schema.sql          the login_logs table
.env.example           environment variables to copy
```

## 1. Set up the database

Create a free Postgres database. **Supabase** is the easiest:

1. Go to <https://supabase.com> → New project.
2. In the project's **SQL Editor**, paste and run the contents of
   [`db/schema.sql`](db/schema.sql) to create the `login_logs` table.
3. Go to **Project Settings → Database → Connection string → URI** and copy it
   (use the connection-pooler URI for serverless/Vercel).

Neon (<https://neon.tech>) or Vercel Postgres work the same way — create the DB,
run `schema.sql`, copy the connection string.

## 2. Run locally

```bash
npm install
cp .env.example .env.local      # then edit .env.local with your DATABASE_URL
npm run dev
```

Open <http://localhost:3000> → you'll be redirected to `/login`.

`.env.local`:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME
DATABASE_SSL=true
NEXT_PUBLIC_ORG_NAME=GAYATRI EDUCATIONAL DEVELOPMENT SOCIETY
```

> The app runs even without `DATABASE_URL` (auth still works), it just won't log
> attempts. Set the URL to enable logging.

## 3. Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On <https://vercel.com> → **Add New → Project** → import that repo.
3. Under **Environment Variables**, add:
   - `DATABASE_URL` — your Postgres connection string
   - `DATABASE_SSL` — `true`
   - `NEXT_PUBLIC_ORG_NAME` — e.g. `GAYATRI EDUCATIONAL DEVELOPMENT SOCIETY`
4. Click **Deploy**. Vercel auto-detects Next.js — no extra config needed.

Your live URL (e.g. `https://your-app.vercel.app`) opens the login page.

## 4. Verify the database logging

After a few login attempts, run this in your DB's SQL editor:

```sql
SELECT id, username, login_status, created_at
FROM login_logs
ORDER BY created_at DESC
LIMIT 20;
```

You should see one row per attempt.

## Environment variables reference

| Variable              | Required | Purpose                                             |
| --------------------- | -------- | --------------------------------------------------- |
| `DATABASE_URL`        | no\*     | Postgres connection string. \*Needed to log logins. |
| `DATABASE_SSL`        | no       | `true` (default) for hosted DBs; `false` for local. |
| `NEXT_PUBLIC_ORG_NAME`| no       | Org name shown on the login card.                   |
