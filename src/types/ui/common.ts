
import { ReactNode } from 'react';

export interface NavItem {
  title: string;
  href: string;
  icon?: ReactNode;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}

export interface SidebarItem extends NavItem {
  description?: string;
  badge?: ReactNode;
}

export interface Breadcrumb {
  title: string;
  href: string;
  icon?: ReactNode;
}

export interface TabItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface MenuItem {
  label: string;
  value: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
}

export type SortDirection = 'asc' | 'desc';

/**
 * Properties for data table components
 */
export interface DataTableProps<T> {
  columns: Array<{
    key: string;
    header: ReactNode;
    cell: (item: T) => ReactNode;
    width?: string;
    sortable?: boolean;
  }>;
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  rowClassName?: (item: T) => string;
}
