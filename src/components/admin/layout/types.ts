
import React from 'react';

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export interface SidebarNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

export interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  handleLogout: () => void;
}

export interface MobileSidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
}

export interface HeaderProps {
  setIsMobileSidebarOpen: (open: boolean) => void;
  navItems: SidebarNavItem[];
}
