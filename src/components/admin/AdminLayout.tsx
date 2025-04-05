
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useLocation } from 'react-router-dom';
import { Home, Newspaper, Users, Trophy, Database, Image, CalendarDays } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath.includes(path);
  };

  const navLinkClass = (path: string) => {
    return `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
      isActive(path)
        ? 'bg-team-blue text-white font-medium'
        : 'hover:bg-gray-100'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 py-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
                  <p className="text-sm text-gray-500">Manage your website content</p>
                </div>
                
                <nav className="p-4 flex flex-col gap-1">
                  <Link to="/admin" className={navLinkClass("/admin")}>
                    <Home size={18} />
                    Dashboard
                  </Link>
                  <Link to="/admin/news" className={navLinkClass("/admin/news")}>
                    <Newspaper size={18} />
                    News
                  </Link>
                  <Link to="/admin/team" className={navLinkClass("/admin/team")}>
                    <Users size={18} />
                    Team
                  </Link>
                  <Link to="/admin/fixtures" className={navLinkClass("/admin/fixtures")}>
                    <CalendarDays size={18} />
                    Fixtures
                  </Link>
                  <Link to="/admin/league" className={navLinkClass("/admin/league")}>
                    <Trophy size={18} />
                    League
                  </Link>
                  <Link to="/admin/images" className={navLinkClass("/admin/images")}>
                    <Image size={18} />
                    Images
                  </Link>
                  <Link to="/admin/data" className={navLinkClass("/admin/data")}>
                    <Database size={18} />
                    Data
                  </Link>
                </nav>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLayout;
