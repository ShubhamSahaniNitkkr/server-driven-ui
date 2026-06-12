import { Router } from 'express';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';
import { getPageSchema, getFormSchema, getPageSchemaPreview } from '../services/schemaService.js';
import { ROLES } from '@sdui/shared';
import { syncHandler } from '../lib/handler.js';

const router = Router();

router.use(authMiddleware);

router.get('/page', syncHandler((req: AuthenticatedRequest, res) => {
  const path = req.query.path as string;
  if (!path) {
    res.status(400).json({ title: 'Bad Request', detail: 'path query parameter is required' });
    return;
  }
  res.json(getPageSchema(path, req.user!.role));
}));

router.get('/preview', syncHandler((req: AuthenticatedRequest, res) => {
  const path = req.query.path as string;
  const role = req.query.role as string;
  if (!path || !role) {
    res.status(400).json({ title: 'Bad Request', detail: 'path and role query parameters are required' });
    return;
  }
  if (!ROLES.includes(role as (typeof ROLES)[number])) {
    res.status(400).json({ title: 'Bad Request', detail: `Invalid role. Must be one of: ${ROLES.join(', ')}` });
    return;
  }
  res.json(getPageSchemaPreview(path, role));
}));

router.get('/form', syncHandler((req: AuthenticatedRequest, res) => {
  const id = req.query.id as string;
  if (!id) {
    res.status(400).json({ title: 'Bad Request', detail: 'id query parameter is required' });
    return;
  }
  res.json(getFormSchema(id, req.user!.role));
}));

export default router;
