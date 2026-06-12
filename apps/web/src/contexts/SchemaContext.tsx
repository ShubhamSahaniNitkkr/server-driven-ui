import { createContext, useContext } from 'react';
import type { RenderContext } from '@/core/actions/types';

export const SchemaContext = createContext<RenderContext>({
  pagePath: '/',
  depth: 0,
});

export function useSchemaContext(): RenderContext {
  return useContext(SchemaContext);
}
