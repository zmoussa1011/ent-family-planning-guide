import { getPool } from '../../lib/db.mjs';

export default async (request) => {
  if (request.method === 'GET') {
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
    return Response.json(out);
  }

  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const { slug, field, program, value, source } = body;
    if (!slug || !field || !program || !value) {
      return Response.json({ error: 'slug, field, program, and value are required' }, { status: 400 });
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
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'GET, POST' } });
};

export const config = { path: '/api/submissions' };
