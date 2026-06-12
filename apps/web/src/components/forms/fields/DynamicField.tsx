import { memo } from 'react';
import type { FieldSchema } from '@sdui/shared';
import { TextField } from './TextField';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { CheckboxField } from './CheckboxField';
import { RadioField } from './RadioField';
import { DateField } from './DateField';
import { TextareaField } from './TextareaField';

interface DynamicFieldProps {
  field: FieldSchema;
}

export const DynamicField = memo(function DynamicField({ field }: DynamicFieldProps) {
  switch (field.type) {
    case 'number-input':
      return <NumberField field={field} />;
    case 'select':
    case 'multi-select':
      return <SelectField field={field} />;
    case 'checkbox':
      return <CheckboxField field={field} />;
    case 'radio':
      return <RadioField field={field} />;
    case 'date-picker':
      return <DateField field={field} />;
    case 'textarea':
      return <TextareaField field={field} />;
    default:
      return <TextField field={field} />;
  }
});
