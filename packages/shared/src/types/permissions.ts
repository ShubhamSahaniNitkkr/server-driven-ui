export type Role = 'admin' | 'manager' | 'user' | 'viewer';

export const ROLES: Role[] = ['admin', 'manager', 'user', 'viewer'];

export interface PermissionRequirement {
  view?: string;
  edit?: string;
  delete?: string;
  create?: string;
  execute?: string;
}

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: [
    'users:page:view',
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'orders:page:view',
    'orders:read',
    'orders:create',
    'orders:update',
    'orders:delete',
    'reports:page:view',
    'reports:read',
    'reports:export',
    'settings:page:view',
    'settings:read',
    'settings:update',
    'dashboard:page:view',
    'dashboard:read',
    'showcase:page:view',
    'orders:approve',
    'orders:export',
  ],
  manager: [
    'users:page:view',
    'users:read',
    'users:create',
    'users:update',
    'orders:page:view',
    'orders:read',
    'orders:create',
    'orders:update',
    'reports:page:view',
    'reports:read',
    'reports:export',
    'settings:page:view',
    'settings:read',
    'dashboard:page:view',
    'dashboard:read',
    'showcase:page:view',
    'orders:approve',
    'orders:export',
  ],
  user: [
    'users:page:view',
    'users:read',
    'orders:page:view',
    'orders:read',
    'orders:create',
    'reports:page:view',
    'reports:read',
    'dashboard:page:view',
    'dashboard:read',
    'showcase:page:view',
  ],
  viewer: [
    'users:page:view',
    'users:read',
    'orders:page:view',
    'orders:read',
    'reports:page:view',
    'reports:read',
    'dashboard:page:view',
    'dashboard:read',
    'showcase:page:view',
  ],
};
