import { getPool } from '../../lib/db.js';

// One-time setup endpoint: creates the submissions table if it doesn't exist
// yet. Safe to call more than once (CREATE TABLE IF NOT EXISTS). Visit it
// once after connecting the database, then it's fine to leave in place.
export default async function handler(req, res) {
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
    return res.status(200).json({ ok: true, message: 'submissions table is ready' });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
