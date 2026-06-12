import { memo } from 'react';
import { Radio } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldSchema } from '@sdui/shared';

export const RadioField = memo(function RadioField({ field }: { field: FieldSchema }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: f }) => (
        <Radio.Group
          label={field.label}
          description={field.description}
          error={error}
          aria-label={field.meta?.ariaLabel ?? field.label}
          {...f}
        >
          {(field.options ?? []).map((opt) => (
            <Radio key={opt.value} value={opt.value} label={opt.label} />
          ))}
        </Radio.Group>
      )}
    />
  );
});
