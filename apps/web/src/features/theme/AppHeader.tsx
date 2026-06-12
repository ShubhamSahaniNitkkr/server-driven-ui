import { memo, useCallback } from 'react';
import { Group, Text, ActionIcon, Burger, Menu, Badge, Box } from '@mantine/core';
import { IconSun, IconMoon, IconLogout } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleThemeMode } from '@/store/slices/themeSlice';
import { clearCredentials } from '@/store/slices/userSlice';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { useLogoutMutation } from '@/store/api/authApi';
import type { RootState } from '@/store';

export const AppHeader = memo(function AppHeader() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const user = useSelector((state: RootState) => state.user.profile);
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const [logout] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearCredentials());
    }
  }, [logout, dispatch]);

  return (
    <Group h="100%" px={{ base: 'sm', sm: 'lg' }} justify="space-between" wrap="nowrap">
      <Group gap="sm" wrap="nowrap" miw={0}>
        <Burger
          opened={sidebarOpen}
          onClick={() => dispatch(toggleSidebar())}
          hiddenFrom="sm"
          size="sm"
          aria-label="Toggle navigation"
        />
        <Box miw={0}>
          <Text fw={600} size="sm" truncate>
            {theme.brandName}
          </Text>
          <Box visibleFrom="sm">
            <Text className="sdui-caption">Server Driven UI</Text>
          </Box>
        </Box>
      </Group>
      <Group gap={6} wrap="nowrap">
        {user && (
          <Badge variant="outline" color="gray" size="sm">
            {user.role}
          </Badge>
        )}
        <ActionIcon
          size="md"
          onClick={() => dispatch(toggleThemeMode())}
          aria-label={theme.mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme.mode === 'light' ? <IconMoon size={17} /> : <IconSun size={17} />}
        </ActionIcon>
        <Menu position="bottom-end" shadow="md">
          <Menu.Target>
            <ActionIcon size="md" aria-label="User menu">
              <IconLogout size={17} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{user?.email}</Menu.Label>
            <Menu.Item leftSection={<IconLogout size={14} />} onClick={handleLogout}>
              Sign out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
});
