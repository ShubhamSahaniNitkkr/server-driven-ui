import { memo, Suspense, useCallback, useMemo, type MouseEvent } from 'react';
import type { SchemaNode } from '@sdui/shared';
import { ComponentRegistry } from '../registry/ComponentRegistry';
import { PermissionGate } from './PermissionGate';
import { ComponentErrorBoundary } from '@/components/feedback/ErrorBoundary/ComponentErrorBoundary';
import { SchemaContext } from '@/contexts/SchemaContext';
import { useSchemaSelection } from '@/contexts/SchemaSelectionContext';
import type { ActionHandler, RenderContext } from '../actions/types';
import { LoadingFallback } from '@/components/feedback/LoadingFallback';
import classes from './SchemaRenderer.module.css';

interface SchemaRendererProps {
  node: SchemaNode;
  context: RenderContext;
  onAction: ActionHandler;
}

export const SchemaRenderer = memo(function SchemaRenderer({
  node,
  context,
  onAction,
}: SchemaRendererProps) {
  const { selectedId, selectNode } = useSchemaSelection();
  const entry = useMemo(() => ComponentRegistry.resolve(node.type), [node.type]);
  const Component = entry.component;
  const isSelected = selectedId === node.id;

  const childContext = useMemo<RenderContext>(
    () => ({
      ...context,
      depth: context.depth + 1,
      parentId: node.id,
    }),
    [context, node.id],
  );

  const handleAction: ActionHandler = useCallback(
    (action) => onAction(action),
    [onAction],
  );

  const handleSelect = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea, [role="tab"]')) return;
      e.stopPropagation();
      selectNode(node.id, 'ui');
    },
    [node.id, selectNode],
  );

  const metaProps = useMemo(
    () => ({
      'aria-label': node.meta?.ariaLabel,
      'aria-describedby': node.meta?.ariaDescribedBy,
      role: node.meta?.role,
      'data-testid': node.meta?.testId,
    }),
    [node.meta],
  );

  return (
    <PermissionGate
      permissions={node.permissions}
      featureFlag={node.featureFlag}
    >
      <SchemaContext.Provider value={childContext}>
        <ComponentErrorBoundary componentId={node.id} componentType={node.type}>
          <Suspense fallback={<LoadingFallback />}>
            <div
              {...metaProps}
              data-sdui-node-id={node.id}
              data-sdui-node-type={node.type}
              data-sdui-selected={isSelected ? 'true' : undefined}
              className={isSelected ? classes.selected : classes.nodeWrap}
              onClick={handleSelect}
            >
              <Component
                id={node.id}
                schema={node}
                context={childContext}
                onAction={handleAction}
              />
            </div>
          </Suspense>
        </ComponentErrorBoundary>
      </SchemaContext.Provider>
    </PermissionGate>
  );
});
