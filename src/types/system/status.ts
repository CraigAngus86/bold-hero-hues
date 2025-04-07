
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
  };
  uptime: {
    day: number;
    week: number;
    month: number;
  };
  message: string;
  messages?: string[];
}

export interface SystemStatusPanelProps {
  status: SystemStatus;
}

export interface SystemMetric {
  name: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
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
