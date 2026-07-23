import { verifySession } from '../../lib/session.mjs';
import { getPool } from '../../lib/db.mjs';

export default async (request) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } });
  }

  if (!verifySession(request)) {
    return Response.json({ error: 'Reviewer login required' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { slug, field, action } = body;
  if (!slug || !field || !['approve', 'reject'].includes(action)) {
    return Response.json({ error: 'slug, field, and a valid action are required' }, { status: 400 });
  }

  const status = action === 'approve' ? 'approved' : 'rejected';
  await getPool().query(
    'UPDATE submissions SET status = $1, reviewed_at = now() WHERE slug = $2 AND field = $3',
    [status, slug, field]
  );
  return Response.json({ ok: true });
};

export const config = { path: '/api/admin/review' };
