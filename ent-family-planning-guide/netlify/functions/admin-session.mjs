import { verifySession } from '../../lib/session.mjs';

export default async (request) => {
  return Response.json({ isReviewer: verifySession(request) });
};

export const config = { path: '/api/admin/session' };
