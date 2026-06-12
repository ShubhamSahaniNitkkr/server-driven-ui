import { describe, it, expect } from 'vitest';
import { buildZodSchema } from '@/core/schema/buildZodSchema';
import type { FieldSchema } from '@sdui/shared';

describe('buildZodSchema', () => {
  const fields: FieldSchema[] = [
    {
      id: 'f1',
      type: 'text-input',
      name: 'email',
      label: 'Email',
      validation: { required: true, email: true },
    },
    {
      id: 'f2',
      type: 'number-input',
      name: 'age',
      label: 'Age',
      validation: { min: 0, max: 120 },
    },
  ];

  it('validates correct data', () => {
    const schema = buildZodSchema(fields);
    const result = schema.safeParse({ email: 'test@example.com', age: 25 });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const schema = buildZodSchema(fields);
    const result = schema.safeParse({ email: 'invalid', age: 25 });
    expect(result.success).toBe(false);
  });

  it('rejects out of range numbers', () => {
    const schema = buildZodSchema(fields);
    const result = schema.safeParse({ email: 'test@example.com', age: 200 });
    expect(result.success).toBe(false);
  });
});
