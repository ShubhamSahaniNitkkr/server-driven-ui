import { memo, useMemo } from 'react';
import {
  Paper,
  Text,
  Badge,
  Group,
  Stack,
  Tabs,
  ThemeIcon,
  Loader,
  SimpleGrid,
} from '@mantine/core';
import { IconShield, IconEyeOff } from '@tabler/icons-react';
import type { RoleMatrixSchema, PageSchema } from '@sdui/shared';
import { ROLES } from '@sdui/shared';
import { useGetSchemaPreviewQuery } from '@/store/api/schemaApi';
import type { RegisteredComponentProps } from '@/core/registry/types';
import classes from './RoleMatrix.module.css';

function extractCapabilities(page: PageSchema | undefined) {
  if (!page) return { actions: [], components: 0 };
  const actions = (page.actions ?? []).map((a) => a.label);
  const countComponents = (node: unknown): number => {
    if (!node || typeof node !== 'object') return 0;
    let n = 1;
    const obj = node as Record<string, unknown>;
    if (Array.isArray(obj.children)) for (const c of obj.children) n += countComponents(c);
    if (Array.isArray(obj.widgets)) for (const w of obj.widgets) n += countComponents(w);
    return n;
  };
  return { actions, components: countComponents(page.layout) };
}

function RolePanel({ path, role }: { path: string; role: string }) {
  const { data, isLoading } = useGetSchemaPreviewQuery({ path, role });
  const caps = useMemo(() => extractCapabilities(data), [data]);

  if (isLoading) {
    return (
      <Group justify="center" p="xl">
        <Loader size="sm" />
      </Group>
    );
  }

  return (
    <Stack gap="md" p="sm">
      <SimpleGrid cols={2} spacing="xs">
        <Paper className={classes.stat} p="sm" radius="md" withBorder>
          <Text className="sdui-label">Actions visible</Text>
          <Text size="xl" fw={700} mt={4}>{caps.actions.length}</Text>
        </Paper>
        <Paper className={classes.stat} p="sm" radius="md" withBorder>
          <Text className="sdui-label">Components</Text>
          <Text size="xl" fw={700} mt={4}>{caps.components}</Text>
        </Paper>
      </SimpleGrid>
      <div>
        <Text className="sdui-label" mb="xs">Buttons in schema</Text>
        {caps.actions.length === 0 ? (
          <Group gap={6}>
            <IconEyeOff size={14} color="gray" />
            <Text size="sm" c="dimmed">No actions — read-only role</Text>
          </Group>
        ) : (
          <Group gap={6}>
            {caps.actions.map((label) => (
              <Badge key={label} variant="outline" color="gray">{label}</Badge>
            ))}
          </Group>
        )}
      </div>
      <Text className="sdui-caption">
        GET /api/v1/schemas/preview?path={path}&role={role}
      </Text>
    </Stack>
  );
}

export const RoleMatrix = memo(function RoleMatrix({ schema }: RegisteredComponentProps) {
  const matrix = schema as RoleMatrixSchema;

  return (
    <Stack gap="sm" data-testid={matrix.meta?.testId}>
      <Group gap="xs">
        <ThemeIcon size="sm" variant="light" color="gray">
          <IconShield size={14} />
        </ThemeIcon>
        <Text size="sm" c="dimmed">
          Comparing <strong>{matrix.demoPath}</strong> across all roles
        </Text>
      </Group>
      <Tabs variant="outline" radius="md">
        <Tabs.List>
          {ROLES.map((role) => (
            <Tabs.Tab key={role} value={role}>{role}</Tabs.Tab>
          ))}
        </Tabs.List>
        {ROLES.map((role) => (
          <Tabs.Panel key={role} value={role} pt="md">
            <RolePanel path={matrix.demoPath} role={role} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  );
});
