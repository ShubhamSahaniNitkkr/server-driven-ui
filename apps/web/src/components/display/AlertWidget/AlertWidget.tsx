import { memo } from 'react';
import { Alert } from '@mantine/core';
import type { AlertSchema } from '@sdui/shared';
import type { RegisteredComponentProps } from '@/core/registry/types';

const COLOR_MAP = {
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red',
} as const;

export const AlertWidget = memo(function AlertWidget({ schema }: RegisteredComponentProps) {
  const alert = schema as AlertSchema;
  return (
    <Alert
      color={COLOR_MAP[alert.variant ?? 'info']}
      title={alert.title}
      role="alert"
      aria-live="polite"
      variant="light"
      radius="md"
    >
      {alert.message}
    </Alert>
  );
});
