# ENT Family Planning Guide

Searchable/sortable reference of parental leave, family support, and fertility
coverage across ACGME otolaryngology residency programs, with a community
suggestion + reviewer-approval workflow.

## Stack

- Static HTML/CSS/JS frontend ([index.html](index.html)) — no build step
- Vercel serverless functions under [`api/`](api) for submissions and reviewer auth
- Vercel Postgres for storage (see [schema.sql](schema.sql))

## Local setup

1. Install dependencies:
   ```
   npm install
   ```
2. Install the Vercel CLI if you don't have it: `npm i -g vercel`
3. Link the project and connect Postgres:
   ```
   vercel link
   ```
   Then in the Vercel dashboard: **Storage → Create Database → Postgres**,
   and connect it to this project. This wires up `POSTGRES_URL` automatically.
4. Set the two secrets the dashboard doesn't generate for you (Project →
   Settings → Environment Variables):
   - `REVIEWER_PASSCODE` — the passcode reviewers type to unlock the queue
   - `SESSION_SECRET` — a random string, e.g. `openssl rand -hex 32`
5. Pull env vars locally and run the dev server:
   ```
   vercel env pull
   vercel dev
   ```
6. Create the table (once) by running [schema.sql](schema.sql) against the
   database — easiest via the "Query" tab in the Vercel Postgres dashboard,
   or `psql "$POSTGRES_URL" -f schema.sql` locally.

## Deploy

Push this repo to GitHub and import it in Vercel (same flow as the workout
app) — no framework preset needed, Vercel auto-detects the static file +
`/api` functions layout.

## Notes

- The `KNOWN` object in `index.html` holds hand-verified/cited program specifics
  and is still hardcoded in the frontend. It's a good candidate to move into
  its own database table later if it grows past a couple of entries.
- Reviewer sessions are httpOnly cookies signed with `SESSION_SECRET`, valid
  12 hours. There's no rate limiting on the login endpoint — fine for a small
  passcode-gated internal tool, but worth adding if this gets wider traffic.
