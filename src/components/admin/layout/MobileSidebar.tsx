
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarNav } from '@/components/ui/sidebar-nav';
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
import { SidebarNavItem } from './types';

interface MobileSidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
}

// Initialize nav items with icons
const getNavItems = (): SidebarNavItem[] => [
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

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  isMobileSidebarOpen, 
  setIsMobileSidebarOpen,
  handleLogout 
}) => {
  const navItems = getNavItems();
  
  return (
    <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/admin" className="flex items-center font-semibold text-lg">
              <div className="bg-[#00105A] text-white p-2 rounded mr-2">
                <span className="font-bold">BOD</span>
              </div>
              <span className="text-[#00105A] dark:text-[#C5E7FF]">Admin</span>
            </Link>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4">
            <SidebarNav 
              items={navItems}
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
