import { memo, useMemo } from 'react';
import { Paper, Text, Code, ScrollArea, Badge, Group, Loader, Stack } from '@mantine/core';
import { useSelector } from 'react-redux';
import type { SchemaExplorerSchema } from '@sdui/shared';
import { useGetPageSchemaQuery } from '@/store/api/schemaApi';
import type { RegisteredComponentProps } from '@/core/registry/types';
import type { RootState } from '@/store';
import classes from './SchemaExplorer.module.css';

function countNodes(obj: unknown): number {
  if (!obj || typeof obj !== 'object') return 0;
  let count = 1;
  for (const val of Object.values(obj as Record<string, unknown>)) {
    if (Array.isArray(val)) for (const item of val) count += countNodes(item);
    else if (val && typeof val === 'object') count += countNodes(val);
  }
  return count;
}

export const SchemaExplorer = memo(function SchemaExplorer({ schema }: RegisteredComponentProps) {
  const explorer = schema as SchemaExplorerSchema;
  const user = useSelector((state: RootState) => state.user.profile);
  const { data, isLoading, isFetching } = useGetPageSchemaQuery(explorer.demoPath);

  const json = useMemo(() => (data ? JSON.stringify(data, null, 2) : ''), [data]);
  const nodeCount = useMemo(() => (data ? countNodes(data) : 0), [data]);
  const actionCount = data?.actions?.length ?? 0;

  return (
    <Stack gap="sm" data-testid={explorer.meta?.testId}>
      <Group gap="xs">
        <Badge variant="outline" color="gray">{explorer.demoPath}</Badge>
        <Badge variant="outline" color="gray">{user?.role ?? '—'}</Badge>
        {isFetching && <Loader size="xs" />}
      </Group>
      <Text size="xs" c="dimmed">
        {nodeCount} schema nodes · {actionCount} actions · filtered server-side
      </Text>
      <Paper className={classes.codePanel} radius="md" withBorder>
        <ScrollArea h={360} type="auto">
          {isLoading ? (
            <Group justify="center" p="xl"><Loader size="sm" /></Group>
          ) : (
            <Code block className={classes.code}>{json}</Code>
          )}
        </ScrollArea>
      </Paper>
    </Stack>
  );
});
