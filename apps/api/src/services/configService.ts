import type { RuntimeConfig } from '@sdui/shared';
import { getDatabase } from '../db/database.js';
import { getUserPermissions } from '../middleware/rbac.js';
import { getFeatureFlags } from './featureFlagService.js';

export function getRuntimeConfig(role: string): RuntimeConfig {
  const db = getDatabase();
  const themeRow = db
    .prepare("SELECT value FROM app_settings WHERE key = 'theme'")
    .get() as { value: string } | undefined;

  const theme = themeRow
    ? JSON.parse(themeRow.value)
    : {
        defaultMode: 'light' as const,
        primaryColor: 'blue',
        brand: { name: 'SDUI Platform' },
      };

  return {
    theme,
    featureFlags: getFeatureFlags(),
    permissions: getUserPermissions(role),
  };
}
