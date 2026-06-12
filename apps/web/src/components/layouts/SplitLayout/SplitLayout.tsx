import { memo } from 'react';
import { Grid, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { LayoutNode } from '@sdui/shared';
import { SchemaRenderer } from '@/core/renderer/SchemaRenderer';
import type { RegisteredComponentProps } from '@/core/registry/types';

export const SplitLayout = memo(function SplitLayout({
  schema,
  context,
  onAction,
}: RegisteredComponentProps) {
  const layout = schema as LayoutNode;
  const isMobile = useMediaQuery('(max-width: 992px)');
  const children = layout.children ?? [];

  if (isMobile) {
    return (
      <Stack gap="md">
        {children.map((child) => (
          <SchemaRenderer key={child.id} node={child} context={context} onAction={onAction} />
        ))}
      </Stack>
    );
  }

  return (
    <Grid gutter="md">
      {children.map((child, index) => (
        <Grid.Col key={child.id} span={index === 0 ? 7 : 5}>
          <SchemaRenderer node={child} context={context} onAction={onAction} />
        </Grid.Col>
      ))}
    </Grid>
  );
});
