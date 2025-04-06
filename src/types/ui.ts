
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}

export interface SidebarItem extends NavItem {
  description?: string;
  badge?: React.ReactNode;
}

export interface Breadcrumb {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

export interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface MenuItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
}

export type SortDirection = 'asc' | 'desc';
