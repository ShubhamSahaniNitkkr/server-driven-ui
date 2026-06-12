import type Database from 'better-sqlite3';

export const DEFAULT_FEATURE_FLAGS = [
  { key: 'reports.enabled', enabled: true, description: 'Enable Reports module' },
  { key: 'exports.enabled', enabled: false, description: 'Enable data exports' },
  { key: 'beta.features', enabled: true, description: 'Enable beta features' },
  { key: 'dashboard.charts', enabled: true, description: 'Enable dashboard charts' },
];

export function seedFeatureFlags(db: Database.Database): void {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO feature_flags (key, enabled, description)
    VALUES (?, ?, ?)
  `);

  for (const flag of DEFAULT_FEATURE_FLAGS) {
    insert.run(flag.key, flag.enabled ? 1 : 0, flag.description);
  }
}
