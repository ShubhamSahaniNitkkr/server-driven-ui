import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SchemaRenderer } from '@/core/renderer/SchemaRenderer';
import { ComponentRegistry } from '@/core/registry/ComponentRegistry';
import permissionsReducer from '@/store/slices/permissionsSlice';
import featureFlagsReducer from '@/store/slices/featureFlagsSlice';
import type { AlertSchema } from '@sdui/shared';

const MockAlert = ({ schema }: { schema: AlertSchema }) => (
  <div data-testid="mock-alert">{(schema as AlertSchema).message}</div>
);

const MockFallback = ({ schema }: { schema: { type: string; id: string } }) => (
  <div data-testid="fallback-component">Unknown: {schema.type}</div>
);

function renderSchema(node: AlertSchema) {
  const store = configureStore({
    reducer: {
      permissions: permissionsReducer,
      featureFlags: featureFlagsReducer,
    },
    preloadedState: {
      permissions: { permissions: [] },
      featureFlags: { flags: {} },
    },
  });

  ComponentRegistry.register('alert', {
    component: MockAlert as never,
    category: 'feedback',
  });
  ComponentRegistry.setFallback(MockFallback as never);

  return render(
    <Provider store={store}>
      <SchemaRenderer
        node={node}
        context={{ pagePath: '/test', depth: 0 }}
        onAction={vi.fn()}
      />
    </Provider>,
  );
}

describe('SchemaRenderer', () => {
  it('renders registered component from schema', () => {
    renderSchema({
      id: 'alert-1',
      type: 'alert',
      message: 'Test alert message',
    });
    expect(screen.getByTestId('mock-alert')).toHaveTextContent('Test alert message');
  });

  it('renders fallback for unknown types', () => {
    renderSchema({
      id: 'unknown-1',
      type: 'unknown-widget',
      message: 'ignored',
    } as never);
    expect(screen.getByTestId('fallback-component')).toBeInTheDocument();
  });
});
