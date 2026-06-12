import { memo, useMemo } from 'react';
import { Paper, Text, Title, Group, RingProgress, Stack, SimpleGrid, ThemeIcon } from '@mantine/core';
import { IconTruck } from '@tabler/icons-react';
import type { WorkflowBoardSchema } from '@sdui/shared';
import { useGetWorkflowQuery } from '@/store/api/dataApi';
import type { RegisteredComponentProps } from '@/core/registry/types';
import classes from './WorkflowBoard.module.css';

const COLORS: Record<string, string> = {
  yellow: 'yellow',
  blue: 'blue',
  indigo: 'indigo',
  teal: 'teal',
  red: 'red',
  orange: 'orange',
  grape: 'grape',
};

export const WorkflowBoard = memo(function WorkflowBoard({ schema }: RegisteredComponentProps) {
  const board = schema as WorkflowBoardSchema;
  const { data = [], isLoading } = useGetWorkflowQuery(board.dataSource);

  const stageMap = useMemo(() => {
    const map = new Map<string, { count: number; percentage: number }>();
    for (const item of data) {
      map.set(item.status as string, {
        count: item.count as number,
        percentage: item.percentage as number,
      });
    }
    return map;
  }, [data]);

  const total = useMemo(() => data.reduce((sum, d) => sum + (d.count as number), 0), [data]);

  return (
    <Paper className={classes.root} p="lg" radius="md" withBorder shadow="xs">
      <Group justify="space-between" mb="lg">
        <div>
          {board.title && <Title order={5}>{board.title}</Title>}
          <Text size="sm" c="dimmed" mt={4}>
            {total} orders across fulfillment stages
          </Text>
        </div>
        <ThemeIcon size={36} radius="md" variant="light" color="gray">
          <IconTruck size={18} stroke={1.5} />
        </ThemeIcon>
      </Group>
      <SimpleGrid cols={{ base: 2, sm: 3, md: Math.min(board.stages.length, 5) }} spacing="md">
        {board.stages.map((stage) => {
          const stats = stageMap.get(stage.status) ?? { count: 0, percentage: 0 };
          const color = COLORS[stage.color ?? 'blue'] ?? 'blue';
          return (
            <Paper key={stage.id} className={classes.stage} p="md" radius="md" withBorder>
              <Stack align="center" gap="xs">
                <RingProgress
                  size={80}
                  thickness={8}
                  roundCaps
                  sections={[{ value: stats.percentage, color }]}
                  label={
                    <Text ta="center" size="xs" fw={700}>
                      {isLoading ? '…' : `${stats.percentage}%`}
                    </Text>
                  }
                />
                <Text fw={600} size="sm" tt="capitalize">{stage.label}</Text>
                <Text size="xl" fw={700}>{isLoading ? '—' : stats.count}</Text>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Paper>
  );
});
