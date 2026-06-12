import { memo, useMemo } from 'react';
import { Paper, Text, Stack, Group, Progress, Box } from '@mantine/core';
import type { ChartSchema } from '@sdui/shared';
import { useGetChartDataQuery } from '@/store/api/dataApi';
import type { RegisteredComponentProps } from '@/core/registry/types';

const COLORS = ['blue', 'teal', 'grape', 'orange', 'red'];

export const ChartWidget = memo(function ChartWidget({ schema }: RegisteredComponentProps) {
  const chart = schema as ChartSchema;
  const { data = [], isLoading, isError } = useGetChartDataQuery(chart.dataSource);

  const xKey = chart.xKey ?? 'month';
  const yKey = chart.yKey ?? 'revenue';

  const rows = useMemo(
    () => (data as Record<string, unknown>[]).filter((r) => r[yKey] !== undefined),
    [data, yKey],
  );

  const maxVal = useMemo(
    () => Math.max(...rows.map((r) => Number(r[yKey]) || 0), 1),
    [rows, yKey],
  );

  if (isLoading) {
    return (
      <Paper p="md" withBorder radius="md">
        <Text c="dimmed" size="sm">Loading chart...</Text>
      </Paper>
    );
  }

  if (isError || rows.length === 0) {
    return (
      <Paper p="md" withBorder radius="md" h="100%">
        {chart.title && <Text fw={600} mb="xs" size="sm">{chart.title}</Text>}
        <Text c="dimmed" size="sm">Chart data unavailable</Text>
      </Paper>
    );
  }

  if (chart.chartType === 'pie') {
    const total = rows.reduce((s, r) => s + Number(r.value ?? r[yKey] ?? 0), 0);
    return (
      <Paper p="md" withBorder radius="md" h="100%">
        {chart.title && <Text fw={600} mb="md" size="sm">{chart.title}</Text>}
        <Stack gap="sm">
          {rows.map((r, i) => {
            const val = Number(r.value ?? r[yKey] ?? 0);
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            return (
              <Box key={String(r.name ?? r[xKey] ?? i)}>
                <Group justify="space-between" mb={4}>
                  <Text size="sm">{String(r.name ?? r[xKey])}</Text>
                  <Text size="sm" fw={600}>{val} ({pct}%)</Text>
                </Group>
                <Progress value={pct} color={COLORS[i % COLORS.length]} size="md" radius="xl" />
              </Box>
            );
          })}
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper p="md" withBorder radius="md" h="100%">
      {chart.title && <Text fw={600} mb="md" size="sm">{chart.title}</Text>}
      <Stack gap="md">
        {rows.map((r, i) => {
          const val = Number(r[yKey]) || 0;
          const label = String(r[xKey] ?? `Item ${i + 1}`);
          return (
            <Box key={label}>
              <Group justify="space-between" mb={4}>
                <Text size="sm">{label}</Text>
                <Text size="sm" fw={600}>
                  {yKey === 'revenue' ? `$${val.toLocaleString()}` : val.toLocaleString()}
                </Text>
              </Group>
              <Progress value={(val / maxVal) * 100} color="blue" size="lg" radius="xl" />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
});
