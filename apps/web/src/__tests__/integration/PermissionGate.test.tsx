import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PermissionGate } from '@/core/renderer/PermissionGate';
import permissionsReducer from '@/store/slices/permissionsSlice';
import featureFlagsReducer from '@/store/slices/featureFlagsSlice';

function renderWithPermissions(
  permissions: string[],
  flags: Record<string, boolean>,
  ui: React.ReactElement,
) {
  const store = configureStore({
    reducer: {
      permissions: permissionsReducer,
      featureFlags: featureFlagsReducer,
    },
    preloadedState: {
      permissions: { permissions },
      featureFlags: { flags },
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
}

describe('PermissionGate', () => {
  it('renders children when permission is granted', () => {
    renderWithPermissions(
      ['users:read'],
      {},
      <PermissionGate permissions={{ view: 'users:read' }}>
        <span>Visible Content</span>
      </PermissionGate>,
    );
    expect(screen.getByText('Visible Content')).toBeInTheDocument();
  });

  it('hides children when permission is missing', () => {
    renderWithPermissions(
      [],
      {},
      <PermissionGate permissions={{ view: 'users:read' }}>
        <span>Hidden Content</span>
      </PermissionGate>,
    );
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('hides children when feature flag is disabled', () => {
    renderWithPermissions(
      ['users:read'],
      { 'reports.enabled': false },
      <PermissionGate featureFlag="reports.enabled">
        <span>Flagged Content</span>
      </PermissionGate>,
    );
    expect(screen.queryByText('Flagged Content')).not.toBeInTheDocument();
  });
});
