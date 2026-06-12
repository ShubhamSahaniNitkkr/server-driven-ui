import { memo } from 'react';
import { Paper, Text, Title, Group, ThemeIcon, Box, SimpleGrid } from '@mantine/core';
import {
  IconRoute,
  IconApi,
  IconShield,
  IconCircleCheck,
  IconComponents,
  IconBrush,
} from '@tabler/icons-react';
import type { PipelineSchema } from '@sdui/shared';
import type { RegisteredComponentProps } from '@/core/registry/types';
import classes from './PipelineVisualizer.module.css';

const ICONS: Record<string, React.ComponentType<{ size?: number; stroke?: number }>> = {
  route: IconRoute,
  api: IconApi,
  shield: IconShield,
  check: IconCircleCheck,
  registry: IconComponents,
  render: IconBrush,
};

export const PipelineVisualizer = memo(function PipelineVisualizer({
  schema,
}: RegisteredComponentProps) {
  const pipeline = schema as PipelineSchema;

  return (
    <Paper className={classes.root} p="lg" radius="md" withBorder shadow="xs">
      {pipeline.title && <Title order={5}>{pipeline.title}</Title>}
      {pipeline.subtitle && (
        <Text c="dimmed" size="sm" mt="xs" mb="lg">
          {pipeline.subtitle}
        </Text>
      )}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {pipeline.steps.map((step) => {
          const Icon = ICONS[step.icon ?? ''] ?? IconRoute;
          return (
            <Paper key={step.id} className={classes.step} p="md" radius="md" withBorder>
              <Group gap="sm" mb="xs" wrap="nowrap">
                <ThemeIcon size={30} radius="md" variant="light" color="gray">
                  <Icon size={15} stroke={1.5} />
                </ThemeIcon>
                <Box miw={0}>
                  <Text size="sm" fw={500}>{step.label}</Text>
                </Box>
              </Group>
              <Text className="sdui-caption">{step.description}</Text>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Paper>
  );
});
