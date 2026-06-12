import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert, Button, Stack } from '@mantine/core';
import { captureException } from '@/lib/sentry';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    captureException(error, { componentStack: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Stack align="center" justify="center" h="100vh" p="xl" gap="md">
          <Alert color="red" title="Application Error" role="alert" variant="light">
            Something went wrong. Please refresh the page.
          </Alert>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </Stack>
      );
    }
    return this.props.children;
  }
}
