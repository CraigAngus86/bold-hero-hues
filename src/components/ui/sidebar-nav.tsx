
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  
  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            location.pathname === item.href || 
            (item.href !== '/admin' && location.pathname.startsWith(item.href))
              ? "bg-accent text-accent-foreground" 
              : "transparent"
          )}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
