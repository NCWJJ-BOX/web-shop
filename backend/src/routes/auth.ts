import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth';

function signToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password too short' });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, avatar: true, role: true },
  });

  const token = signToken(user.id);
  res.status(201).json({ token, user });
});

authRouter.post('/login', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signToken(user.id);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? undefined,
      role: user.role,
    },
  });
});

authRouter.get('/me', requireAuth(), async (req, res) => {
  const userId = (req as AuthenticatedRequest).userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? undefined,
    role: user.role,
    createdAt: user.createdAt,
  });
});
