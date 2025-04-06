
// Fix the TypeScript errors in the types.ts file
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

// Define the sidebar navigation item type
export type NavItem = {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
  label?: string;
};

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
