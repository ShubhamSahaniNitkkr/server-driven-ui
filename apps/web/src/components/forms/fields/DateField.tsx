import { memo } from 'react';
import { DateInput } from '@mantine/dates';
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldSchema } from '@sdui/shared';

export const DateField = memo(function DateField({ field }: { field: FieldSchema }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: f }) => (
        <DateInput
          label={field.label}
          description={field.description}
          error={error}
          aria-label={field.meta?.ariaLabel ?? field.label}
          value={f.value ? new Date(f.value) : null}
          onChange={(val) => f.onChange(val)}
        />
      )}
    />
  );
});
