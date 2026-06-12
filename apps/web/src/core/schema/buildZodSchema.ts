import { z } from 'zod';
import type { FieldSchema } from '@sdui/shared';

export function buildZodSchema(fields: FieldSchema[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let schema: z.ZodTypeAny;

    switch (field.type) {
      case 'number-input':
        schema = z.coerce.number();
        if (field.validation?.min !== undefined) schema = (schema as z.ZodNumber).min(field.validation.min);
        if (field.validation?.max !== undefined) schema = (schema as z.ZodNumber).max(field.validation.max);
        break;
      case 'checkbox':
        schema = z.boolean();
        break;
      case 'multi-select':
        schema = z.array(z.string());
        break;
      case 'date-picker':
        schema = z.coerce.date();
        break;
      default:
        schema = z.string();
        if (field.validation?.email) schema = (schema as z.ZodString).email(field.validation.message);
        if (field.validation?.minLength) schema = (schema as z.ZodString).min(field.validation.minLength, field.validation.message);
        if (field.validation?.maxLength) schema = (schema as z.ZodString).max(field.validation.maxLength, field.validation.message);
        if (field.validation?.pattern) schema = (schema as z.ZodString).regex(new RegExp(field.validation.pattern), field.validation.message);
    }

    if (field.validation?.required) {
      if (field.type === 'checkbox') {
        schema = schema.refine((val) => val === true, { message: field.validation.message ?? 'Required' });
      } else {
        schema = schema.refine(
          (val) => val !== undefined && val !== null && val !== '',
          { message: field.validation.message ?? 'Required' },
        );
      }
    } else {
      schema = schema.optional();
    }

    shape[field.name] = schema;
  }

  return z.object(shape);
}
