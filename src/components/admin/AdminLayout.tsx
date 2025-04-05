
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Image, 
  FileText, 
  Calendar, 
  TableProperties, 
  Settings, 
  Trophy, 
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'News', path: '/admin/news', icon: FileText },
    { name: 'Team', path: '/admin/team', icon: Users },
    { name: 'Fixtures', path: '/admin/fixtures', icon: Calendar },
    { name: 'League Table', path: '/admin/league', icon: TableProperties },
    { name: 'Sponsors', path: '/admin/sponsors', icon: DollarSign },
    { name: 'Trophies', path: '/admin/trophies', icon: Trophy },
    { name: 'Images', path: '/admin/images', icon: Image },
    { name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 ease-in-out bg-white border-r border-gray-200 shadow-sm flex flex-col",
        collapsed ? "w-16" : "md:w-64 w-64"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/admin" className={cn(
            "font-semibold text-lg text-team-blue transition-opacity duration-300",
            collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
          )}>
            Banks o' Dee Admin
          </Link>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pt-2">
          <nav className="px-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors group",
                    isActive
                      ? "bg-team-blue text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  title={collapsed ? item.name : ''}
                >
                  <IconComponent className={cn("flex-shrink-0", collapsed ? "mx-auto" : "mr-3")} size={20} />
                  <span className={cn(
                    "transition-opacity duration-300",
                    collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                  )}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={cn(
          "p-4 border-t text-xs text-gray-500 transition-opacity duration-300",
          collapsed ? "opacity-0 hidden" : "opacity-100"
        )}>
          <p>Banks o' Dee FC © {new Date().getFullYear()}</p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
