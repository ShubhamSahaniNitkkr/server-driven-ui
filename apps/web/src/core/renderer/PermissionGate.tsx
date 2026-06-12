import { memo, type ReactNode } from 'react';
import type { PermissionRequirement } from '@sdui/shared';
import { usePermission } from '@/hooks/usePermission';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

interface PermissionGateProps {
  permissions?: PermissionRequirement;
  featureFlag?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate = memo(function PermissionGate({
  permissions,
  featureFlag,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { meetsRequirements } = usePermission();
  const isEnabled = useFeatureFlag(featureFlag);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  if (!meetsRequirements(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
});
