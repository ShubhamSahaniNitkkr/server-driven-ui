import { memo, useCallback, useMemo, type MouseEvent } from 'react';
import { Stack, Group, Title, Text, Alert, Paper, Badge, Box } from '@mantine/core';
import { useSelector } from 'react-redux';
import { useGetPageSchemaQuery } from '@/store/api/schemaApi';
import { SchemaRenderer } from '@/core/renderer/SchemaRenderer';
import { ActionButton } from '@/components/display/ActionButton/ActionButton';
import { useActionHandler } from '@/hooks/useActionHandler';
import { PermissionGate } from '@/core/renderer/PermissionGate';
import { useSchemaSelection } from '@/contexts/SchemaSelectionContext';
import { LoadingFallback } from '@/components/feedback/LoadingFallback';
import type { RenderContext } from '@/core/actions/types';
import type { RootState } from '@/store';
import classes from './DynamicPage.module.css';

interface DynamicPageProps {
  path: string;
  compact?: boolean;
  studio?: boolean;
}

export const DynamicPage = memo(function DynamicPage({
  path,
  compact = false,
  studio = false,
}: DynamicPageProps) {
  const { data: page, isLoading, error } = useGetPageSchemaQuery(path);
  const onAction = useActionHandler();
  const user = useSelector((state: RootState) => state.user.profile);
  const { selectedId, selectNode } = useSchemaSelection();

  const context = useMemo<RenderContext>(() => ({ pagePath: path, depth: 0 }), [path]);

  const handleSelect = useCallback(
    (id: string) => (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea, [role="tab"]')) return;
      e.stopPropagation();
      selectNode(id, 'ui');
    },
    [selectNode],
  );

  if (isLoading) return <LoadingFallback />;

  if (error) {
    const status = 'status' in error ? error.status : 500;
    return (
      <Alert color="red" title="Page Error" role="alert" variant="light">
        {status === 403
          ? 'You do not have permission to view this page.'
          : status === 404
            ? 'Page not found.'
            : 'Failed to load page.'}
      </Alert>
    );
  }

  if (!page) return null;

  const pageSelected = studio && selectedId === page.id;

  return (
    <Stack gap={compact ? 'md' : 'lg'} id="main-content" className={studio ? classes.studio : undefined}>
      <Paper
        className={classes.hero}
        p={compact ? 'md' : 'lg'}
        radius="md"
        withBorder
        shadow="xs"
        data-sdui-node-id={studio ? page.id : undefined}
        data-sdui-node-type={studio ? 'page' : undefined}
        data-sdui-selected={pageSelected ? 'true' : undefined}
        onClick={studio ? handleSelect(page.id) : undefined}
      >
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <div style={{ minWidth: 0, flex: 1 }}>
            <Title order={compact ? 4 : 3} className={classes.title}>
              {page.title}
            </Title>
            {!compact && page.description && (
              <Text className={classes.description} mt="xs">
                {page.description}
              </Text>
            )}
            <Group gap={6} mt="sm" wrap="wrap">
              <Badge variant="outline" color="gray" size="sm">
                {page.path}
              </Badge>
              <Badge variant="outline" color="gray" size="sm">
                {user?.role}
              </Badge>
            </Group>
          </div>
          {page.actions && page.actions.length > 0 && (
            <Group gap="sm" className="sdui-page-actions">
              {page.actions.map((action) => {
                const actionSelected = studio && selectedId === action.id;
                return (
                  <PermissionGate key={action.id} permissions={action.permissions} featureFlag={action.featureFlag}>
                    <Box
                      data-sdui-node-id={studio ? action.id : undefined}
                      data-sdui-node-type={studio ? action.type : undefined}
                      data-sdui-selected={actionSelected ? 'true' : undefined}
                      onClick={studio ? handleSelect(action.id) : undefined}
                      className={studio ? classes.selectable : undefined}
                    >
                      <ActionButton id={action.id} schema={action} context={context} onAction={onAction} />
                    </Box>
                  </PermissionGate>
                );
              })}
            </Group>
          )}
        </Group>
      </Paper>
      <SchemaRenderer node={page.layout} context={context} onAction={onAction} />
    </Stack>
  );
});
