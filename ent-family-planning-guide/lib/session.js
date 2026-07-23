import crypto from 'crypto';

const COOKIE_NAME = 'reviewer_session';
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12h

function sign(payload) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set');
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createSessionCookie() {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `reviewer:${expires}`;
  const sig = sign(payload);
  const value = encodeURIComponent(`${payload}:${sig}`);
  return `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE_SECONDS}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function verifySession(req) {
  const cookieHeader = req.headers.cookie || '';
  const entry = cookieHeader
    .split(';')
    .map((s) => s.trim())
    .find((p) => p.startsWith(`${COOKIE_NAME}=`));
  if (!entry) return false;

  const raw = decodeURIComponent(entry.slice(COOKIE_NAME.length + 1));
  const lastColon = raw.lastIndexOf(':');
  if (lastColon === -1) return false;

  const payload = raw.slice(0, lastColon);
  const sig = raw.slice(lastColon + 1);
  if (!timingSafeEqual(sign(payload), sig)) return false;

  const expires = Number(payload.split(':')[1]);
  return Number.isFinite(expires) && Date.now() < expires;
}
