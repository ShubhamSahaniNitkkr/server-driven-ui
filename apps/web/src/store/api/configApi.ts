import type { NavigationConfig, RuntimeConfig } from '@sdui/shared';
import { baseApi } from './baseApi';

export const configApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRuntimeConfig: builder.query<RuntimeConfig, void>({
      query: () => '/config/runtime',
      providesTags: ['Config'],
    }),
    getNavigation: builder.query<NavigationConfig, void>({
      query: () => '/config/navigation',
      providesTags: ['Config'],
    }),
    getRoutes: builder.query<{ routes: string[] }, void>({
      query: () => '/config/routes',
      providesTags: ['Config'],
    }),
  }),
});

export const {
  useGetRuntimeConfigQuery,
  useGetNavigationQuery,
  useGetRoutesQuery,
} = configApi;
