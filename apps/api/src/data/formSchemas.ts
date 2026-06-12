import type Database from 'better-sqlite3';
import type { FormSchema } from '@sdui/shared';

export const FORM_SCHEMAS: Record<string, FormSchema> = {
  'form-create-user': {
    id: 'form-create-user',
    type: 'form',
    title: 'Create User',
    description: 'Add a new user to the system',
    fields: [
      {
        id: 'field-name',
        type: 'text-input',
        name: 'name',
        label: 'Full Name',
        placeholder: 'Enter full name',
        validation: { required: true, minLength: 2 },
        meta: { ariaLabel: 'Full name' },
      },
      {
        id: 'field-email',
        type: 'text-input',
        name: 'email',
        label: 'Email',
        placeholder: 'user@example.com',
        validation: { required: true, email: true },
        meta: { ariaLabel: 'Email address' },
      },
      {
        id: 'field-role',
        type: 'select',
        name: 'role',
        label: 'Role',
        options: [
          { value: 'admin', label: 'Admin' },
          { value: 'manager', label: 'Manager' },
          { value: 'user', label: 'User' },
          { value: 'viewer', label: 'Viewer' },
        ],
        validation: { required: true },
      },
      {
        id: 'field-password',
        type: 'text-input',
        name: 'password',
        label: 'Password',
        placeholder: 'Minimum 6 characters',
        validation: { required: true, minLength: 6 },
      },
    ],
    submitLabel: 'Create User',
    submitAction: {
      type: 'api',
      method: 'POST',
      endpoint: '/api/v1/data/users',
    },
    permissions: { execute: 'users:create' },
  },
  'form-edit-user': {
    id: 'form-edit-user',
    type: 'form',
    title: 'Edit User',
    fields: [
      {
        id: 'field-name',
        type: 'text-input',
        name: 'name',
        label: 'Full Name',
        validation: { required: true },
      },
      {
        id: 'field-email',
        type: 'text-input',
        name: 'email',
        label: 'Email',
        validation: { required: true, email: true },
      },
      {
        id: 'field-role',
        type: 'select',
        name: 'role',
        label: 'Role',
        options: [
          { value: 'admin', label: 'Admin' },
          { value: 'manager', label: 'Manager' },
          { value: 'user', label: 'User' },
          { value: 'viewer', label: 'Viewer' },
        ],
        validation: { required: true },
      },
    ],
    submitLabel: 'Save Changes',
    submitAction: {
      type: 'api',
      method: 'PUT',
      endpoint: '/api/v1/data/users',
    },
    permissions: { execute: 'users:update' },
  },
  'form-create-order': {
    id: 'form-create-order',
    type: 'form',
    title: 'Create Order',
    fields: [
      {
        id: 'field-customer',
        type: 'text-input',
        name: 'customer',
        label: 'Customer',
        validation: { required: true },
      },
      {
        id: 'field-product',
        type: 'select',
        name: 'product',
        label: 'Product',
        options: [
          { value: 'Starter Plan', label: 'Starter Plan' },
          { value: 'Pro Plan', label: 'Pro Plan' },
          { value: 'Enterprise License', label: 'Enterprise License' },
          { value: 'Custom Integration', label: 'Custom Integration' },
        ],
        validation: { required: true },
      },
      {
        id: 'field-amount',
        type: 'number-input',
        name: 'amount',
        label: 'Amount',
        validation: { required: true, min: 0 },
      },
      {
        id: 'field-status',
        type: 'select',
        name: 'status',
        label: 'Status',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'processing', label: 'Processing' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' },
        ],
        defaultValue: 'pending',
      },
    ],
    submitLabel: 'Create Order',
    submitAction: {
      type: 'api',
      method: 'POST',
      endpoint: '/api/v1/data/orders',
    },
    permissions: { execute: 'orders:create' },
  },
  'form-settings': {
    id: 'form-settings',
    type: 'form',
    title: 'Application Settings',
    description: 'Configure application behavior',
    fields: [
      {
        id: 'field-brand-name',
        type: 'text-input',
        name: 'brandName',
        label: 'Brand Name',
        validation: { required: true },
      },
      {
        id: 'field-primary-color',
        type: 'select',
        name: 'primaryColor',
        label: 'Primary Color',
        options: [
          { value: 'blue', label: 'Blue' },
          { value: 'indigo', label: 'Indigo' },
          { value: 'teal', label: 'Teal' },
          { value: 'grape', label: 'Grape' },
        ],
      },
      {
        id: 'field-default-mode',
        type: 'radio',
        name: 'defaultMode',
        label: 'Default Theme Mode',
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ],
      },
      {
        id: 'field-notifications',
        type: 'checkbox',
        name: 'enableNotifications',
        label: 'Enable Notifications',
        defaultValue: true,
      },
      {
        id: 'field-description',
        type: 'textarea',
        name: 'description',
        label: 'Description',
        placeholder: 'Optional application description',
      },
    ],
    submitLabel: 'Save Settings',
    submitAction: {
      type: 'api',
      method: 'PUT',
      endpoint: '/api/v1/data/settings',
    },
    permissions: { execute: 'settings:update' },
  },
};

export function seedFormSchemas(db: Database.Database): void {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO form_schemas (id, schema_json)
    VALUES (?, ?)
  `);

  for (const [id, schema] of Object.entries(FORM_SCHEMAS)) {
    insert.run(id, JSON.stringify(schema));
  }
}
