import { memo } from 'react';
import { TextInput } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
import type { FieldSchema } from '@sdui/shared';

export const TextField = memo(function TextField({ field }: { field: FieldSchema }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;

  return (
    <TextInput
      label={field.label}
      placeholder={field.placeholder}
      description={field.description}
      error={error}
      aria-label={field.meta?.ariaLabel ?? field.label}
      {...register(field.name)}
    />
  );
});
