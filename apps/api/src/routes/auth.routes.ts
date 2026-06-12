import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '@sdui/shared';
import { getDatabase } from '../db/database.js';
import { config } from '../config/index.js';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { JwtPayload } from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    next(new AppError(400, 'Bad Request', 'Invalid login credentials format'));
    return;
  }

  const { email, password } = result.data;
  const db = getDatabase();
  const user = db
    .prepare('SELECT id, email, password_hash, name, role FROM users WHERE email = ?')
    .get(email) as { id: string; email: string; password_hash: string; name: string; role: string } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    next(new AppError(401, 'Unauthorized', 'Invalid email or password'));
    return;
  }

  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role as JwtPayload['role'],
  };

  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

router.get('/me', authMiddleware, (req: AuthenticatedRequest, res, next) => {
  const db = getDatabase();
  const user = db
    .prepare('SELECT id, email, name, role FROM users WHERE id = ?')
    .get(req.user!.sub) as { id: string; email: string; name: string; role: string } | undefined;

  if (!user) {
    next(new AppError(404, 'Not Found', 'User not found'));
    return;
  }

  res.json(user);
});

router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
