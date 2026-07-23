import { getPool } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rows } = await getPool().query(
      'SELECT slug, field, program, value, source, status, submitted_at FROM submissions'
    );
    const out = {};
    for (const r of rows) {
      out[`sub:${r.slug}:${r.field}`] = {
        value: r.value,
        source: r.source,
        status: r.status,
        submittedAt: r.submitted_at,
        program: r.program,
        field: r.field,
      };
    }
    return res.status(200).json(out);
  }

  if (req.method === 'POST') {
    const { slug, field, program, value, source } = req.body || {};
    if (!slug || !field || !program || !value) {
      return res.status(400).json({ error: 'slug, field, program, and value are required' });
    }
    await getPool().query(
      `INSERT INTO submissions (slug, field, program, value, source, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', now())
       ON CONFLICT (slug, field)
       DO UPDATE SET
         program = EXCLUDED.program,
         value = EXCLUDED.value,
         source = EXCLUDED.source,
         status = 'pending',
         submitted_at = now(),
         reviewed_at = NULL`,
      [slug, field, program, value, source || null]
    );
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
