import { memo, useMemo } from 'react';
import {
  Text,
  Badge,
  Group,
  Stack,
  Loader,
  Alert,
  CopyButton,
  ActionIcon,
  Tooltip,
  Box,
} from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { useGetPageSchemaQuery } from '@/store/api/schemaApi';
import { useSchemaSelection } from '@/contexts/SchemaSelectionContext';
import { JsonTreeViewer } from '@/components/studio/JsonTreeViewer/JsonTreeViewer';
import { RenderStructurePanel } from '@/components/studio/RenderStructurePanel/RenderStructurePanel';
import type { RootState } from '@/store';
import classes from './SchemaPanel.module.css';

interface SchemaPanelProps {
  path: string;
}

export const SchemaPanel = memo(function SchemaPanel({ path }: SchemaPanelProps) {
  const user = useSelector((state: RootState) => state.user.profile);
  const { data, isLoading, error, isFetching } = useGetPageSchemaQuery(path);
  const { selectedId, selectNode, source } = useSchemaSelection();

  const json = useMemo(() => (data ? JSON.stringify(data, null, 2) : ''), [data]);
  const endpoint = `GET /api/v1/schemas/page?path=${encodeURIComponent(path)}`;

  const errorMessage = useMemo(() => {
    if (!error) return null;
    if ('status' in error) {
      if (error.status === 403) return '403 — Permission denied';
      if (error.status === 404) return '404 — Schema not found';
      if (error.status === 500) return '500 — Invalid schema on server';
    }
    return 'Failed to load schema';
  }, [error]);

  const scrollToId = source === 'ui' ? selectedId : null;

  return (
    <Stack gap={0} className={classes.root}>
      <Box className={classes.meta}>
        <Group justify="space-between" wrap="nowrap">
          <Group gap={6} wrap="wrap">
            <Badge variant="outline" color="gray" size="sm">
              {user?.role}
            </Badge>
            <Badge variant="outline" color="gray" size="sm">
              {path}
            </Badge>
          </Group>
          {isFetching && <Loader size={12} color="gray" />}
        </Group>
        <Group justify="space-between" className={classes.endpointRow} wrap="nowrap" mt="xs">
          <Text className={classes.endpoint}>{endpoint}</Text>
          <CopyButton value={json}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy JSON'}>
                <ActionIcon variant="subtle" size="sm" onClick={copy} aria-label="Copy JSON">
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Box>
      <RenderStructurePanel />
      {errorMessage && (
        <Alert color="red" title="API Error" mx="md" mt="sm" variant="light">
          <Text size="xs">{errorMessage}</Text>
        </Alert>
      )}
      <Box className={classes.codeScroll}>
        {isLoading ? (
          <Group justify="center" p="xl">
            <Loader size="sm" />
          </Group>
        ) : data ? (
          <JsonTreeViewer
            data={data}
            selectedId={selectedId}
            onSelectId={(id) => selectNode(id, 'json')}
            scrollToId={scrollToId}
          />
        ) : (
          <Text className="sdui-caption" p="md">
            Loading schema…
          </Text>
        )}
      </Box>
    </Stack>
  );
});
