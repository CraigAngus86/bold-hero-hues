
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper,
  Users, 
  Calendar, 
  TableProperties,
  Image, 
  Award,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { ModeToggle } from '@/components/mode-toggle';
import { SidebarNav } from '@/components/ui/sidebar-nav';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: SidebarNavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: 'News', href: '/admin/news', icon: <Newspaper className="h-5 w-5" /> },
  { title: 'Team', href: '/admin/team', icon: <Users className="h-5 w-5" /> },
  { title: 'Fixtures', href: '/admin/fixtures', icon: <Calendar className="h-5 w-5" /> },
  { title: 'League Table', href: '/admin/league-table-management', icon: <TableProperties className="h-5 w-5" /> },
  { title: 'Media', href: '/admin/images', icon: <Image className="h-5 w-5" /> },
  { title: 'Sponsors', href: '/admin/sponsors', icon: <Award className="h-5 w-5" /> },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    // Implement logout logic
    navigate('/');
  };

  // Function to close mobile menu - passed to SidebarNav
  const closeMobileMenu = () => {
    setIsMobileSidebarOpen(false);
  };
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/admin" className={cn(
            "flex items-center font-semibold text-lg transition-opacity duration-300",
            collapsed ? "opacity-0 w-0" : "opacity-100"
          )}>
            <Icons.logo />
            <span className={collapsed ? "hidden" : "ml-2"}>Admin</span>
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

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Link to="/admin" className="flex items-center font-semibold text-lg">
                <Icons.logo />
                <span className="ml-2">Admin</span>
              </Link>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4">
              <SidebarNav items={navItems} />
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

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-medium">
                {navItems.find(item => 
                  location.pathname === item.href || 
                  (item.href !== '/admin' && location.pathname.startsWith(item.href))
                )?.title || 'Admin'}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <ModeToggle />
              <Avatar className="h-8 w-8 md:hidden">
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
