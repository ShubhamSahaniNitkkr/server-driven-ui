import type { FormSchema, PageSchema } from '@sdui/shared';
import { baseApi } from './baseApi';

export const schemaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPageSchema: builder.query<PageSchema, string>({
      query: (path) => `/schemas/page?path=${encodeURIComponent(path)}`,
      providesTags: (_result, _error, path) => [{ type: 'Schema', id: path }],
    }),
    getFormSchema: builder.query<FormSchema, string>({
      query: (id) => `/schemas/form?id=${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: 'Schema', id }],
    }),
    getSchemaPreview: builder.query<PageSchema, { path: string; role: string }>({
      query: ({ path, role }) =>
        `/schemas/preview?path=${encodeURIComponent(path)}&role=${encodeURIComponent(role)}`,
    }),
  }),
});

export const {
  useGetPageSchemaQuery,
  useGetFormSchemaQuery,
  useGetSchemaPreviewQuery,
} = schemaApi;
