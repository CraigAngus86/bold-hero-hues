
import { ReactNode } from 'react';

export type SystemStatusType = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface SystemMetric {
  name: string;
  value: number | string;
  status: SystemStatusType;
  description?: string;
  change?: number;
  unit?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
}

export interface ServiceStatus {
  name: string;
  status: SystemStatusType;
  uptime?: number;
  response_time?: number;
  last_checked?: string;
  message?: string;
}

export interface SystemStatus {
  id?: string;
  component: string;
  status: SystemStatusType;
  overall_status: SystemStatusType;
  last_updated: string;
  message?: string;
  uptime?: number;
  version?: string;
  details?: Record<string, any>;
  services?: ServiceStatus[];
  messages?: string[];
  metrics?: {
    performance?: SystemMetric[];
    storage?: SystemMetric[];
    usage?: SystemMetric[];
  };
}

export interface SystemStatusPanelProps {
  status: SystemStatus;
  isLoading?: boolean;
  onRefresh?: () => void;
  error?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  details?: Record<string, any>;
}

export interface StatusItemProps {
  status: SystemStatusType;
  value: string | ReactNode;
  metricValue: string | ReactNode;
  tooltip?: string;
  lastChecked: string | Date;
  icon: ReactNode;
  color: string;
}

export interface SystemStatusItemProps {
  name: string;
  status: SystemStatusType;
  value: string | ReactNode;
  metricValue: string | ReactNode;
  tooltip?: string;
  lastChecked: string | Date;
  icon: ReactNode;
  color: string;
  viewAllLink?: string;
}
