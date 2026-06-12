import { z } from 'zod';

export const permissionRequirementSchema = z.object({
  view: z.string().optional(),
  edit: z.string().optional(),
  delete: z.string().optional(),
  create: z.string().optional(),
  execute: z.string().optional(),
});

export const schemaMetaSchema = z.object({
  ariaLabel: z.string().optional(),
  ariaDescribedBy: z.string().optional(),
  role: z.string().optional(),
  testId: z.string().optional(),
  className: z.string().optional(),
});

export const baseNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  permissions: permissionRequirementSchema.optional(),
  featureFlag: z.string().optional(),
  meta: schemaMetaSchema.optional(),
});

export const gridSpanSchema = z.object({
  base: z.number().optional(),
  xs: z.number().optional(),
  sm: z.number().optional(),
  md: z.number().optional(),
  lg: z.number().optional(),
  xl: z.number().optional(),
});

export const actionPayloadSchema = z.object({
  type: z.enum(['navigate', 'api', 'modal', 'notification']),
  payload: z.record(z.unknown()),
});

export const schemaActionSchema = baseNodeSchema.extend({
  type: z.literal('button'),
  label: z.string(),
  variant: z.enum(['filled', 'outline', 'light', 'subtle']).optional(),
  action: actionPayloadSchema,
});

export const fieldValidationSchema = z.object({
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  email: z.boolean().optional(),
  message: z.string().optional(),
});

export const fieldSchema = baseNodeSchema.extend({
  type: z.enum([
    'text-input',
    'number-input',
    'select',
    'multi-select',
    'checkbox',
    'radio',
    'date-picker',
    'textarea',
  ]),
  name: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  defaultValue: z.unknown().optional(),
  options: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  validation: fieldValidationSchema.optional(),
});

export const formSchema = baseNodeSchema.extend({
  type: z.literal('form'),
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(fieldSchema),
  submitLabel: z.string().optional(),
  submitAction: z.object({
    type: z.literal('api'),
    method: z.enum(['POST', 'PUT', 'PATCH']),
    endpoint: z.string(),
  }),
});

export const columnSchema = z.object({
  id: z.string(),
  header: z.string(),
  accessor: z.string(),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  filterType: z.enum(['text', 'select', 'date']).optional(),
  width: z.string().optional(),
  render: z.enum(['text', 'badge', 'date', 'currency']).optional(),
});

export const tableSchema = baseNodeSchema.extend({
  type: z.literal('table'),
  title: z.string().optional(),
  dataSource: z.string(),
  columns: z.array(columnSchema),
  actions: z.array(schemaActionSchema).optional(),
  pagination: z.object({ pageSize: z.number() }).optional(),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
});

export const statCardSchema = baseNodeSchema.extend({
  type: z.literal('stat-card'),
  title: z.string(),
  dataSource: z.string(),
  valueKey: z.string().optional(),
  labelKey: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const chartSchema = baseNodeSchema.extend({
  type: z.literal('chart'),
  title: z.string().optional(),
  chartType: z.enum(['bar', 'line', 'area', 'pie']),
  dataSource: z.string(),
  xKey: z.string().optional(),
  yKey: z.string().optional(),
});

export const cardSchema: z.ZodType<unknown> = baseNodeSchema.extend({
  type: z.literal('card'),
  title: z.string().optional(),
  description: z.string().optional(),
  children: z.lazy(() => z.array(schemaNodeSchema)).optional(),
});

export const alertSchema = baseNodeSchema.extend({
  type: z.literal('alert'),
  message: z.string(),
  title: z.string().optional(),
  variant: z.enum(['info', 'success', 'warning', 'error']).optional(),
});

export const pipelineStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export const pipelineSchema = baseNodeSchema.extend({
  type: z.literal('pipeline'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  steps: z.array(pipelineStepSchema),
});

export const schemaExplorerSchema = baseNodeSchema.extend({
  type: z.literal('schema-explorer'),
  title: z.string().optional(),
  demoPath: z.string(),
});

export const roleMatrixSchema = baseNodeSchema.extend({
  type: z.literal('role-matrix'),
  title: z.string().optional(),
  demoPath: z.string(),
});

export const workflowStageSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: z.string(),
  color: z.string().optional(),
});

export const workflowBoardSchema = baseNodeSchema.extend({
  type: z.literal('workflow-board'),
  title: z.string().optional(),
  dataSource: z.string(),
  stages: z.array(workflowStageSchema),
});

export const layoutNodeSchema: z.ZodType<unknown> = baseNodeSchema.extend({
  type: z.enum(['grid', 'card', 'section', 'tabs', 'split']),
  title: z.string().optional(),
  description: z.string().optional(),
  columns: z.number().optional(),
  gap: z.union([z.string(), z.number()]).optional(),
  span: gridSpanSchema.optional(),
  children: z.lazy(() => z.array(schemaNodeSchema)),
});

export const dashboardSchema = baseNodeSchema.extend({
  type: z.literal('dashboard'),
  title: z.string().optional(),
  widgets: z.array(z.lazy(() => z.union([statCardSchema, chartSchema, tableSchema, cardSchema]))),
});

export const componentSchema = z.discriminatedUnion('type', [
  tableSchema,
  formSchema,
  statCardSchema,
  chartSchema,
  alertSchema,
  schemaActionSchema,
  dashboardSchema,
  pipelineSchema,
  schemaExplorerSchema,
  roleMatrixSchema,
  workflowBoardSchema,
]);

export const schemaNodeSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([layoutNodeSchema, componentSchema, cardSchema]),
);

export const pageSchema = baseNodeSchema.extend({
  type: z.literal('page'),
  version: z.string(),
  title: z.string(),
  description: z.string().optional(),
  path: z.string(),
  layout: layoutNodeSchema,
  actions: z.array(schemaActionSchema).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
