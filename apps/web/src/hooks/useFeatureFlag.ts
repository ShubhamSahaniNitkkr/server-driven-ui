import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { isFeatureEnabled } from '@/features/feature-flags/featureFlagUtils';

export function useFeatureFlag(flag?: string): boolean {
  const flags = useSelector((state: RootState) => state.featureFlags.flags);
  return isFeatureEnabled(flags, flag);
}

export function useFeatureFlags(): Record<string, boolean> {
  return useSelector((state: RootState) => state.featureFlags.flags);
}
