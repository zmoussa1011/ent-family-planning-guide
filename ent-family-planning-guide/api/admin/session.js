import { verifySession } from '../../lib/session.js';

export default async function handler(req, res) {
  return res.status(200).json({ isReviewer: verifySession(req) });
}
