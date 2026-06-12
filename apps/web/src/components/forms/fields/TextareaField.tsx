import { memo } from 'react';
import { Textarea } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
import type { FieldSchema } from '@sdui/shared';

export const TextareaField = memo(function TextareaField({ field }: { field: FieldSchema }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;

  return (
    <Textarea
      label={field.label}
      placeholder={field.placeholder}
      description={field.description}
      error={error}
      aria-label={field.meta?.ariaLabel ?? field.label}
      {...register(field.name)}
    />
  );
});
