import { ComponentRegistry } from './ComponentRegistry';
import { FallbackComponent } from '../renderer/FallbackComponent';
import { GridLayout } from '@/components/layouts/GridLayout/GridLayout';
import { SectionLayout } from '@/components/layouts/SectionLayout/SectionLayout';
import { CardLayout } from '@/components/layouts/CardLayout/CardLayout';
import { TabsLayout } from '@/components/layouts/TabsLayout/TabsLayout';
import { SplitLayout } from '@/components/layouts/SplitLayout/SplitLayout';
import { DashboardLayout } from '@/components/layouts/DashboardLayout/DashboardLayout';
import { DataTable } from '@/components/data/DataTable/DataTable';
import { StatCard } from '@/components/data/StatCard/StatCard';
import { DynamicForm } from '@/components/forms/DynamicForm/DynamicForm';
import { AlertWidget } from '@/components/display/AlertWidget/AlertWidget';
import { ActionButton } from '@/components/display/ActionButton/ActionButton';
import { PipelineVisualizer } from '@/components/studio/PipelineVisualizer/PipelineVisualizer';
import { SchemaExplorer } from '@/components/studio/SchemaExplorer/SchemaExplorer';
import { RoleMatrix } from '@/components/studio/RoleMatrix/RoleMatrix';
import { WorkflowBoard } from '@/components/studio/WorkflowBoard/WorkflowBoard';
import { ChartWidget } from '@/components/data/Chart/ChartWidget';

let registered = false;

export function registerComponents(): void {
  if (registered) return;

  const layouts = [
    ['grid', GridLayout],
    ['section', SectionLayout],
    ['card', CardLayout],
    ['tabs', TabsLayout],
    ['split', SplitLayout],
    ['dashboard', DashboardLayout],
  ] as const;

  for (const [type, component] of layouts) {
    ComponentRegistry.register(type, { component, category: 'layout' });
  }

  ComponentRegistry.register('table', { component: DataTable, category: 'data' });
  ComponentRegistry.register('stat-card', { component: StatCard, category: 'data' });
  ComponentRegistry.register('chart', { component: ChartWidget, category: 'data' });

  ComponentRegistry.register('form', { component: DynamicForm, category: 'form' });
  ComponentRegistry.register('alert', { component: AlertWidget, category: 'feedback' });
  ComponentRegistry.register('button', { component: ActionButton, category: 'action' });

  ComponentRegistry.register('pipeline', { component: PipelineVisualizer, category: 'data' });
  ComponentRegistry.register('schema-explorer', { component: SchemaExplorer, category: 'data' });
  ComponentRegistry.register('role-matrix', { component: RoleMatrix, category: 'data' });
  ComponentRegistry.register('workflow-board', { component: WorkflowBoard, category: 'data' });

  ComponentRegistry.setFallback(FallbackComponent);
  registered = true;
}
