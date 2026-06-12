import { describe, it, expect, beforeAll } from 'vitest';
import type { PageSchema } from '@sdui/shared';
import { registerComponents } from '@/core/registry/registerComponents';
import { buildSchemaIndex } from '@/lib/schemaIndex';

beforeAll(() => {
  registerComponents();
});

const samplePage: PageSchema = {
  id: 'page-test',
  type: 'page',
  version: '1',
  title: 'Test',
  path: '/test',
  layout: {
    id: 'layout-root',
    type: 'grid',
    columns: 2,
    children: [
      {
        id: 'stat-1',
        type: 'stat-card',
        title: 'Total',
        dataSource: 'orders',
      },
    ],
  },
  actions: [
    {
      id: 'action-1',
      type: 'button',
      label: 'Create',
      action: { type: 'navigate', payload: { path: '/orders' } },
    },
  ],
};

describe('buildSchemaIndex', () => {
  it('indexes page, layout, children, and actions', () => {
    const index = buildSchemaIndex(samplePage);

    expect(index.has('page-test')).toBe(true);
    expect(index.has('layout-root')).toBe(true);
    expect(index.has('stat-1')).toBe(true);
    expect(index.has('action-1')).toBe(true);

    const stat = index.get('stat-1');
    expect(stat?.jsonPath).toBe('layout.children[0]');
    expect(stat?.parentId).toBe('layout-root');
    expect(stat?.registryComponent).toBe('StatCard');
  });
});
