import type Database from 'better-sqlite3';
import type { PageSchema } from '@sdui/shared';
import { SHOWCASE_PAGE } from './showcaseSchema.js';
import { ORDERS_PAGE } from './ordersPageSchema.js';

export const PAGE_SCHEMAS: Record<string, PageSchema> = {
  '/showcase': SHOWCASE_PAGE,
  '/users': {
    id: 'page-users',
    type: 'page',
    version: '1.0',
    title: 'Users',
    description: 'Manage system users and roles',
    path: '/users',
    permissions: { view: 'users:page:view' },
    actions: [
      {
        id: 'action-create-user',
        type: 'button',
        label: 'Add User',
        variant: 'filled',
        action: {
          type: 'modal',
          payload: { schemaId: 'form-create-user' },
        },
        permissions: { execute: 'users:create' },
        meta: { testId: 'create-user-btn' },
      },
    ],
    layout: {
      id: 'layout-users',
      type: 'section',
      title: 'User Management',
      description: 'View and manage all system users',
      children: [
        {
          id: 'users-stats',
          type: 'grid',
          columns: 3,
          gap: 'md',
          children: [
            {
              id: 'stat-total-users',
              type: 'stat-card',
              title: 'Total Users',
              dataSource: '/api/v1/data/users/stats/total',
              icon: 'users',
              color: 'blue',
            },
            {
              id: 'stat-admins',
              type: 'stat-card',
              title: 'Admins',
              dataSource: '/api/v1/data/users/stats/admins',
              icon: 'shield',
              color: 'grape',
            },
            {
              id: 'stat-active',
              type: 'stat-card',
              title: 'Active Users',
              dataSource: '/api/v1/data/users/stats/active',
              icon: 'activity',
              color: 'teal',
            },
          ],
        },
        {
          id: 'users-table',
          type: 'table',
          title: 'All Users',
          dataSource: '/api/v1/data/users',
          sortable: true,
          filterable: true,
          pagination: { pageSize: 10 },
          columns: [
            { id: 'col-name', header: 'Name', accessor: 'name', sortable: true, filterable: true },
            { id: 'col-email', header: 'Email', accessor: 'email', sortable: true, filterable: true },
            { id: 'col-role', header: 'Role', accessor: 'role', sortable: true, render: 'badge' },
            { id: 'col-created', header: 'Created', accessor: 'created_at', sortable: true, render: 'date' },
          ],
          permissions: { view: 'users:read' },
          meta: { ariaLabel: 'Users data table', testId: 'users-table' },
        },
      ],
    },
  },
  '/orders': ORDERS_PAGE,
  '/reports': {
    id: 'page-reports',
    type: 'page',
    version: '1.0',
    title: 'Reports',
    description: 'Analytics and reporting dashboard',
    path: '/reports',
    permissions: { view: 'reports:page:view' },
    featureFlag: 'reports.enabled',
    actions: [
      {
        id: 'action-export',
        type: 'button',
        label: 'Export Report',
        variant: 'outline',
        action: {
          type: 'notification',
          payload: { variant: 'info', message: 'Export feature is controlled by feature flags' },
        },
        permissions: { execute: 'reports:export' },
        featureFlag: 'exports.enabled',
      },
    ],
    layout: {
      id: 'layout-reports',
      type: 'tabs',
      children: [
        {
          id: 'tab-sales',
          type: 'section',
          title: 'Sales Overview',
          children: [
            {
              id: 'sales-chart',
              type: 'chart',
              title: 'Monthly Sales',
              chartType: 'bar',
              dataSource: '/api/v1/data/reports/sales',
              xKey: 'month',
              yKey: 'revenue',
              featureFlag: 'dashboard.charts',
            },
            {
              id: 'sales-table',
              type: 'table',
              dataSource: '/api/v1/data/reports/sales-table',
              columns: [
                { id: 'col-month', header: 'Month', accessor: 'month' },
                { id: 'col-revenue', header: 'Revenue', accessor: 'revenue', render: 'currency' },
                { id: 'col-orders', header: 'Orders', accessor: 'orders' },
              ],
              pagination: { pageSize: 12 },
            },
          ],
        },
        {
          id: 'tab-orders',
          type: 'section',
          title: 'Order Analytics',
          children: [
            {
              id: 'orders-chart',
              type: 'chart',
              title: 'Orders by Status',
              chartType: 'pie',
              dataSource: '/api/v1/data/reports/orders-by-status',
              featureFlag: 'dashboard.charts',
            },
          ],
        },
      ],
    },
  },
  '/settings': {
    id: 'page-settings',
    type: 'page',
    version: '1.0',
    title: 'Settings',
    description: 'Configure application settings',
    path: '/settings',
    permissions: { view: 'settings:page:view' },
    layout: {
      id: 'layout-settings',
      type: 'split',
      children: [
        {
          id: 'settings-form-section',
          type: 'card',
          title: 'General Settings',
          children: [
            {
              id: 'settings-form',
              type: 'form',
              title: 'Application Configuration',
              fields: [
                {
                  id: 'field-brand-name',
                  type: 'text-input',
                  name: 'brandName',
                  label: 'Brand Name',
                  validation: { required: true },
                },
                {
                  id: 'field-primary-color',
                  type: 'select',
                  name: 'primaryColor',
                  label: 'Primary Color',
                  options: [
                    { value: 'blue', label: 'Blue' },
                    { value: 'indigo', label: 'Indigo' },
                    { value: 'teal', label: 'Teal' },
                  ],
                },
                {
                  id: 'field-default-mode',
                  type: 'radio',
                  name: 'defaultMode',
                  label: 'Default Theme',
                  options: [
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                  ],
                },
              ],
              submitLabel: 'Save Settings',
              submitAction: {
                type: 'api',
                method: 'PUT',
                endpoint: '/api/v1/data/settings',
              },
              permissions: { execute: 'settings:update' },
            },
          ],
        },
        {
          id: 'settings-info',
          type: 'card',
          title: 'Feature Flags',
          children: [
            {
              id: 'flags-alert',
              type: 'alert',
              message: 'Feature flags are managed server-side and control runtime behavior without redeployment.',
              variant: 'info',
            },
          ],
        },
      ],
    },
  },
  '/dashboard': {
    id: 'page-dashboard',
    type: 'page',
    version: '1.0',
    title: 'Dashboard',
    description: 'Overview of key metrics and activity',
    path: '/dashboard',
    permissions: { view: 'dashboard:page:view' },
    layout: {
      id: 'layout-dashboard',
      type: 'section',
      title: 'Overview',
      children: [
        {
          id: 'dashboard-widgets',
          type: 'dashboard',
          title: 'Key Metrics',
          widgets: [
        {
          id: 'widget-users',
          type: 'stat-card',
          title: 'Total Users',
          dataSource: '/api/v1/data/users/stats/total',
          icon: 'users',
          color: 'blue',
          span: { base: 12, sm: 6, md: 3 },
        },
        {
          id: 'widget-orders',
          type: 'stat-card',
          title: 'Total Orders',
          dataSource: '/api/v1/data/orders/stats/total',
          icon: 'shopping-cart',
          color: 'teal',
          span: { base: 12, sm: 6, md: 3 },
        },
        {
          id: 'widget-revenue',
          type: 'stat-card',
          title: 'Revenue',
          dataSource: '/api/v1/data/orders/stats/revenue',
          icon: 'currency',
          color: 'grape',
          span: { base: 12, sm: 6, md: 3 },
        },
        {
          id: 'widget-pending',
          type: 'stat-card',
          title: 'Pending Orders',
          dataSource: '/api/v1/data/orders/stats/pending',
          icon: 'clock',
          color: 'orange',
          span: { base: 12, sm: 6, md: 3 },
        },
        {
          id: 'widget-sales-chart',
          type: 'chart',
          title: 'Sales Trend',
          chartType: 'area',
          dataSource: '/api/v1/data/reports/sales',
          xKey: 'month',
          yKey: 'revenue',
          span: { base: 12, md: 8 },
          featureFlag: 'dashboard.charts',
        },
        {
          id: 'widget-recent-orders',
          type: 'table',
          title: 'Recent Orders',
          dataSource: '/api/v1/data/orders',
          span: { base: 12, md: 4 },
          pagination: { pageSize: 5 },
          columns: [
            { id: 'col-customer', header: 'Customer', accessor: 'customer' },
            { id: 'col-amount', header: 'Amount', accessor: 'amount', render: 'currency' },
            { id: 'col-status', header: 'Status', accessor: 'status', render: 'badge' },
          ],
        },
          ],
        },
      ],
    },
  },
};

export function seedPageSchemas(db: Database.Database): void {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO page_schemas (id, path, schema_json)
    VALUES (?, ?, ?)
  `);

  for (const [path, schema] of Object.entries(PAGE_SCHEMAS)) {
    insert.run(schema.id, path, JSON.stringify(schema));
  }
}
