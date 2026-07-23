import crypto from 'crypto';
import { createSessionCookie } from '../../lib/session.mjs';

export default async (request) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } });
  }

  const expected = process.env.REVIEWER_PASSCODE;
  if (!expected) {
    return Response.json({ error: 'Server not configured' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const a = Buffer.from(String(body.passcode || ''));
  const b = Buffer.from(expected);
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!valid) {
    return Response.json({ error: 'Incorrect passcode' }, { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': createSessionCookie(),
    },
  });
};

export const config = { path: '/api/admin/login' };
