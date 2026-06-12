import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { PermissionRequirement } from '@sdui/shared';
import type { RootState } from '@/store';
import { hasPermission, meetsRequirements } from '@/features/permissions/permissionUtils';

export function usePermission() {
  const permissions = useSelector((state: RootState) => state.permissions.permissions);

  const check = useCallback(
    (permission?: string) => hasPermission(permissions, permission),
    [permissions],
  );

  const checkRequirements = useCallback(
    (requirements?: PermissionRequirement) => meetsRequirements(permissions, requirements),
    [permissions],
  );

  return useMemo(
    () => ({
      permissions,
      hasPermission: check,
      meetsRequirements: checkRequirements,
    }),
    [permissions, check, checkRequirements],
  );
}
