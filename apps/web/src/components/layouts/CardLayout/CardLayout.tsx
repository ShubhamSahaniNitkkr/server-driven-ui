import { memo } from 'react';
import { Card, Text, Title, Stack } from '@mantine/core';
import type { CardSchema } from '@sdui/shared';
import { SchemaRenderer } from '@/core/renderer/SchemaRenderer';
import type { RegisteredComponentProps } from '@/core/registry/types';

export const CardLayout = memo(function CardLayout({
  schema,
  context,
  onAction,
}: RegisteredComponentProps) {
  const card = schema as CardSchema;

  return (
    <Card shadow="xs" padding="lg" radius="md" withBorder>
      {card.title && <Title order={5}>{card.title}</Title>}
      {card.description && (
        <Text size="sm" c="dimmed" mt="xs">
          {card.description}
        </Text>
      )}
      <Stack gap="md" mt="md">
        {card.children?.map((child) => (
          <SchemaRenderer key={child.id} node={child} context={context} onAction={onAction} />
        ))}
      </Stack>
    </Card>
  );
});
