import { Router } from 'express';
import { syncHandler } from '../lib/handler.js';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  getOrders,
  createOrder,
  getOrderStats,
  getOrderWorkflow,
  getSalesReport,
  getOrdersByStatus,
  updateSettings,
} from '../services/dataService.js';

const router = Router();

router.use(authMiddleware);

function parseQuery(req: { query: Record<string, unknown> }) {
  return {
    page: req.query.page ? parseInt(String(req.query.page), 10) : undefined,
    pageSize: req.query.pageSize ? parseInt(String(req.query.pageSize), 10) : undefined,
    sort: req.query.sort as string | undefined,
    order: req.query.order as 'asc' | 'desc' | undefined,
    filter: req.query.filter as string | undefined,
  };
}

router.get('/users', requirePermission('users:read'), syncHandler((req, res) => {
  res.json(getUsers(parseQuery(req)));
}));

router.get('/users/stats/:stat', requirePermission('users:read'), syncHandler((req, res) => {
  res.json(getUserStats(String(req.params.stat)));
}));

router.get('/users/:id', requirePermission('users:read'), syncHandler((req, res) => {
  res.json(getUserById(String(req.params.id)));
}));

router.post('/users', requirePermission('users:create'), syncHandler((req, res) => {
  res.status(201).json(createUser(req.body));
}));

router.put('/users/:id', requirePermission('users:update'), syncHandler((req, res) => {
  res.json(updateUser(String(req.params.id), req.body));
}));

router.delete('/users/:id', requirePermission('users:delete'), syncHandler((req, res) => {
  deleteUser(String(req.params.id));
  res.status(204).send();
}));

router.get('/orders/workflow', requirePermission('orders:read'), syncHandler((_req, res) => {
  res.json(getOrderWorkflow());
}));

router.get('/orders/stats/:stat', requirePermission('orders:read'), syncHandler((req, res) => {
  res.json(getOrderStats(String(req.params.stat)));
}));

router.get('/orders', requirePermission('orders:read'), syncHandler((req, res) => {
  res.json(getOrders(parseQuery(req)));
}));

router.post('/orders', requirePermission('orders:create'), syncHandler((req, res) => {
  res.status(201).json(createOrder(req.body));
}));

router.get('/reports/sales', requirePermission('reports:read'), syncHandler((_req, res) => {
  res.json(getSalesReport());
}));

router.get('/reports/sales-table', requirePermission('reports:read'), syncHandler((_req, res) => {
  const data = getSalesReport();
  res.json({ data, meta: { total: data.length, page: 1, pageSize: data.length } });
}));

router.get('/reports/orders-by-status', requirePermission('reports:read'), syncHandler((_req, res) => {
  res.json(getOrdersByStatus());
}));

router.put('/settings', requirePermission('settings:update'), syncHandler((req: AuthenticatedRequest, res) => {
  res.json(updateSettings(req.body));
}));

export default router;
