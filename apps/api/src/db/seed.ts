import bcrypt from 'bcryptjs';
import { getDatabase } from './database.js';
import { seedFeatureFlags } from '../data/featureFlags.js';
import { seedFormSchemas } from '../data/formSchemas.js';
import { seedPageSchemas } from '../data/pageSchemas.js';
import { seedSettings } from '../data/settings.js';
import { seedOrders } from '../data/orders.js';

const DEMO_USERS = [
  { id: 'user-admin', email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: 'user-manager', email: 'manager@example.com', password: 'manager123', name: 'Manager User', role: 'manager' },
  { id: 'user-regular', email: 'user@example.com', password: 'user123', name: 'Regular User', role: 'user' },
  { id: 'user-viewer', email: 'viewer@example.com', password: 'viewer123', name: 'Viewer User', role: 'viewer' },
];

function seedUsers(db: ReturnType<typeof getDatabase>): void {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, name, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const user of DEMO_USERS) {
    const hash = bcrypt.hashSync(user.password, 10);
    insert.run(user.id, user.email, hash, user.name, user.role);
  }
}

function main(): void {
  const db = getDatabase();

  console.log('Seeding database...');
  seedUsers(db);
  seedOrders(db);
  seedFeatureFlags(db);
  seedPageSchemas(db);
  seedFormSchemas(db);
  seedSettings(db);
  console.log('Database seeded successfully.');
  console.log('\nDemo credentials:');
  for (const u of DEMO_USERS) {
    console.log(`  ${u.role.padEnd(8)} → ${u.email} / ${u.password}`);
  }
}

main();
