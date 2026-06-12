import { memo, useCallback, useMemo, useReducer } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Button, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { FormSchema } from '@sdui/shared';
import { buildZodSchema } from '@/core/schema/buildZodSchema';
import { DynamicField } from '../fields/DynamicField';
import { useSubmitFormMutation } from '@/store/api/dataApi';
import type { RegisteredComponentProps } from '@/core/registry/types';

interface FormState {
  isSubmitting: boolean;
  submitError: string | null;
}

type FormAction =
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, submitError: null };
    case 'SUBMIT_SUCCESS':
      return { isSubmitting: false, submitError: null };
    case 'SUBMIT_ERROR':
      return { isSubmitting: false, submitError: action.error };
    default:
      return state;
  }
}

export const DynamicForm = memo(function DynamicForm({ schema }: RegisteredComponentProps) {
  const formSchema = schema as FormSchema;
  const [submitForm] = useSubmitFormMutation();
  const [state, dispatch] = useReducer(formReducer, { isSubmitting: false, submitError: null });

  const zodSchema = useMemo(() => buildZodSchema(formSchema.fields), [formSchema.fields]);
  const defaultValues = useMemo(
    () => Object.fromEntries(formSchema.fields.map((f) => [f.name, f.defaultValue ?? ''])),
    [formSchema.fields],
  );

  const methods = useForm({ resolver: zodResolver(zodSchema), defaultValues });

  const onSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      dispatch({ type: 'SUBMIT_START' });
      try {
        await submitForm({
          endpoint: formSchema.submitAction.endpoint,
          method: formSchema.submitAction.method,
          body: data,
        }).unwrap();
        dispatch({ type: 'SUBMIT_SUCCESS' });
        notifications.show({ title: 'Success', message: 'Form submitted successfully', color: 'green' });
        methods.reset();
      } catch {
        dispatch({ type: 'SUBMIT_ERROR', error: 'Failed to submit form' });
      }
    },
    [formSchema.submitAction, submitForm, methods],
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Stack gap="md">
          {formSchema.title && <Title order={5}>{formSchema.title}</Title>}
          {formSchema.description && <Text c="dimmed" size="sm">{formSchema.description}</Text>}
          {formSchema.fields.map((field) => (
            <DynamicField key={field.id} field={field} />
          ))}
          {state.submitError && (
            <Text c="red" size="sm" role="alert">{state.submitError}</Text>
          )}
          <Button type="submit" loading={state.isSubmitting}>
            {formSchema.submitLabel ?? 'Submit'}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
});
