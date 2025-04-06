
import { LucideIcon } from "lucide-react";

export interface SystemLog {
  id: string;
  timestamp: string | Date;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success' | 'debug';
  source: string;
  metadata?: Record<string, any>;
}

export interface SystemMetric {
  name: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: LucideIcon;
}

export interface SystemAlert {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: string | Date;
  dismissed?: boolean;
  link?: string;
}
