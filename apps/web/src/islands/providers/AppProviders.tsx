import { memo, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MantineProvider, localStorageColorSchemeManager } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { store } from '@/store';
import { appTheme } from '@/lib/theme';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import '@/styles/global.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'sdui-mantine-color-scheme',
});

function ThemedMantineProvider({ children }: { children: ReactNode }) {
  const { mode, primaryColor } = useSelector((state: RootState) => state.theme);

  return (
    <MantineProvider
      theme={{ ...appTheme, primaryColor: (primaryColor as 'blue') ?? 'blue' }}
      defaultColorScheme={mode}
      colorSchemeManager={colorSchemeManager}
    >
      <DatesProvider settings={{ consistentWeeks: true }}>
        <Notifications position="top-right" zIndex={10000} />
        {children}
      </DatesProvider>
    </MantineProvider>
  );
}

export const AppProviders = memo(function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Provider store={store}>
      <ThemedMantineProvider>{children}</ThemedMantineProvider>
    </Provider>
  );
});
