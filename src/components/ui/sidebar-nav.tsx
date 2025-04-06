
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Table, 
  Calendar, 
  Users, 
  FileText, 
  Banknote, 
  Image, 
  FileCode, 
  Settings,
  LucideIcon
} from "lucide-react";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon?: string;
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();

  // Map icon strings to Lucide icons
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "dashboard": return <LayoutDashboard className="h-4 w-4" />;
      case "table": return <Table className="h-4 w-4" />;
      case "calendar": return <Calendar className="h-4 w-4" />;
      case "users": return <Users className="h-4 w-4" />;
      case "news": return <FileText className="h-4 w-4" />;
      case "sponsors": return <Banknote className="h-4 w-4" />;
      case "images": return <Image className="h-4 w-4" />;
      case "cms": return <FileCode className="h-4 w-4" />;
      case "settings": return <Settings className="h-4 w-4" />;
      default: return null;
    }
  };
  
  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            location.pathname === item.href 
              ? "bg-accent text-accent-foreground" 
              : "transparent"
          )}
        >
          {getIcon(item.icon)}
          <span className="ml-2">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
