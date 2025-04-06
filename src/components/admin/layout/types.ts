
import { ReactNode } from 'react';

export interface AdminLayoutProps {
  children: ReactNode;
}

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: ReactNode;
}

export const navItems: SidebarNavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: null },
  { title: 'News Management', href: '/admin/news', icon: null },
  { title: 'Team & Management', href: '/admin/team', icon: null },
  { title: 'Fixtures & Results', href: '/admin/fixtures', icon: null },
  { title: 'League Table', href: '/admin/league-table-management', icon: null },
  { title: 'Media Gallery', href: '/admin/images', icon: null },
  { title: 'Sponsors', href: '/admin/sponsors', icon: null },
  { title: 'Tickets', href: '/admin/tickets', icon: null },
  { title: 'Fans', href: '/admin/fans', icon: null },
  { title: 'Settings', href: '/admin/settings', icon: null },
];
