import { memo } from 'react';
import { Checkbox } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldSchema } from '@sdui/shared';

export const CheckboxField = memo(function CheckboxField({ field }: { field: FieldSchema }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: f }) => (
        <Checkbox
          label={field.label}
          description={field.description}
          error={error}
          aria-label={field.meta?.ariaLabel ?? field.label}
          checked={!!f.value}
          onChange={(e) => f.onChange(e.currentTarget.checked)}
        />
      )}
    />
  );
});
