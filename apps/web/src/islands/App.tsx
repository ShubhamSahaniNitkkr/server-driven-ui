import { memo, useEffect } from 'react';
import { AppShell, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { AppProviders } from './providers/AppProviders';
import { AppErrorBoundary } from '@/components/feedback/ErrorBoundary/AppErrorBoundary';
import { LoginPage } from '@/features/auth/LoginPage';
import { PageSplitView } from '@/core/routing/PageSplitView';
import { Sidebar } from '@/components/navigation/Sidebar/Sidebar';
import { AppHeader } from '@/features/theme/AppHeader';
import { FormModal } from '@/components/feedback/Modal/FormModal';
import { useAppBootstrap } from '@/hooks/useAppBootstrap';
import { usePagePath } from '@/core/routing/usePagePath';
import { registerComponents } from '@/core/registry/registerComponents';
import { initSentry } from '@/lib/sentry';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import type { RootState } from '@/store';

registerComponents();
initSentry();

interface AppProps {
  initialPath?: string;
}

const AppContent = memo(function AppContent({ initialPath }: AppProps) {
  const { isAuthenticated, isReady } = useAppBootstrap();
  const { path, navigate, setInitialPath } = usePagePath();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const isMobile = useMediaQuery('(max-width: 992px)');

  useEffect(() => {
    if (initialPath) setInitialPath(initialPath);
  }, [initialPath, setInitialPath]);

  if (!isAuthenticated) return <LoginPage />;
  if (!isReady) return null;

  return (
    <AppShell
      header={{ height: 52 }}
      navbar={{
        width: 248,
        breakpoint: 'md',
        collapsed: { mobile: !sidebarOpen, desktop: false },
      }}
      padding={{ base: 'xs', sm: 'md' }}
    >
      <AppShell.Header className="app-header">
        <AppHeader />
      </AppShell.Header>
      <AppShell.Navbar p={0} className="app-header" style={{ borderRight: 'var(--sdui-border)' }}>
        <Sidebar
          currentPath={path}
          onNavigate={(p) => {
            navigate(p);
            if (isMobile) dispatch(setSidebarOpen(false));
          }}
        />
      </AppShell.Navbar>
      <AppShell.Main className="app-main">
        <Box maw="100%" mx="auto" w="100%">
          <PageSplitView path={path} />
        </Box>
      </AppShell.Main>
      <FormModal />
    </AppShell>
  );
});

export default function App({ initialPath }: AppProps) {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <AppContent initialPath={initialPath} />
      </AppProviders>
    </AppErrorBoundary>
  );
}
