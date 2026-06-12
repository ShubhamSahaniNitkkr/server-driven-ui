import type { PermissionRequirement } from '@sdui/shared';

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
  mode: 'any' | 'all' = 'any',
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

  if (mode === 'all') {
    return checks.every((p) => userPermissions.includes(p));
  }

  return checks.some((p) => userPermissions.includes(p));
}

export function canView(
  userPermissions: string[],
  requirements?: PermissionRequirement,
): boolean {
  if (!requirements?.view) return meetsRequirements(userPermissions, requirements);
  return hasPermission(userPermissions, requirements.view);
}
