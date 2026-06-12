import type { PageSchema } from '@sdui/shared';

export const SHOWCASE_PAGE: PageSchema = {
  id: 'page-showcase',
  type: 'page',
  version: '1.0',
  title: 'SDUI Live Studio',
  description:
    'See how Server Driven UI works — the server sends JSON, the client renders it. No hardcoded pages.',
  path: '/showcase',
  permissions: { view: 'showcase:page:view' },
  actions: [
    {
      id: 'action-open-orders',
      type: 'button',
      label: 'Open Live Use Case →',
      variant: 'filled',
      action: { type: 'navigate', payload: { path: '/orders' } },
      meta: { testId: 'open-orders-demo' },
    },
  ],
  layout: {
    id: 'layout-showcase',
    type: 'section',
    title: 'How Server Driven UI Works',
    description:
      'This entire page is rendered from a JSON schema stored in SQLite. Change the schema on the server — the UI updates without a frontend deploy.',
    children: [
      {
        id: 'showcase-hero',
        type: 'alert',
        title: 'Flagship Use Case: Order Fulfillment Command Center',
        message:
          'Acme Corp runs internal ops on SDUI. The /orders page is 100% schema-driven: Admins see create + export + approve actions. Managers see approve. Users see create only. Viewers get read-only tables. The server filters the schema per role before sending JSON to the browser.',
        variant: 'info',
      },
      {
        id: 'showcase-pipeline',
        type: 'pipeline',
        title: 'Rendering Pipeline',
        subtitle: 'What happens when you navigate to any page',
        steps: [
          {
            id: 'step-1',
            label: '1. Route Match',
            description: 'Browser requests /orders. Astro catch-all route loads the React runtime.',
            icon: 'route',
          },
          {
            id: 'step-2',
            label: '2. Schema Fetch',
            description: 'RTK Query calls GET /api/v1/schemas/page?path=/orders with JWT token.',
            icon: 'api',
          },
          {
            id: 'step-3',
            label: '3. Server Filter',
            description: 'Express filters schema by RBAC permissions + feature flags for your role.',
            icon: 'shield',
          },
          {
            id: 'step-4',
            label: '4. Zod Validate',
            description: 'Frontend validates JSON structure before rendering. Invalid schemas show fallback UI.',
            icon: 'check',
          },
          {
            id: 'step-5',
            label: '5. Registry Resolve',
            description: 'ComponentRegistry maps type:"table" → DataTable, type:"form" → DynamicForm, etc.',
            icon: 'registry',
          },
          {
            id: 'step-6',
            label: '6. Render Tree',
            description: 'SchemaRenderer walks the tree recursively. PermissionGate hides unauthorized nodes.',
            icon: 'render',
          },
        ],
      },
      {
        id: 'showcase-pointer',
        type: 'alert',
        title: 'Look at the right panel →',
        message:
          'The JSON you see on the right IS this page. Every component on the left (this alert, pipeline, workflow) is declared in that JSON with a "type" field. Try /orders next — switch between admin and viewer login to see the JSON change.',
        variant: 'success',
      },
      {
        id: 'showcase-workflow',
        type: 'workflow-board',
        title: 'Order Fulfillment Pipeline',
        dataSource: '/api/v1/data/orders/workflow',
        stages: [
          { id: 'pending', label: 'Pending', status: 'pending', color: 'yellow' },
          { id: 'processing', label: 'Processing', status: 'processing', color: 'blue' },
          { id: 'shipped', label: 'Shipped', status: 'shipped', color: 'indigo' },
          { id: 'delivered', label: 'Delivered', status: 'delivered', color: 'teal' },
        ],
        permissions: { view: 'orders:read' },
      },
      {
        id: 'showcase-cta',
        type: 'grid',
        columns: 2,
        gap: 'md',
        children: [
          {
            id: 'cta-orders',
            type: 'alert',
            title: 'Try it: Switch roles',
            message:
              'Log out and sign in as viewer@example.com (read-only) vs admin@example.com (full access). Visit /orders — the schema JSON changes, buttons disappear, all without frontend code changes.',
            variant: 'success',
          },
          {
            id: 'cta-flags',
            type: 'alert',
            title: 'Feature Flags',
            message:
              'exports.enabled is OFF in the database. Admins won\'t see Export on Reports until you enable it in feature_flags table — no redeploy needed.',
            variant: 'warning',
          },
        ],
      },
    ],
  },
};
