import { Loader, Center } from '@mantine/core';

export function LoadingFallback() {
  return (
    <Center p="md" role="status" aria-label="Loading content">
      <Loader size="sm" type="dots" />
    </Center>
  );
}
