
import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  Calendar, 
  TableProperties, 
  Image, 
  Award, 
  ShoppingBag, 
  Users2, 
  Settings 
} from 'lucide-react';

export interface AdminLayoutProps {
  children: ReactNode;
}

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: ReactNode;
}

export const navItems: SidebarNavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: 'News Management', href: '/admin/news', icon: <Newspaper className="h-5 w-5" /> },
  { title: 'Team & Management', href: '/admin/team', icon: <Users className="h-5 w-5" /> },
  { title: 'Fixtures & Results', href: '/admin/fixtures', icon: <Calendar className="h-5 w-5" /> },
  { title: 'League Table', href: '/admin/league-table-management', icon: <TableProperties className="h-5 w-5" /> },
  { title: 'Media Gallery', href: '/admin/images', icon: <Image className="h-5 w-5" /> },
  { title: 'Sponsors', href: '/admin/sponsors', icon: <Award className="h-5 w-5" /> },
  { title: 'Tickets', href: '/admin/tickets', icon: <ShoppingBag className="h-5 w-5" /> },
  { title: 'Fans', href: '/admin/fans', icon: <Users2 className="h-5 w-5" /> },
  { title: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
];
