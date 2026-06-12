import { memo, useCallback, useMemo } from 'react';
import { NavLink, Stack, ScrollArea } from '@mantine/core';
import {
  IconLayoutDashboard,
  IconUsers,
  IconShoppingCart,
  IconChartBar,
  IconSettings,
  IconSparkles,
} from '@tabler/icons-react';
import { useGetNavigationQuery } from '@/store/api/configApi';
import { focusMainContent } from '@/lib/a11y/focus';

const ICONS: Record<string, React.ComponentType<{ size?: number; stroke?: number }>> = {
  'layout-dashboard': IconLayoutDashboard,
  users: IconUsers,
  'shopping-cart': IconShoppingCart,
  'chart-bar': IconChartBar,
  settings: IconSettings,
  sparkles: IconSparkles,
};

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar = memo(function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const { data: navigation } = useGetNavigationQuery();
  const items = useMemo(() => navigation?.items ?? [], [navigation]);

  const handleNavigate = useCallback(
    (path: string) => {
      onNavigate(path);
      focusMainContent();
    },
    [onNavigate],
  );

  return (
    <ScrollArea h="100%" type="auto">
      <Stack gap={2} p="md" component="nav" aria-label="Main navigation">
        <span className="sdui-label" style={{ padding: '0 10px 10px' }}>
          Navigation
        </span>
        {items.map((item) => {
          const Icon = ICONS[item.icon ?? ''] ?? IconLayoutDashboard;
          const active = currentPath === item.path;
          return (
            <NavLink
              key={item.id}
              label={item.label}
              leftSection={<Icon size={17} stroke={1.5} />}
              active={active}
              onClick={() => handleNavigate(item.path)}
              aria-current={active ? 'page' : undefined}
              data-testid={`nav-${item.id}`}
              styles={{
                root: { fontWeight: active ? 500 : 400 },
                label: { fontSize: 'var(--sdui-text-sm)' },
              }}
            />
          );
        })}
      </Stack>
    </ScrollArea>
  );
});
