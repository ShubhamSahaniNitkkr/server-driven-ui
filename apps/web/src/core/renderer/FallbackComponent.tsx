import { memo } from 'react';
import { Alert } from '@mantine/core';
import type { RegisteredComponentProps } from '../registry/types';

export const FallbackComponent = memo(function FallbackComponent({
  schema,
}: RegisteredComponentProps) {
  return (
    <Alert color="yellow" title="Unknown Component" role="alert" variant="light" data-testid="fallback-component">
      No registered component for type: <strong>{schema.type}</strong> (id: {schema.id})
    </Alert>
  );
});
