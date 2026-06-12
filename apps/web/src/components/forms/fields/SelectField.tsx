import { memo } from 'react';
import { Select, MultiSelect } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldSchema } from '@sdui/shared';

export const SelectField = memo(function SelectField({ field }: { field: FieldSchema }) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;
  const data = (field.options ?? []).map((o) => ({ value: o.value, label: o.label }));

  if (field.type === 'multi-select') {
    return (
      <Controller
        name={field.name}
        control={control}
        render={({ field: f }) => (
          <MultiSelect
            label={field.label}
            description={field.description}
            data={data}
            error={error}
            aria-label={field.meta?.ariaLabel ?? field.label}
            {...f}
          />
        )}
      />
    );
  }

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: f }) => (
        <Select
          label={field.label}
          description={field.description}
          data={data}
          error={error}
          aria-label={field.meta?.ariaLabel ?? field.label}
          {...f}
        />
      )}
    />
  );
});
