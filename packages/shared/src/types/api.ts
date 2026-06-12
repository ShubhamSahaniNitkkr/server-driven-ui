import type { Role } from './permissions.js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface RuntimeConfig {
  theme: {
    defaultMode: 'light' | 'dark';
    primaryColor: string;
    brand: {
      name: string;
      logo?: string;
    };
  };
  featureFlags: Record<string, boolean>;
  permissions: string[];
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  permissions?: { view?: string };
  children?: NavigationItem[];
}

export interface NavigationConfig {
  items: NavigationItem[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

export interface DataQueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filter?: string;
}
