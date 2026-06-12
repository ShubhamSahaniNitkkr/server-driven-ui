import type Database from 'better-sqlite3';

const SAMPLE_ORDERS = [
  { id: 'ord-001', customer: 'Acme Corp', product: 'Enterprise License', amount: 4999, status: 'delivered' },
  { id: 'ord-002', customer: 'Globex Inc', product: 'Pro Plan', amount: 1299, status: 'shipped' },
  { id: 'ord-003', customer: 'Initech', product: 'Starter Plan', amount: 299, status: 'processing' },
  { id: 'ord-004', customer: 'Umbrella Co', product: 'Enterprise License', amount: 4999, status: 'pending' },
  { id: 'ord-005', customer: 'Stark Industries', product: 'Pro Plan', amount: 1299, status: 'delivered' },
  { id: 'ord-006', customer: 'Wayne Enterprises', product: 'Custom Integration', amount: 8999, status: 'processing' },
  { id: 'ord-007', customer: 'Oscorp', product: 'Starter Plan', amount: 299, status: 'cancelled' },
  { id: 'ord-008', customer: 'Cyberdyne', product: 'Pro Plan', amount: 1299, status: 'shipped' },
];

export function seedOrders(db: Database.Database): void {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO orders (id, customer, product, amount, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const order of SAMPLE_ORDERS) {
    insert.run(order.id, order.customer, order.product, order.amount, order.status);
  }
}
