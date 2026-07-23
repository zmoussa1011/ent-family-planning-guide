import { getPool } from '../../lib/db.mjs';

// One-time setup: creates the submissions table if it doesn't exist yet.
// Safe to call more than once. Visit /api/admin/init-db once after connecting
// the database.
export default async () => {
  try {
    await getPool().query(`
      CREATE TABLE IF NOT EXISTS submissions (
        slug TEXT NOT NULL,
        field TEXT NOT NULL,
        program TEXT NOT NULL,
        value TEXT NOT NULL,
        source TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        reviewed_at TIMESTAMPTZ,
        PRIMARY KEY (slug, field)
      )
    `);
    return Response.json({ ok: true, message: 'submissions table is ready' });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
};

export const config = { path: '/api/admin/init-db' };
