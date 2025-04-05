
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper,
  Users, 
  Calendar, 
  TableProperties,
  Image, 
  Award,
  Ticket,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BellRing,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Typography } from '@/components/ui';

const { H2, H4, Small } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ElementType;
  dividerAfter?: boolean;
}

const navItems: NavigationItem[] = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'News Management', path: '/admin/news', icon: Newspaper },
  { name: 'Team & Management', path: '/admin/team', icon: Users },
  { name: 'Fixtures & Results', path: '/admin/fixtures', icon: Calendar },
  { name: 'League Table', path: '/admin/league', icon: TableProperties },
  { name: 'Media Gallery', path: '/admin/media', icon: Image },
  { name: 'Sponsors', path: '/admin/sponsors', icon: Award },
  { name: 'Tickets', path: '/admin/tickets', icon: Ticket },
  { name: 'Merchandise', path: '/admin/merchandise', icon: ShoppingBag, dividerAfter: true },
  { name: 'Fans', path: '/admin/fans', icon: Heart },
  { name: 'Settings', path: '/admin/settings', icon: Settings, dividerAfter: true },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Admin']);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && collapsed) {
        setCollapsed(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);

  // Update breadcrumbs and page title when location changes
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const currentNavItem = navItems.find(item => {
        const itemPath = item.path.split('/').filter(Boolean);
        return itemPath.length > 1 && itemPath[1] === pathSegments[1];
      });
      
      const crumbs = ['Admin'];
      if (currentNavItem) {
        setCurrentPage(currentNavItem.name);
        crumbs.push(currentNavItem.name);
        
        // Add sub-section if exists
        if (pathSegments.length > 2) {
          crumbs.push(pathSegments[2].charAt(0).toUpperCase() + pathSegments[2].slice(1));
        }
      } else {
        setCurrentPage('Dashboard');
      }
      
      setBreadcrumbs(crumbs);
    }
  }, [location]);

  const handleLogout = () => {
    // Implement logout functionality
    navigate('/');
  };
  
  // Sidebar rendering for desktop
  const renderSidebar = () => (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <Link to="/admin" className={cn(
          "flex items-center font-semibold text-lg text-primary-800 transition-opacity duration-300",
          collapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          <img 
            src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png" 
            alt="Banks o' Dee FC" 
            className="h-9 w-9 mr-2" 
          />
          <span className="font-display">Admin Portal</span>
        </Link>
        <Button
          variant="ghost"
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      <div className="flex-grow overflow-y-auto py-2 px-2">
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path || 
                            (location.pathname.startsWith(item.path) && item.path !== '/admin');
            const IconComponent = item.icon;
            
            return (
              <React.Fragment key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors group",
                    isActive
                      ? "bg-primary-800 text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <IconComponent className={cn("flex-shrink-0", collapsed ? "mx-auto" : "mr-3")} size={20} />
                  <span className={cn(
                    "transition-opacity duration-300",
                    collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                  )}>
                    {item.name}
                  </span>
                </Link>
                {item.dividerAfter && !collapsed && (
                  <Separator className="my-2 opacity-70" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      
      <div className={cn(
        "p-4 border-t transition-opacity duration-300",
        collapsed ? "opacity-0" : "opacity-100"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png" alt="User" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className={cn("ml-3", collapsed ? "hidden" : "block")}>
              <Small className="font-medium">Admin User</Small>
              <Small className="text-gray-400">admin@banksofdee.com</Small>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className={cn("text-gray-500", collapsed ? "hidden" : "block")}
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 max-w-[280px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/admin" className="flex items-center font-semibold text-lg text-primary-800">
              <img 
                src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png" 
                alt="Banks o' Dee FC" 
                className="h-9 w-9 mr-2" 
              />
              <span className="font-display">Admin Portal</span>
            </Link>
          </div>
          
          <div className="flex-grow overflow-y-auto py-4 px-3">
            <nav className="space-y-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path || 
                                (location.pathname.startsWith(item.path) && item.path !== '/admin');
                const IconComponent = item.icon;
                
                return (
                  <React.Fragment key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-3 py-3 text-sm rounded-md transition-colors",
                        isActive
                          ? "bg-primary-800 text-white font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <IconComponent className="flex-shrink-0 mr-3" size={20} />
                      <span>{item.name}</span>
                    </Link>
                    {item.dividerAfter && (
                      <Separator className="my-2 opacity-70" />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png" alt="User" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <Small className="font-medium">Admin User</Small>
                  <Small className="text-gray-400">admin@banksofdee.com</Small>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-500"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        {renderSidebar()}
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile sidebar trigger */}
                {renderMobileSidebar()}
                
                <div>
                  <H4 className="mb-0">{currentPage}</H4>
                  <div className="flex items-center text-sm text-gray-500">
                    {breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span className="mx-1">/</span>}
                        <span className={index === breadcrumbs.length - 1 ? "font-medium" : ""}>{crumb}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="text-gray-700 hidden sm:flex">
                  <BellRing size={20} className="mr-1" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-700 hidden sm:flex">
                  <HelpCircle size={20} className="mr-1" />
                  <span className="sr-only">Help</span>
                </Button>
                <div className="hidden sm:block border-l h-8 mx-2 border-gray-200" />
                <div className="hidden sm:flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png" alt="User" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <Small className="ml-2 font-medium">Admin User</Small>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
