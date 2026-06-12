import type { PageSchema, FormSchema, SchemaNode, PermissionRequirement } from '@sdui/shared';
import { pageSchema } from '@sdui/shared';
import { getDatabase } from '../db/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { getUserPermissions } from '../middleware/rbac.js';
import { meetsRequirements } from './permissionService.js';
import { getFeatureFlags } from './featureFlagService.js';

function filterSchemaNode(
  node: SchemaNode,
  permissions: string[],
  flags: Record<string, boolean>,
): SchemaNode | null {
  if (node.featureFlag && !flags[node.featureFlag]) {
    return null;
  }

  if (!meetsRequirements(permissions, node.permissions)) {
    return null;
  }

  if ('children' in node && Array.isArray(node.children)) {
    const filteredChildren = node.children
      .map((child) => filterSchemaNode(child as SchemaNode, permissions, flags))
      .filter((child): child is SchemaNode => child !== null);

    return { ...node, children: filteredChildren };
  }

  if (node.type === 'dashboard' && 'widgets' in node) {
    const dashboardNode = node as SchemaNode & { widgets: SchemaNode[] };
    const widgets = dashboardNode.widgets
      .map((w) => filterSchemaNode(w, permissions, flags))
      .filter((w): w is SchemaNode => w !== null);
    return { ...dashboardNode, widgets } as SchemaNode;
  }

  return node;
}

function filterPageSchema(schema: PageSchema, role: string): PageSchema {
  const permissions = getUserPermissions(role);
  const flags = getFeatureFlags();

  const filteredLayout = filterSchemaNode(schema.layout, permissions, flags);
  if (!filteredLayout) {
    throw new AppError(403, 'Forbidden', 'You do not have permission to view this page');
  }

  const filteredActions = schema.actions
    ?.filter((action) => {
      if (action.featureFlag && !flags[action.featureFlag]) return false;
      return meetsRequirements(permissions, action.permissions);
    });

  return {
    ...schema,
    layout: filteredLayout as PageSchema['layout'],
    actions: filteredActions,
  };
}

export function getPageSchema(path: string, role: string): PageSchema {
  const db = getDatabase();
  const row = db
    .prepare('SELECT schema_json FROM page_schemas WHERE path = ?')
    .get(path) as { schema_json: string } | undefined;

  if (!row) {
    throw new AppError(404, 'Not Found', `No page schema found for path: ${path}`);
  }

  const parsed = JSON.parse(row.schema_json);
  const result = pageSchema.safeParse(parsed);

  if (!result.success) {
    throw new AppError(500, 'Schema Error', 'Invalid page schema stored on server');
  }

  const schema = result.data as PageSchema;

  if (!meetsRequirements(getUserPermissions(role), schema.permissions)) {
    throw new AppError(403, 'Forbidden', 'You do not have permission to view this page');
  }

  return filterPageSchema(schema, role);
}

export function getFormSchema(id: string, role: string): FormSchema {
  const db = getDatabase();
  const row = db
    .prepare('SELECT schema_json FROM form_schemas WHERE id = ?')
    .get(id) as { schema_json: string } | undefined;

  if (!row) {
    throw new AppError(404, 'Not Found', `No form schema found for id: ${id}`);
  }

  const schema = JSON.parse(row.schema_json) as FormSchema;

  if (!meetsRequirements(getUserPermissions(role), schema.permissions)) {
    throw new AppError(403, 'Forbidden', 'You do not have permission to access this form');
  }

  return schema;
}

export function getPageSchemaPreview(path: string, role: string): PageSchema {
  return getPageSchema(path, role);
}

export function getAllRoutes(): string[] {
  const db = getDatabase();
  const rows = db.prepare('SELECT path FROM page_schemas').all() as { path: string }[];
  return rows.map((r) => r.path);
}

export function getNavigation(role: string) {
  const permissions = getUserPermissions(role);
  const flags = getFeatureFlags();

  const items = [
    {
      id: 'nav-showcase',
      label: 'SDUI Studio',
      path: '/showcase',
      icon: 'sparkles',
      permissions: { view: 'showcase:page:view' },
    },
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'layout-dashboard',
      permissions: { view: 'dashboard:page:view' },
    },
    {
      id: 'nav-users',
      label: 'Users',
      path: '/users',
      icon: 'users',
      permissions: { view: 'users:page:view' },
    },
    {
      id: 'nav-orders',
      label: 'Orders',
      path: '/orders',
      icon: 'shopping-cart',
      permissions: { view: 'orders:page:view' },
    },
    {
      id: 'nav-reports',
      label: 'Reports',
      path: '/reports',
      icon: 'chart-bar',
      permissions: { view: 'reports:page:view' },
      featureFlag: 'reports.enabled',
    },
    {
      id: 'nav-settings',
      label: 'Settings',
      path: '/settings',
      icon: 'settings',
      permissions: { view: 'settings:page:view' },
    },
  ];

  return items.filter((item) => {
    if ('featureFlag' in item && item.featureFlag && !flags[item.featureFlag as string]) {
      return false;
    }
    return meetsRequirements(permissions, item.permissions as PermissionRequirement);
  });
}
