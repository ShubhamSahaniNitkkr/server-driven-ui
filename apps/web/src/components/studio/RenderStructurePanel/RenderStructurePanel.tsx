import { memo, useMemo } from 'react';
import { Text, Badge, Group, Stack, Breadcrumbs, Anchor, Box, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useSchemaSelection } from '@/contexts/SchemaSelectionContext';
import classes from './RenderStructurePanel.module.css';

export const RenderStructurePanel = memo(function RenderStructurePanel() {
  const { selectedId, index, selectNode, clearSelection } = useSchemaSelection();
  const entry = selectedId ? index.get(selectedId) : undefined;

  const breadcrumbItems = useMemo(() => {
    if (!entry) return [];
    return [
      ...entry.ancestors.map((a) => (
        <Anchor key={a.id} size="xs" c="dimmed" onClick={() => selectNode(a.id, 'json')} className={classes.crumb}>
          {a.label}
        </Anchor>
      )),
      <Text key={entry.id} size="xs" fw={500} span c="dimmed">
        {entry.label}
      </Text>,
    ];
  }, [entry, selectNode]);

  if (!entry) {
    return (
      <Box className={classes.empty}>
        <Text className="sdui-label" mb={4}>
          Inspector
        </Text>
        <Text className="sdui-caption">
          Select a schema node or UI element to view its render path.
        </Text>
      </Box>
    );
  }

  return (
    <Box className={classes.panel}>
      <Group justify="space-between" mb="xs" wrap="nowrap">
        <Text className="sdui-label">Inspector</Text>
        <ActionIcon variant="subtle" size="sm" onClick={clearSelection} aria-label="Clear selection">
          <IconX size={14} />
        </ActionIcon>
      </Group>
      <Breadcrumbs separator="/" className={classes.breadcrumbs}>
        {breadcrumbItems}
      </Breadcrumbs>
      <Stack gap="sm" mt="sm">
        <Group gap={6} wrap="wrap">
          <Badge variant="outline" color="gray" size="sm">
            {entry.type}
          </Badge>
          <Text className="sdui-mono" c="dimmed" size="xs">
            {entry.id}
          </Text>
          {entry.isFallback && (
            <Badge variant="light" color="orange" size="sm">
              fallback
            </Badge>
          )}
        </Group>
        <Box className={classes.flow}>
          <Text className="sdui-caption" mb={6}>
            Resolution
          </Text>
          <Text size="xs" c="dimmed" className={classes.flowText}>
            <span className={classes.mono}>{entry.type}</span>
            <span className={classes.arrow}> → </span>
            <span className={classes.mono}>Registry.resolve()</span>
            <span className={classes.arrow}> → </span>
            <span className={classes.mono}>&lt;{entry.registryComponent} /&gt;</span>
          </Text>
        </Box>
        <Text className="sdui-caption">
          Path <code className={classes.code}>{entry.jsonPath}</code>
        </Text>
        {entry.childIds.length > 0 && (
          <div>
            <Text className="sdui-caption" mb={6}>
              Children
            </Text>
            <Group gap={4} wrap="wrap">
              {entry.childIds.map((childId) => {
                const child = index.get(childId);
                return (
                  <Badge
                    key={childId}
                    size="sm"
                    variant="outline"
                    color="gray"
                    className={classes.childBadge}
                    onClick={() => selectNode(childId, 'json')}
                  >
                    {child?.type ?? childId}
                  </Badge>
                );
              })}
            </Group>
          </div>
        )}
      </Stack>
    </Box>
  );
});
