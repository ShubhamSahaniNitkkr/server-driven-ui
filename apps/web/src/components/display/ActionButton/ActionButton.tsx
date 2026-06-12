import { memo, useCallback } from 'react';
import { Button } from '@mantine/core';
import type { SchemaAction } from '@sdui/shared';
import type { RegisteredComponentProps } from '@/core/registry/types';

export const ActionButton = memo(function ActionButton({
  schema,
  onAction,
}: RegisteredComponentProps) {
  const action = schema as SchemaAction;

  const handleClick = useCallback(() => {
    onAction(action.action);
  }, [action.action, onAction]);

  return (
    <Button
      variant={action.variant ?? 'filled'}
      onClick={handleClick}
      data-testid={action.meta?.testId}
      aria-label={action.meta?.ariaLabel ?? action.label}
    >
      {action.label}
    </Button>
  );
});
