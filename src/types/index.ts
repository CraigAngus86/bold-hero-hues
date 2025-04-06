
// Re-export all types from specific modules
export * from './auth';
export * from './news';
export * from './fixtures';
export * from './team';
export * from './media';
export * from './ui';
export * from './common';

// Centralized general-purpose types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TableSortState {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  [key: string]: string | boolean | number | string[] | undefined;
}
