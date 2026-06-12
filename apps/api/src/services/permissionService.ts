import type { PermissionRequirement } from '@sdui/shared';
import { getUserPermissions } from '../middleware/rbac.js';

export function hasPermission(
  userPermissions: string[],
  permission?: string,
): boolean {
  if (!permission) return true;
  return userPermissions.includes(permission);
}

export function meetsRequirements(
  userPermissions: string[],
  requirements?: PermissionRequirement,
): boolean {
  if (!requirements) return true;

  const checks = [
    requirements.view,
    requirements.edit,
    requirements.delete,
    requirements.create,
    requirements.execute,
  ].filter(Boolean) as string[];

  if (checks.length === 0) return true;
  return checks.some((p) => userPermissions.includes(p));
}

export function filterByPermissions<T extends { permissions?: PermissionRequirement }>(
  items: T[],
  role: string,
): T[] {
  const userPermissions = getUserPermissions(role);
  return items.filter((item) => meetsRequirements(userPermissions, item.permissions));
}
