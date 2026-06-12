import type { ActionPayload } from '@sdui/shared';

export interface RenderContext {
  pagePath: string;
  depth: number;
  parentId?: string;
}

export type ActionHandler = (action: ActionPayload) => void | Promise<void>;

export interface ActionHandlerMap {
  navigate: (payload: Record<string, unknown>) => void | Promise<void>;
  api: (payload: Record<string, unknown>) => void | Promise<void>;
  modal: (payload: Record<string, unknown>) => void | Promise<void>;
  notification: (payload: Record<string, unknown>) => void | Promise<void>;
}
