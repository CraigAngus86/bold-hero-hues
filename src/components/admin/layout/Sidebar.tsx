
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SidebarNav } from '@/components/ui/sidebar-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarNavItem } from './types';
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

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  handleLogout: () => void;
}

// Initialize nav items with icons
const getNavItems = (): SidebarNavItem[] => [
  { title: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: 'News Management', href: '/admin/news', icon: <Newspaper className="h-5 w-5" /> },
  { title: 'Team & Management', href: '/admin/team', icon: <Users className="h-5 w-5" /> },
  { title: 'Fixtures & Results', href: '/admin/fixtures', icon: <Calendar className="h-5 w-5" /> },
  { title: 'League Table', href: '/admin/league-table-management', icon: <TableProperties className="h-5 w-5" /> },
  { title: 'Media Gallery', href: '/admin/media', icon: <Image className="h-5 w-5" /> },
  { title: 'Sponsors', href: '/admin/sponsors', icon: <Award className="h-5 w-5" /> },
  { title: 'Tickets', href: '/admin/tickets', icon: <ShoppingBag className="h-5 w-5" /> },
  { title: 'Fans', href: '/admin/fans', icon: <Users2 className="h-5 w-5" /> },
  { title: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, handleLogout }) => {
  const location = useLocation();
  const navItems = getNavItems();
  
  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/admin" className={cn(
          "flex items-center font-semibold text-lg transition-opacity duration-300",
          collapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          <div className="bg-[#00105A] text-white p-2 rounded mr-2">
            <span className="font-bold">BOD</span>
          </div>
          <span className="text-[#00105A] dark:text-[#C5E7FF]">Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        <SidebarNav items={navItems} />
      </div>
      
      <div className={cn(
        "p-4 border-t border-gray-200 dark:border-gray-700",
        collapsed ? "hidden" : "block"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/admin-avatar.png" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
