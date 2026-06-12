import type { PageSchema, SchemaNode } from '@sdui/shared';
import { ComponentRegistry } from '@/core/registry/ComponentRegistry';

export interface SchemaNodeIndexEntry {
  id: string;
  type: string;
  label: string;
  jsonPath: string;
  parentId: string | null;
  ancestors: Array<{ id: string; type: string; label: string }>;
  childIds: string[];
  registryComponent: string;
  registryCategory: string;
  isFallback: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  page: 'Page',
  grid: 'Grid Layout',
  section: 'Section',
  card: 'Card',
  tabs: 'Tabs',
  split: 'Split Layout',
  dashboard: 'Dashboard',
  'stat-card': 'Stat Card',
  table: 'Data Table',
  form: 'Form',
  chart: 'Chart',
  alert: 'Alert',
  button: 'Action Button',
  pipeline: 'Pipeline Visualizer',
  'schema-explorer': 'Schema Explorer',
  'role-matrix': 'Role Matrix',
  'workflow-board': 'Workflow Board',
};

function typeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

const REGISTRY_COMPONENT_NAMES: Record<string, string> = {
  grid: 'GridLayout',
  section: 'SectionLayout',
  card: 'CardLayout',
  tabs: 'TabsLayout',
  split: 'SplitLayout',
  dashboard: 'DashboardLayout',
  table: 'DataTable',
  'stat-card': 'StatCard',
  chart: 'ChartWidget',
  form: 'DynamicForm',
  alert: 'AlertWidget',
  button: 'ActionButton',
  pipeline: 'PipelineVisualizer',
  'schema-explorer': 'SchemaExplorer',
  'role-matrix': 'RoleMatrix',
  'workflow-board': 'WorkflowBoard',
};

function resolveRegistry(type: string): Pick<SchemaNodeIndexEntry, 'registryComponent' | 'registryCategory' | 'isFallback'> {
  try {
    const entry = ComponentRegistry.resolve(type);
    const isFallback = 'isFallback' in entry && entry.isFallback;
    return {
      registryComponent: isFallback ? 'FallbackComponent' : (REGISTRY_COMPONENT_NAMES[type] ?? type),
      registryCategory: isFallback ? 'fallback' : entry.category,
      isFallback: Boolean(isFallback),
    };
  } catch {
    return { registryComponent: 'Unknown', registryCategory: 'unknown', isFallback: true };
  }
}

function collectChildNodes(node: SchemaNode): SchemaNode[] {
  if (node.type === 'dashboard' && 'widgets' in node) {
    return node.widgets;
  }
  if ('children' in node && Array.isArray(node.children)) {
    return node.children;
  }
  return [];
}

function indexNode(
  node: SchemaNode,
  jsonPath: string,
  parentId: string | null,
  ancestors: Array<{ id: string; type: string; label: string }>,
  index: Map<string, SchemaNodeIndexEntry>,
): void {
  const children = collectChildNodes(node);
  const childIds = children.map((c) => c.id);
  const registry = resolveRegistry(node.type);

  index.set(node.id, {
    id: node.id,
    type: node.type,
    label: typeLabel(node.type),
    jsonPath,
    parentId,
    ancestors,
    childIds,
    ...registry,
  });

  const nextAncestors = [...ancestors, { id: node.id, type: node.type, label: typeLabel(node.type) }];

  children.forEach((child, i) => {
    const childPath =
      node.type === 'dashboard' ? `${jsonPath}.widgets[${i}]` : `${jsonPath}.children[${i}]`;
    indexNode(child, childPath, node.id, nextAncestors, index);
  });
}

export function buildSchemaIndex(page: PageSchema): Map<string, SchemaNodeIndexEntry> {
  const index = new Map<string, SchemaNodeIndexEntry>();
  const pageRegistry = resolveRegistry('page');

  index.set(page.id, {
    id: page.id,
    type: 'page',
    label: typeLabel('page'),
    jsonPath: '$',
    parentId: null,
    ancestors: [],
    childIds: [page.layout.id, ...(page.actions?.map((a) => a.id) ?? [])],
    registryComponent: 'DynamicPage',
    registryCategory: 'page',
    isFallback: false,
  });

  indexNode(page.layout, 'layout', page.id, [{ id: page.id, type: 'page', label: 'Page' }], index);

  page.actions?.forEach((action, i) => {
    const registry = resolveRegistry(action.type);
    index.set(action.id, {
      id: action.id,
      type: action.type,
      label: typeLabel(action.type),
      jsonPath: `actions[${i}]`,
      parentId: page.id,
      ancestors: [{ id: page.id, type: 'page', label: 'Page' }],
      childIds: [],
      ...registry,
    });
  });

  return index;
}

export function getTypeLabel(type: string): string {
  return typeLabel(type);
}
