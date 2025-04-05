
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
  DollarSign 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  
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
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/admin" className="font-semibold text-lg text-team-blue">Banks o' Dee Admin</Link>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm rounded-md",
                      isActive
                        ? "bg-team-blue text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <IconComponent className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
