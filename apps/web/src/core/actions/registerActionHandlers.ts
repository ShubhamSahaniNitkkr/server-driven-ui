import { notifications } from '@mantine/notifications';
import { ActionDispatcher } from './ActionDispatcher';
import type { AppDispatch } from '@/store';
import { openModal } from '@/store/slices/uiSlice';

let registered = false;

export function registerActionHandlers(
  dispatch: AppDispatch,
  submitForm: (args: {
    endpoint: string;
    method: string;
    body: Record<string, unknown>;
  }) => Promise<unknown>,
): void {
  if (registered) return;

  ActionDispatcher.register('navigate', (payload) => {
    const path = payload.path as string;
    if (path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  });

  ActionDispatcher.register('api', async (payload) => {
    await submitForm({
      endpoint: payload.endpoint as string,
      method: (payload.method as string) ?? 'POST',
      body: (payload.body as Record<string, unknown>) ?? {},
    });
    notifications.show({
      title: 'Success',
      message: 'Action completed successfully',
      color: 'green',
    });
  });

  ActionDispatcher.register('modal', (payload) => {
    dispatch(
      openModal({
        schemaId: payload.schemaId as string,
        title: payload.title as string | undefined,
      }),
    );
  });

  ActionDispatcher.register('notification', (payload) => {
    notifications.show({
      title: (payload.title as string) ?? 'Notification',
      message: payload.message as string,
      color: (payload.variant as string) ?? 'blue',
    });
  });

  registered = true;
}
