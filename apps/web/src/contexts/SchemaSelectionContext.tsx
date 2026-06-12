import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PageSchema } from '@sdui/shared';
import { useGetPageSchemaQuery } from '@/store/api/schemaApi';
import { buildSchemaIndex, type SchemaNodeIndexEntry } from '@/lib/schemaIndex';

export type SelectionSource = 'json' | 'ui' | null;

interface SchemaSelectionContextValue {
  selectedId: string | null;
  source: SelectionSource;
  selectNode: (id: string | null, source: SelectionSource) => void;
  clearSelection: () => void;
  index: Map<string, SchemaNodeIndexEntry>;
  schema: PageSchema | undefined;
}

const noop = (): void => undefined;

const defaultValue: SchemaSelectionContextValue = {
  selectedId: null,
  source: null,
  selectNode: noop,
  clearSelection: noop,
  index: new Map(),
  schema: undefined,
};

const SchemaSelectionContext = createContext<SchemaSelectionContextValue>(defaultValue);

interface SchemaSelectionProviderProps {
  path: string;
  children: ReactNode;
}

export function SchemaSelectionProvider({ path, children }: SchemaSelectionProviderProps) {
  const { data: schema } = useGetPageSchemaQuery(path);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [source, setSource] = useState<SelectionSource>(null);

  const index = useMemo(() => (schema ? buildSchemaIndex(schema) : new Map()), [schema]);

  useEffect(() => {
    setSelectedId(null);
    setSource(null);
  }, [path]);

  const selectNode = useCallback((id: string | null, from: SelectionSource) => {
    setSelectedId(id);
    setSource(from);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    setSource(null);
  }, []);

  useEffect(() => {
    if (!selectedId || source !== 'json') return;
    const el = document.querySelector(`[data-sdui-node-id="${selectedId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedId, source]);

  const value = useMemo(
    () => ({
      selectedId,
      source,
      selectNode,
      clearSelection,
      index,
      schema,
    }),
    [selectedId, source, selectNode, clearSelection, index, schema],
  );

  return (
    <SchemaSelectionContext.Provider value={value}>{children}</SchemaSelectionContext.Provider>
  );
}

export function useSchemaSelection(): SchemaSelectionContextValue {
  return useContext(SchemaSelectionContext);
}
