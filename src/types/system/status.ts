
export interface SystemMetric {
  name: string;
  value: number | string;
  change?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  unit?: string;
}

export type SystemStatusType = 'healthy' | 'warning' | 'error' | 'unknown' | 'online' | 'offline' | 'degraded' | 'maintenance';

export interface SystemStatus {
  status: SystemStatusType;
  lastUpdated: string;
  uptime: number;
  version: string;
  message?: string;
  metrics: {
    memory: SystemMetric;
    cpu: SystemMetric;
    storage: SystemMetric;
    activeUsers: SystemMetric;
    requests?: number;
  };
  services: {
    database: {
      status: 'healthy' | 'warning' | 'error' | 'unknown';
      latency: number;
    };
    api: {
      status: 'healthy' | 'warning' | 'error' | 'unknown';
      latency: number;
      requestsPerMinute: number;
    };
    storage: {
      status: 'healthy' | 'warning' | 'error' | 'unknown';
      availableSpace: number;
      totalSize: number;
    };
  };
}

export interface SystemStatusItemProps {
  name: string;
  status: SystemStatusType;
  metricValue?: string | number;
  icon?: React.ElementType;
  tooltip?: string;
  lastChecked?: string;
  color?: string;
  viewAllLink?: string;
  count?: any;
  value?: string | number;
  details?: string; // Adding details property
}

export interface SystemStatusProps {
  systems: SystemStatusItemProps[];
  isLoading: boolean;
  lastUpdated: Date;
  onRefresh: () => void;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: string;
}
