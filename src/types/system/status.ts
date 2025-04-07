
import { ReactNode } from 'react';

export type SystemStatusName = 'healthy' | 'warning' | 'error' | 'offline' | 'maintenance';

export interface SystemStatusItemProps {
  name: string;
  status: SystemStatusName;
  value?: string;
  metricValue?: string;
  tooltip?: string;
  lastChecked: Date | string;
  icon: ReactNode;
  color: string;
}

export interface SystemStatus {
  overall_status: SystemStatusName;
  services: {
    [key: string]: {
      status: SystemStatusName;
      lastChecked: Date | string;
    }
  };
  metrics: {
    uptime: number;
    responseTime: number;
    errors24h: number;
    totalRequests24h: number;
    performance?: {
      cpu: number;
      memory: number;
      disk: number;
    };
    storage?: {
      total: number;
      used: number;
      free: number;
    };
    usage?: {
      requests: number;
      bandwidth: number;
      users: number;
    };
  };
  uptime: {
    day: number;
    week: number;
    month: number;
  };
  message: string;
  messages?: string[];
  last_updated?: string | Date;
  version?: string;
}

export interface SystemStatusPanelProps {
  status: SystemStatus;
  isLoading?: boolean;
  onRefresh?: () => void | Promise<void>;
  error?: string;
}

export interface SystemMetric {
  name: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  unit?: string;
  changeDirection?: 'up' | 'down' | 'none';
}

export interface StatusItemCardProps {
  title: string;
  value: string | number;
  status?: SystemStatusName;
  icon?: ReactNode;
  color?: string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  lastUpdated?: Date | string;
}

// Adding ServerStatus type for mock data
export interface ServerStatus {
  status: 'active' | 'error' | 'maintenance';
  uptime: string;
  lastChecked: Date;
}

// Adding SystemLog for dashboard refresh
export interface SystemLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error';
  source: string;
  message: string;
}

// Alias for backward compatibility
export type SystemStatusType = SystemStatusName;
