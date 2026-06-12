import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert } from '@mantine/core';
import { captureException } from '@/lib/sentry';

interface Props {
  children: ReactNode;
  componentId: string;
  componentType: string;
}

interface State {
  hasError: boolean;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    captureException(error, {
      componentId: this.props.componentId,
      componentType: this.props.componentType,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert color="red" title="Component Error" role="alert" variant="light">
          Failed to render <strong>{this.props.componentType}</strong> ({this.props.componentId})
        </Alert>
      );
    }
    return this.props.children;
  }
}
