
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarNavItem } from './types';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  setIsMobileSidebarOpen: (open: boolean) => void;
  navItems: SidebarNavItem[];
}

export const Header: React.FC<HeaderProps> = ({ setIsMobileSidebarOpen, navItems }) => {
  const location = useLocation();
  const { profile, hasRole } = useAuth();
  
  // Find the current active section
  const currentSection = navItems.find(item => 
    location.pathname === item.href || 
    (item.href !== '/admin' && location.pathname.startsWith(item.href))
  );
  
  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!profile || !profile.full_name) return 'AD';
    
    const nameParts = profile.full_name.trim().split(' ');
    if (nameParts.length === 0) return 'AD';
    
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };
  
  return (
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
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
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
  );
};

export default Header;
