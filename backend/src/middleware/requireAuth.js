import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAuth(req, res, next) {
  const authorization = req.get('authorization');

  if (
    !authorization ||
    !authorization.startsWith('Bearer ')
  ) {
    return res.status(401).json({
      error: 'Authentication required.',
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(
      token,
      env.jwtSecret
    );

    req.auth = {
      userId: payload.sub,
      email: payload.email,
    };

    return next();
  } catch {
    return res.status(401).json({
      error: 'Invalid or expired token.',
    });
  }
}
