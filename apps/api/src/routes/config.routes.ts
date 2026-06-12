import { Router } from 'express';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';
import { getRuntimeConfig } from '../services/configService.js';
import { getNavigation, getAllRoutes } from '../services/schemaService.js';

const router = Router();

router.use(authMiddleware);

router.get('/runtime', (req: AuthenticatedRequest, res) => {
  res.json(getRuntimeConfig(req.user!.role));
});

router.get('/navigation', (req: AuthenticatedRequest, res) => {
  res.json({ items: getNavigation(req.user!.role) });
});

router.get('/routes', (_req, res) => {
  res.json({ routes: getAllRoutes() });
});

export default router;
