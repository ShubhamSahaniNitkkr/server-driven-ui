import type { DataQueryParams, PaginatedResponse } from '@sdui/shared';
import { baseApi } from './baseApi';

function buildQueryString(params: DataQueryParams): string {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.pageSize) search.set('pageSize', String(params.pageSize));
  if (params.sort) search.set('sort', params.sort);
  if (params.order) search.set('order', params.order);
  if (params.filter) search.set('filter', params.filter);
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const dataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query<PaginatedResponse<Record<string, unknown>>, { endpoint: string; params?: DataQueryParams }>({
      query: ({ endpoint, params = {} }) => {
        const path = endpoint.replace('/api/v1', '');
        return `${path}${buildQueryString(params)}`;
      },
    }),
    getStat: builder.query<{ value: number; label?: string }, string>({
      query: (endpoint) => endpoint.replace('/api/v1', ''),
    }),
    getWorkflow: builder.query<
      { status: string; count: number; percentage: number }[],
      string
    >({
      query: (endpoint) => endpoint.replace('/api/v1', ''),
    }),
    getChartData: builder.query<Record<string, unknown>[], string>({
      query: (endpoint) => endpoint.replace('/api/v1', ''),
      transformResponse: (response: Record<string, unknown>[] | PaginatedResponse<Record<string, unknown>>) => {
        if (Array.isArray(response)) return response;
        return response.data ?? [];
      },
    }),
    submitForm: builder.mutation<unknown, { endpoint: string; method: string; body: Record<string, unknown> }>({
      query: ({ endpoint, method, body }) => ({
        url: endpoint.replace('/api/v1', ''),
        method,
        body,
      }),
      invalidatesTags: ['Users', 'Orders', 'Config', 'Settings'],
    }),
  }),
});

export const {
  useGetDataQuery,
  useGetStatQuery,
  useGetWorkflowQuery,
  useGetChartDataQuery,
  useSubmitFormMutation,
} = dataApi;
