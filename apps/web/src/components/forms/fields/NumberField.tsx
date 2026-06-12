import { memo } from 'react';
import { NumberInput } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldSchema } from '@sdui/shared';

export const NumberField = memo(function NumberField({ field }: { field: FieldSchema }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: f }) => (
        <NumberInput
          label={field.label}
          placeholder={field.placeholder}
          description={field.description}
          error={error}
          aria-label={field.meta?.ariaLabel ?? field.label}
          {...f}
          onChange={(val) => f.onChange(val)}
        />
      )}
    />
  );
});
