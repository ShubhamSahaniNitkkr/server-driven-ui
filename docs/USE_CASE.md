# Flagship Use Case: Order Fulfillment Command Center

## Business Problem

**Acme Corp** runs an internal operations platform. Different teams need different capabilities on the same `/orders` page:

| Role    | Needs                                              |
|---------|----------------------------------------------------|
| Admin   | Create orders, approve batches, export CSV         |
| Manager | Approve pending orders, view pipeline            |
| User    | Create orders only                                 |
| Viewer  | Read-only table — no buttons                     |

Traditional approach: `if (role === 'admin')` scattered across 20 React files.

**SDUI approach:** One page schema in the database. Server filters JSON per role. Frontend has zero role checks for page structure.

---

## How It Works (Step by Step)

### 1. User navigates to `/orders`

The Astro catch-all route loads the React runtime. No `OrdersPage.tsx` exists.

### 2. Frontend fetches schema

```
GET /api/v1/schemas/page?path=/orders
Authorization: Bearer <jwt>
```

### 3. Server loads full schema from SQLite

File: `apps/api/src/data/ordersPageSchema.ts`

Contains: stat cards, workflow board, data table, 3 action buttons — each with `permissions` and optional `featureFlag`.

### 4. Server filters schema for JWT role

File: `apps/api/src/services/schemaService.ts` → `filterPageSchema()`

- **Viewer** receives schema **without** `Create Order`, `Approve Pending`, `Export CSV` actions
- **Admin** receives all actions (Export only if `exports.enabled` flag is true)
- Components with `permissions: { view: 'orders:read' }` stay; unauthorized nodes are removed

### 5. Frontend validates & renders

```
PageSchema → SchemaRenderer → ComponentRegistry
  type: "table"     → DataTable
  type: "stat-card" → StatCard
  type: "workflow-board" → WorkflowBoard
```

`PermissionGate` is a second client-side layer (defense in depth).

### 6. Data loads independently

Table fetches `GET /api/v1/data/orders` via RTK Query — server state, not Redux slices.

---

## See It Live: SDUI Studio (`/showcase`)

After login, you land on **SDUI Live Studio** — also 100% schema-driven.

| Component          | What it shows                                      |
|--------------------|----------------------------------------------------|
| `pipeline`         | 6-step rendering pipeline visualization            |
| `schema-explorer`  | Live JSON returned by API for `/orders`            |
| `role-matrix`      | Compare actions/components per role (admin vs viewer) |
| `workflow-board`   | Order pipeline from API + layout from schema       |

---

## Try the Demo

1. Login as **admin@example.com** → visit `/orders` → see 3 action buttons
2. Logout → login as **viewer@example.com** → visit `/orders` → buttons gone
3. Open **SDUI Studio** → Role Matrix tab → compare Admin vs Viewer counts
4. Enable export: `UPDATE feature_flags SET enabled=1 WHERE key='exports.enabled'` → refresh → Export appears

**No frontend code changed. Only server schema + permissions.**
