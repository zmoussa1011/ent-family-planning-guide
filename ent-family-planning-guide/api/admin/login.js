import crypto from 'crypto';
import { createSessionCookie } from '../../lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expected = process.env.REVIEWER_PASSCODE;
  if (!expected) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { passcode } = req.body || {};
  const a = Buffer.from(String(passcode || ''));
  const b = Buffer.from(expected);
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!valid) {
    return res.status(401).json({ error: 'Incorrect passcode' });
  }

  res.setHeader('Set-Cookie', createSessionCookie());
  return res.status(200).json({ ok: true });
}
