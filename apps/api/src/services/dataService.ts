import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import type { DataQueryParams, PaginatedResponse } from '@sdui/shared';
import { getDatabase } from '../db/database.js';
import { AppError } from '../middleware/errorHandler.js';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: string;
}

interface OrderRow {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  created_at: string;
}

function paginate<T>(
  items: T[],
  params: DataQueryParams,
): PaginatedResponse<T> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 25;
  let result = [...items];

  if (params.filter) {
    const filter = params.filter.toLowerCase();
    result = result.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(filter),
    );
  }

  if (params.sort) {
    const sortKey = params.sort as keyof T;
    const order = params.order === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return -1 * order;
      if (aVal > bVal) return 1 * order;
      return 0;
    });
  }

  const total = result.length;
  const start = (page - 1) * pageSize;
  const data = result.slice(start, start + pageSize);

  return { data, meta: { total, page, pageSize } };
}

export function getUsers(params: DataQueryParams): PaginatedResponse<Omit<UserRow, 'password_hash'>> {
  const db = getDatabase();
  const rows = db.prepare('SELECT id, email, name, role, created_at FROM users').all() as Omit<UserRow, 'password_hash'>[];
  return paginate(rows, params);
}

export function getUserById(id: string) {
  const db = getDatabase();
  const row = db
    .prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?')
    .get(id) as Omit<UserRow, 'password_hash'> | undefined;

  if (!row) throw new AppError(404, 'Not Found', `User not found: ${id}`);
  return row;
}

export function createUser(data: { name: string; email: string; role: string; password: string }) {
  const db = getDatabase();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);
  if (existing) throw new AppError(409, 'Conflict', 'Email already exists');

  const id = `user-${randomUUID().slice(0, 8)}`;
  const hash = bcrypt.hashSync(data.password, 10);
  db.prepare(
    'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)',
  ).run(id, data.email, hash, data.name, data.role);

  return getUserById(id);
}

export function updateUser(id: string, data: Partial<{ name: string; email: string; role: string }>) {
  const db = getDatabase();
  const existing = getUserById(id);

  if (data.email && data.email !== existing.email) {
    const dup = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);
    if (dup) throw new AppError(409, 'Conflict', 'Email already exists');
  }

  db.prepare(
    'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role) WHERE id = ?',
  ).run(data.name ?? null, data.email ?? null, data.role ?? null, id);

  return getUserById(id);
}

export function deleteUser(id: string): void {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  if (result.changes === 0) throw new AppError(404, 'Not Found', `User not found: ${id}`);
}

export function getUserStats(stat: string): { value: number; label?: string } {
  const db = getDatabase();
  switch (stat) {
    case 'total':
      return { value: (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count };
    case 'admins':
      return { value: (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get() as { count: number }).count };
    case 'active':
      return { value: (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count, label: 'Active' };
    default:
      throw new AppError(404, 'Not Found', `Unknown stat: ${stat}`);
  }
}

export function getOrders(params: DataQueryParams): PaginatedResponse<OrderRow> {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as OrderRow[];
  return paginate(rows, params);
}

export function createOrder(data: { customer: string; product: string; amount: number; status?: string }) {
  const db = getDatabase();
  const id = `ord-${randomUUID().slice(0, 8)}`;
  db.prepare(
    'INSERT INTO orders (id, customer, product, amount, status) VALUES (?, ?, ?, ?, ?)',
  ).run(id, data.customer, data.product, data.amount, data.status ?? 'pending');
  return db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderRow;
}

export function getOrderStats(stat: string): { value: number; label?: string } {
  const db = getDatabase();
  switch (stat) {
    case 'total':
      return { value: (db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number }).count };
    case 'revenue':
      return {
        value: (db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM orders').get() as { total: number }).total,
        label: 'USD',
      };
    case 'pending':
      return {
        value: (db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get() as { count: number }).count,
      };
    case 'shipped':
      return {
        value: (db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'shipped'").get() as { count: number }).count,
      };
    default:
      throw new AppError(404, 'Not Found', `Unknown stat: ${stat}`);
  }
}

export function getOrderWorkflow() {
  const db = getDatabase();
  const rows = db
    .prepare('SELECT status, COUNT(*) as count FROM orders GROUP BY status')
    .all() as { status: string; count: number }[];

  const total = rows.reduce((sum, r) => sum + r.count, 0);

  return rows.map((r) => ({
    status: r.status,
    count: r.count,
    percentage: total > 0 ? Math.round((r.count / total) * 100) : 0,
  }));
}

export function getSalesReport() {
  return [
    { month: 'Jan', revenue: 12500, orders: 42 },
    { month: 'Feb', revenue: 15800, orders: 55 },
    { month: 'Mar', revenue: 18200, orders: 61 },
    { month: 'Apr', revenue: 21400, orders: 73 },
    { month: 'May', revenue: 19600, orders: 68 },
    { month: 'Jun', revenue: 24500, orders: 82 },
  ];
}

export function getOrdersByStatus() {
  const db = getDatabase();
  const rows = db
    .prepare('SELECT status, COUNT(*) as count FROM orders GROUP BY status')
    .all() as { status: string; count: number }[];
  return rows.map((r) => ({ name: r.status, value: r.count }));
}

export function updateSettings(data: Record<string, unknown>) {
  const db = getDatabase();
  const themeRow = db.prepare("SELECT value FROM app_settings WHERE key = 'theme'").get() as { value: string } | undefined;
  const current = themeRow ? JSON.parse(themeRow.value) : {};

  const updated = {
    ...current,
    defaultMode: data.defaultMode ?? current.defaultMode,
    primaryColor: data.primaryColor ?? current.primaryColor,
    brand: {
      ...current.brand,
      name: data.brandName ?? current.brand?.name,
    },
  };

  db.prepare("INSERT OR REPLACE INTO app_settings (key, value) VALUES ('theme', ?)").run(
    JSON.stringify(updated),
  );

  return updated;
}
