
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface SystemStatusItemProps {
  name: string;
  count: number;
  color: string;
  icon: LucideIcon;
  viewAllLink: string;
  status?: 'active' | 'warning' | 'error' | 'info';
}
