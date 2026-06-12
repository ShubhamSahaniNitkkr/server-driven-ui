import { memo } from 'react';
import { Stack, Title, Text } from '@mantine/core';
import type { LayoutNode } from '@sdui/shared';
import { SchemaRenderer } from '@/core/renderer/SchemaRenderer';
import type { RegisteredComponentProps } from '@/core/registry/types';

export const SectionLayout = memo(function SectionLayout({
  schema,
  context,
  onAction,
}: RegisteredComponentProps) {
  const layout = schema as LayoutNode;

  return (
    <Stack gap="md" role="region" aria-label={layout.title}>
      {layout.title && (
        <Title order={5} fw={600}>
          {layout.title}
        </Title>
      )}
      {layout.description && <Text className="sdui-body">{layout.description}</Text>}
      {layout.children?.map((child) => (
        <SchemaRenderer key={child.id} node={child} context={context} onAction={onAction} />
      ))}
    </Stack>
  );
});
