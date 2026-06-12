import type { PermissionRequirement } from './permissions.js';

export interface SchemaMeta {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  testId?: string;
  className?: string;
}

export interface BaseNode {
  id: string;
  type: string;
  permissions?: PermissionRequirement;
  featureFlag?: string;
  meta?: SchemaMeta;
}

export interface GridSpan {
  base?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface ActionPayload {
  type: 'navigate' | 'api' | 'modal' | 'notification';
  payload: Record<string, unknown>;
}

export interface SchemaAction extends BaseNode {
  type: 'button';
  label: string;
  variant?: 'filled' | 'outline' | 'light' | 'subtle';
  action: ActionPayload;
}

export interface LayoutNode extends BaseNode {
  type: 'grid' | 'card' | 'section' | 'tabs' | 'split';
  title?: string;
  description?: string;
  columns?: number;
  gap?: string | number;
  span?: GridSpan;
  children: SchemaNode[];
}

export interface ColumnSchema {
  id: string;
  header: string;
  accessor: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'date';
  width?: string;
  render?: 'text' | 'badge' | 'date' | 'currency';
}

export interface TableSchema extends BaseNode, DashboardWidget {
  type: 'table';
  title?: string;
  dataSource: string;
  columns: ColumnSchema[];
  actions?: SchemaAction[];
  pagination?: { pageSize: number };
  sortable?: boolean;
  filterable?: boolean;
}

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  message?: string;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldSchema extends BaseNode {
  type:
    | 'text-input'
    | 'number-input'
    | 'select'
    | 'multi-select'
    | 'checkbox'
    | 'radio'
    | 'date-picker'
    | 'textarea';
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  defaultValue?: unknown;
  options?: FieldOption[];
  validation?: FieldValidation;
}

export interface FormSchema extends BaseNode {
  type: 'form';
  title?: string;
  description?: string;
  fields: FieldSchema[];
  submitLabel?: string;
  submitAction: {
    type: 'api';
    method: 'POST' | 'PUT' | 'PATCH';
    endpoint: string;
  };
}

export interface StatCardSchema extends BaseNode, DashboardWidget {
  type: 'stat-card';
  title: string;
  dataSource: string;
  valueKey?: string;
  labelKey?: string;
  icon?: string;
  color?: string;
}

export interface ChartSchema extends BaseNode, DashboardWidget {
  type: 'chart';
  title?: string;
  chartType: 'bar' | 'line' | 'area' | 'pie';
  dataSource: string;
  xKey?: string;
  yKey?: string;
}

export interface CardSchema extends BaseNode {
  type: 'card';
  title?: string;
  description?: string;
  children?: SchemaNode[];
}

export interface ModalSchema extends BaseNode {
  type: 'modal';
  title: string;
  triggerLabel?: string;
  schemaId: string;
}

export interface AlertSchema extends BaseNode {
  type: 'alert';
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export interface PipelineStep {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

export interface PipelineSchema extends BaseNode {
  type: 'pipeline';
  title?: string;
  subtitle?: string;
  steps: PipelineStep[];
}

export interface SchemaExplorerSchema extends BaseNode {
  type: 'schema-explorer';
  title?: string;
  demoPath: string;
}

export interface RoleMatrixSchema extends BaseNode {
  type: 'role-matrix';
  title?: string;
  demoPath: string;
}

export interface WorkflowStage {
  id: string;
  label: string;
  status: string;
  color?: string;
}

export interface WorkflowBoardSchema extends BaseNode {
  type: 'workflow-board';
  title?: string;
  dataSource: string;
  stages: WorkflowStage[];
}

export interface DashboardWidget {
  span?: GridSpan;
}

export interface DashboardSchema extends BaseNode {
  type: 'dashboard';
  title?: string;
  widgets: (StatCardSchema | ChartSchema | TableSchema | CardSchema)[];
}

export type ComponentSchema =
  | TableSchema
  | FormSchema
  | StatCardSchema
  | ChartSchema
  | CardSchema
  | ModalSchema
  | AlertSchema
  | SchemaAction
  | DashboardSchema
  | PipelineSchema
  | SchemaExplorerSchema
  | RoleMatrixSchema
  | WorkflowBoardSchema;

export type SchemaNode = LayoutNode | ComponentSchema;

export interface PageSchema extends BaseNode {
  type: 'page';
  version: string;
  title: string;
  description?: string;
  path: string;
  layout: LayoutNode;
  actions?: SchemaAction[];
}
