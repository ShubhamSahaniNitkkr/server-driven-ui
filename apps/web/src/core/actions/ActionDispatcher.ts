import type { ActionPayload } from '@sdui/shared';
import type { ActionHandlerMap } from './types';

class ActionDispatcherClass {
  private handlers: Partial<ActionHandlerMap> = {};

  register<K extends keyof ActionHandlerMap>(
    type: K,
    handler: ActionHandlerMap[K],
  ): void {
    this.handlers[type] = handler;
  }

  async dispatch(action: ActionPayload): Promise<void> {
    const handler = this.handlers[action.type];
    if (!handler) {
      console.warn(`No handler registered for action type: ${action.type}`);
      return;
    }
    await handler(action.payload);
  }
}

export const ActionDispatcher = new ActionDispatcherClass();
