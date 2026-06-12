import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  meetsRequirements,
  canView,
} from '@/features/permissions/permissionUtils';

describe('permissionUtils', () => {
  const permissions = ['users:read', 'users:create', 'orders:read'];

  it('hasPermission returns true for existing permission', () => {
    expect(hasPermission(permissions, 'users:read')).toBe(true);
  });

  it('hasPermission returns false for missing permission', () => {
    expect(hasPermission(permissions, 'users:delete')).toBe(false);
  });

  it('meetsRequirements passes when any requirement matches', () => {
    expect(
      meetsRequirements(permissions, {
        view: 'users:read',
        delete: 'users:delete',
      }),
    ).toBe(true);
  });

  it('canView checks view permission specifically', () => {
    expect(canView(permissions, { view: 'users:read' })).toBe(true);
    expect(canView(permissions, { view: 'users:delete' })).toBe(false);
  });
});
