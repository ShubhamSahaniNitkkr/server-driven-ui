import { memo } from 'react';
import { Paper, Text, Group, ThemeIcon } from '@mantine/core';
import {
  IconUsers,
  IconShoppingCart,
  IconCurrencyDollar,
  IconClock,
  IconShield,
  IconActivity,
  IconTruck,
} from '@tabler/icons-react';
import type { StatCardSchema } from '@sdui/shared';
import { useGetStatQuery } from '@/store/api/dataApi';
import type { RegisteredComponentProps } from '@/core/registry/types';

const ICONS: Record<string, React.ComponentType<{ size?: number; stroke?: number }>> = {
  users: IconUsers,
  'shopping-cart': IconShoppingCart,
  currency: IconCurrencyDollar,
  clock: IconClock,
  shield: IconShield,
  activity: IconActivity,
  truck: IconTruck,
};

export const StatCard = memo(function StatCard({ schema }: RegisteredComponentProps) {
  const stat = schema as StatCardSchema;
  const { data, isLoading } = useGetStatQuery(stat.dataSource);
  const Icon = ICONS[stat.icon ?? ''] ?? IconUsers;

  return (
    <Paper p="md" className="sdui-surface" role="region" aria-label={stat.title} h="100%" withBorder shadow="xs">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <div style={{ minWidth: 0 }}>
          <Text className="sdui-label">{stat.title}</Text>
          <Text size="lg" fw={600} mt={4} lh={1.2} style={{ letterSpacing: '-0.02em' }}>
            {isLoading ? '…' : data?.value?.toLocaleString() ?? '—'}
          </Text>
          {data?.label && <Text className="sdui-caption" mt={2}>{data.label}</Text>}
        </div>
        <ThemeIcon color="gray" variant="light" size={36} radius="md" aria-hidden>
          <Icon size={18} stroke={1.5} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
});
