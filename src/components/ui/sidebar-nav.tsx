
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  closeMobileMenu?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ items, closeMobileMenu }) => {
  const location = useLocation();
  
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const isActive = location.pathname === item.href || location.pathname.startsWith(item.href);
        
        return (
          <Link
            key={item.title}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive 
                ? "bg-gray-800 text-white" 
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            )}
            onClick={closeMobileMenu}
          >
            {item.icon && <span className="mr-3">{item.icon}</span>}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export type { SidebarNavItem };
