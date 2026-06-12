import { describe, it, expect } from 'vitest';
import { hasPermission, meetsRequirements } from '../services/permissionService.js';

describe('permissionService', () => {
  const permissions = ['users:read', 'users:create', 'orders:read'];

  it('hasPermission returns true when permission exists', () => {
    expect(hasPermission(permissions, 'users:read')).toBe(true);
  });

  it('hasPermission returns false when permission missing', () => {
    expect(hasPermission(permissions, 'users:delete')).toBe(false);
  });

  it('hasPermission returns true when no permission required', () => {
    expect(hasPermission(permissions, undefined)).toBe(true);
  });

  it('meetsRequirements passes when any requirement matches', () => {
    expect(meetsRequirements(permissions, { view: 'users:read', delete: 'users:delete' })).toBe(true);
  });

  it('meetsRequirements fails when no requirements match', () => {
    expect(meetsRequirements(permissions, { delete: 'users:delete' })).toBe(false);
  });

  it('meetsRequirements passes with no requirements', () => {
    expect(meetsRequirements(permissions, undefined)).toBe(true);
  });
});
