import type Database from 'better-sqlite3';

export const DEFAULT_SETTINGS = {
  theme: {
    defaultMode: 'light',
    primaryColor: 'blue',
    brand: {
      name: 'SDUI Platform',
      logo: '/logo.svg',
    },
  },
};

export function seedSettings(db: Database.Database): void {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO app_settings (key, value)
    VALUES (?, ?)
  `);
  insert.run('theme', JSON.stringify(DEFAULT_SETTINGS.theme));
}
