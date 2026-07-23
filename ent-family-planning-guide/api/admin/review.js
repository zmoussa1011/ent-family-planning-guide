import { sql } from '@vercel/postgres';
import { verifySession } from '../../lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifySession(req)) {
    return res.status(401).json({ error: 'Reviewer login required' });
  }

  const { slug, field, action } = req.body || {};
  if (!slug || !field || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'slug, field, and a valid action are required' });
  }

  const status = action === 'approve' ? 'approved' : 'rejected';
  await sql`
    UPDATE submissions
    SET status = ${status}, reviewed_at = now()
    WHERE slug = ${slug} AND field = ${field}
  `;
  return res.status(200).json({ ok: true });
}
