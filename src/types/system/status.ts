
export type SystemStatusType = 'healthy' | 'warning' | 'error' | 'maintenance';

export interface SystemStatusItem {
  name: string;
  status: SystemStatusType;
  value: string;
  metricValue: string;
  tooltip?: string;
  details?: string;
  lastChecked?: Date | string;
  icon?: React.ComponentType;
  color?: string;
  viewAllLink?: string;
}

export interface SystemStatusItemProps extends SystemStatusItem {
  details?: string;
}

export interface SystemMetric {
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
  name?: string;
  unit?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
  change?: number;
}

export interface SystemStatus {
  status: SystemStatusType;
  lastUpdated: string;
  items: SystemStatusItem[];
  metrics?: {
    memory: SystemMetric;
    cpu: SystemMetric;
    storage: SystemMetric;
    activeUsers: SystemMetric;
    requests?: number;
    [key: string]: SystemMetric | number | undefined;
  };
  message?: string;
  uptime?: number;
  version?: string;
  services?: {
    database: {
      status: string;
      latency: number;
    };
    api: {
      status: string;
      latency: number;
      requestsPerMinute: number;
    };
    storage: {
      status: string;
      availableSpace: number;
      totalSize: number;
    };
    [key: string]: any;
  };
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  created_at?: string;
}

export interface SystemStatusPanelProps {
  status: SystemStatus | null;
  isLoading: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export interface SystemStatusProps {
  systems: SystemStatusItem[];
  isLoading: boolean;
  lastUpdated: Date;
  onRefresh: () => void;
}
