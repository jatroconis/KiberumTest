import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth: RequestHandler = (req, res, next) => {
  const enabled = (process.env.AUTH_ENABLED || 'false').toLowerCase() === 'true';
  if (!enabled) return next();
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing_token' });
  try {
    const secret = process.env.JWT_SECRET || 'dev_secret';
    jwt.verify(token, secret);
    return next();
  } catch {
    return res.status(401).json({ error: 'invalid_token' });
  }
};
