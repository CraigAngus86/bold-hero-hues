import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Image,
  Settings,
  LineChart,
  ShoppingCart,
  Ticket,
  MessageSquare,
  Trophy,
} from 'lucide-react';
import React from 'react';

// Define the sidebar navigation item types
export type NavItem = {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
  label?: string;
};

// For backward compatibility with existing code
export interface AdminLayoutProps {
  children: React.ReactNode;
}

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

// Navigation sections with their respective items
export const adminNavItems: { title: string; items: NavItem[] }[] = [
  {
    title: 'General',
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard
      },
      {
        title: 'Users',
        href: '/admin/users',
        icon: Users
      },
      {
        title: 'Fixtures',
        href: '/admin/fixtures',
        icon: CalendarDays
      },
      {
        title: 'Content Manager',
        href: '/admin/content',
        icon: FileText
      },
      {
        title: 'Media Library',
        href: '/admin/media-library',
        icon: Image
      },
      {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings
      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      {
        title: 'Reports',
        href: '/admin/analytics/reports',
        icon: LineChart
      },
      {
        title: 'Shop',
        href: '/admin/analytics/shop',
        icon: ShoppingCart
      },
      {
        title: 'Ticketing',
        href: '/admin/analytics/ticketing',
        icon: Ticket
      },
    ],
  },
  {
    title: 'Community',
    items: [
      {
        title: 'Messages',
        href: '/admin/community/messages',
        icon: MessageSquare
      },
      {
        title: 'Competitions',
        href: '/admin/community/competitions',
        icon: Trophy
      },
    ],
  },
];

// For backward compatibility, keep the old navItems array
export const navItems: SidebarNavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: 'Users', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { title: 'Fixtures', href: '/admin/fixtures', icon: <CalendarDays className="h-5 w-5" /> },
  { title: 'Content', href: '/admin/content', icon: <FileText className="h-5 w-5" /> },
  { title: 'Media', href: '/admin/media-library', icon: <Image className="h-5 w-5" /> },
  { title: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
];
