
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { AdminLayoutProps, SidebarNavItem } from './types';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Header from './Header';

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

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const navItems = getNavItems();
  
  const handleLogout = () => {
    // Implement logout logic
    navigate('/');
  };
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Desktop Sidebar */}
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        handleLogout={handleLogout}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <Header 
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          navItems={navItems}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
