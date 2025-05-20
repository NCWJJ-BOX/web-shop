import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

export type AuthenticatedRequest = Request & { userId: string };
export type AdminRequest = AuthenticatedRequest & { role: 'ADMIN' };

type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
};

function readBearerToken(req: Request): string | undefined {
  const header = req.header('authorization');
  if (!header) {
    return undefined;
  }
  const prefix = 'Bearer ';
  if (!header.startsWith(prefix)) {
    return undefined;
  }
  const token = header.slice(prefix.length).trim();
  return token || undefined;
}

export const requireAuth = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = readBearerToken(req);
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'JWT secret not configured' });
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      if (!decoded.sub) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      (req as AuthenticatedRequest).userId = decoded.sub;
      next();
    } catch {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

export const requireAdmin = (): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = readBearerToken(req);
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'JWT secret not configured' });
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      if (!decoded.sub) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.sub }, select: { id: true, role: true } });
      if (!user || user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
      (req as AdminRequest).userId = user.id;
      (req as AdminRequest).role = 'ADMIN';
      next();
    } catch {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
};
