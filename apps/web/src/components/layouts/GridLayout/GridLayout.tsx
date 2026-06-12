import { memo } from 'react';
import { Grid } from '@mantine/core';
import type { GridSpan, LayoutNode } from '@sdui/shared';
import { SchemaRenderer } from '@/core/renderer/SchemaRenderer';
import type { RegisteredComponentProps } from '@/core/registry/types';

function resolveSpan(
  child: { span?: GridSpan },
  columnCount: number,
  childCount: number,
): GridSpan {
  if (child.span) return child.span;
  const cols = columnCount > 0 ? columnCount : childCount;
  const md = Math.max(1, Math.floor(12 / cols));
  return { base: 12, sm: 6, md };
}

export const GridLayout = memo(function GridLayout({
  schema,
  context,
  onAction,
}: RegisteredComponentProps) {
  const layout = schema as LayoutNode;
  const children = layout.children ?? [];
  const columnCount = layout.columns ?? children.length;

  return (
    <Grid gutter={layout.gap ?? 'md'}>
      {children.map((child) => (
        <Grid.Col
          key={child.id}
          span={resolveSpan(child as { span?: GridSpan }, columnCount, children.length)}
        >
          <SchemaRenderer node={child} context={context} onAction={onAction} />
        </Grid.Col>
      ))}
    </Grid>
  );
});
