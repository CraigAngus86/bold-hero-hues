
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface SystemStatusItemProps {
  name: string;
  count: number;
  color: string;
  icon: LucideIcon;
  viewAllLink: string;
  status?: 'active' | 'warning' | 'error' | 'info' | 'healthy' | 'degraded' | 'unknown';
}

// Define SystemLog type that was missing
export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'error' | 'info' | 'warning' | 'success';
  message: string;
  source: string;
}
