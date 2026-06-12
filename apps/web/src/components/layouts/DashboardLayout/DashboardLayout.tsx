import { memo } from 'react';
import { Grid, Title, Stack } from '@mantine/core';
import type { DashboardSchema } from '@sdui/shared';
import { SchemaRenderer } from '@/core/renderer/SchemaRenderer';
import type { RegisteredComponentProps } from '@/core/registry/types';

export const DashboardLayout = memo(function DashboardLayout({
  schema,
  context,
  onAction,
}: RegisteredComponentProps) {
  const dashboard = schema as DashboardSchema;

  return (
    <Stack gap="md">
      {dashboard.title && <Title order={4}>{dashboard.title}</Title>}
      <Grid gutter="md">
        {dashboard.widgets.map((widget) => {
          const span = widget.span ?? { base: 12, sm: 6, md: 4 };
          return (
            <Grid.Col key={widget.id} span={span} style={{ minWidth: 0 }}>
              <SchemaRenderer node={widget} context={context} onAction={onAction} />
            </Grid.Col>
          );
        })}
      </Grid>
    </Stack>
  );
});
