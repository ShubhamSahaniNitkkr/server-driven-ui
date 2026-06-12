import { getDatabase } from '../db/database.js';

export function getFeatureFlags(): Record<string, boolean> {
  const db = getDatabase();
  const rows = db.prepare('SELECT key, enabled FROM feature_flags').all() as {
    key: string;
    enabled: number;
  }[];

  return Object.fromEntries(rows.map((r) => [r.key, r.enabled === 1]));
}

export function isFeatureEnabled(key: string): boolean {
  const flags = getFeatureFlags();
  return flags[key] ?? false;
}
