# ENT Family Planning Guide

Searchable/sortable reference of parental leave, family support, and fertility
coverage across ACGME otolaryngology residency programs, with a community
suggestion + reviewer-approval workflow.

## Stack

- Static HTML/CSS/JS frontend ([index.html](index.html)) — no build step
- Netlify Functions (v2) under [`netlify/functions/`](netlify/functions) for
  submissions and reviewer auth
- Postgres for storage (see [schema.sql](schema.sql)) — works with Netlify DB
  or any Postgres connection string

## Local setup

1. Install dependencies:
   ```
   npm install
   ```
2. Install the Netlify CLI if you don't have it: `npm i -g netlify-cli`
3. Link the project:
   ```
   netlify link
   ```
4. Connect a database: in the Netlify dashboard, **Project → Database** (or
   **Integrations**) → set up **Netlify DB** (free, Neon-backed), or connect
   your own Postgres and add its connection string as `DATABASE_URL` under
   **Site configuration → Environment variables**.
5. Set the two secrets the database setup doesn't generate for you:
   - `REVIEWER_PASSCODE` — the passcode reviewers type to unlock the queue
   - `SESSION_SECRET` — a random string, e.g. `openssl rand -hex 32`
6. Pull env vars locally and run the dev server:
   ```
   netlify env:pull
   netlify dev
   ```
7. Create the table (once) by visiting `/api/admin/init-db` after the site is
   deployed and connected to a database — it runs the same statement as
   [schema.sql](schema.sql), safe to call more than once.

## Deploy

Push this repo to GitHub and import it in Netlify (**Add new site → Import an
existing project**) — `netlify.toml` in this repo tells Netlify where the
static files and functions live, no manual configuration needed.

## Notes

- The `KNOWN` object in `index.html` holds hand-verified/cited program specifics
  and is still hardcoded in the frontend. It's a good candidate to move into
  its own database table later if it grows past a couple of entries.
- Reviewer sessions are httpOnly cookies signed with `SESSION_SECRET`, valid
  12 hours. There's no rate limiting on the login endpoint — fine for a small
  passcode-gated internal tool, but worth adding if this gets wider traffic.
