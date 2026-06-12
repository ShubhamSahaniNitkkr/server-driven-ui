import { memo, useState, useCallback } from 'react';
import { Tabs } from '@mantine/core';
import type { LayoutNode } from '@sdui/shared';
import { SchemaRenderer } from '@/core/renderer/SchemaRenderer';
import type { RegisteredComponentProps } from '@/core/registry/types';

export const TabsLayout = memo(function TabsLayout({
  schema,
  context,
  onAction,
}: RegisteredComponentProps) {
  const layout = schema as LayoutNode;
  const [activeTab, setActiveTab] = useState<string | null>(layout.children?.[0]?.id ?? null);

  const handleChange = useCallback((value: string | null) => {
    setActiveTab(value);
  }, []);

  return (
    <Tabs value={activeTab} onChange={handleChange}>
      <Tabs.List>
        {layout.children?.map((child) => (
          <Tabs.Tab key={child.id} value={child.id}>
            {'title' in child ? (child as LayoutNode).title ?? child.id : child.id}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {layout.children?.map((child) => (
        <Tabs.Panel key={child.id} value={child.id} pt="md">
          <SchemaRenderer node={child} context={context} onAction={onAction} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
});
