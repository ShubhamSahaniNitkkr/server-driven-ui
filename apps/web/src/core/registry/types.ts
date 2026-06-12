import type { ComponentType } from 'react';
import type { ZodType } from 'zod';
import type { SchemaNode } from '@sdui/shared';
import type { ActionHandler, RenderContext } from '../actions/types';

export interface RegisteredComponentProps {
  id: string;
  schema: SchemaNode;
  context: RenderContext;
  onAction: ActionHandler;
}

export interface RegistryEntry {
  component: ComponentType<RegisteredComponentProps>;
  category: 'layout' | 'data' | 'form' | 'feedback' | 'navigation' | 'action';
  lazy?: () => Promise<{ default: ComponentType<RegisteredComponentProps> }>;
  schemaValidator?: ZodType;
}

export interface FallbackEntry {
  component: ComponentType<RegisteredComponentProps>;
  isFallback: true;
}
