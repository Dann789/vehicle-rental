import { verifyToken } from '../src/utils/jwt';
import type { MiddlewareHandler } from 'hono';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    return c.json({ message: 'Unauthorized: no Authorization header' }, 401);
  }

  const parts = authHeader.split(' ');
  const token = parts[1];

  if (parts[0] !== 'Bearer' || !token) {
    return c.json({ message: 'Unauthorized: malformed token' }, 401);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return c.json({ message: 'Unauthorized: invalid token' }, 401);
  }

  c.set('user', payload);
  await next();
};
