
import { ReactNode } from 'react';

export type SystemStatusName = 'healthy' | 'warning' | 'degraded' | 'critical' | 'unknown';

export interface SystemMetric {
  name: string;
  value: number;
  unit?: string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  changeDirection?: 'up' | 'down';
  icon?: ReactNode;
  description?: string;
}

export interface SystemMetricsGroups {
  performance: SystemMetric[];
  storage: SystemMetric[];
  usage: SystemMetric[];
  [key: string]: SystemMetric[] | any;
}

export interface Service {
  name: string;
  status: SystemStatusName;
  lastChecked: Date | string;
  message?: string;
  uptime: number;
}

export interface SystemStatus {
  overall_status: SystemStatusName;
  message: string;
  uptime: number;
  metrics: SystemMetricsGroups;
  services: Service[];
  messages?: string[];
  last_updated: Date | string;
  version?: string;
}

export interface SystemLog {
  id: string;
  timestamp: Date | string;
  type: 'info' | 'warning' | 'error';
  source: string;
  message: string;
}
