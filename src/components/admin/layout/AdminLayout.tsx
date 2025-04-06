
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
  ShoppingBag,
  Users2,
  Settings,
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

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Find the current active section
  const currentSection = navItems.find(item => 
    location.pathname === item.href || 
    (item.href !== '/admin' && location.pathname.startsWith(item.href))
  );
  
  const handleLogout = () => {
    // Implement logout logic
    navigate('/');
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

      {/* Mobile Sidebar */}
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
                {currentSection?.title || 'Admin Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <ModeToggle />
              <Avatar className="h-8 w-8 md:hidden">
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-850 border-t border-b border-gray-200 dark:border-gray-700 text-xs">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1">
                <li className="inline-flex items-center">
                  <Link to="/admin" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    Admin
                  </Link>
                </li>
                {currentSection && currentSection.href !== '/admin' && (
                  <li className="flex items-center">
                    <span className="mx-1 text-gray-400">/</span>
                    <Link 
                      to={currentSection.href} 
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {currentSection.title}
                    </Link>
                  </li>
                )}
              </ol>
            </nav>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
