
import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { ChevronLeft, UserIcon, MenuIcon } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define admin navigation items
  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: "dashboard",
    },
    {
      title: "League Table",
      href: "/admin/league-table-management",
      icon: "table",
    },
    {
      title: "Fixtures & Results",
      href: "/admin/fixtures",
      icon: "calendar",
    },
    {
      title: "Team Management",
      href: "/admin/team",
      icon: "users",
    },
    {
      title: "News & Updates",
      href: "/admin/news",
      icon: "news",
    },
    {
      title: "Sponsors",
      href: "/admin/sponsors",
      icon: "sponsors",
    },
    {
      title: "Media & Images",
      href: "/admin/images",
      icon: "images",
    },
    {
      title: "CMS",
      href: "/admin/cms",
      icon: "cms",
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: "settings",
    },
  ];

  const handleSignOut = () => {
    // Sign out logic here
    navigate('/login');
  };

  // Check if the current path is in the nav items
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Site
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="gap-2"
            >
              <UserIcon className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <SidebarNav items={navItems} className="p-4 pt-6" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden pt-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
