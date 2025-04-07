
export type SystemStatusType = 'healthy' | 'warning' | 'error' | 'maintenance';

export interface SystemStatusItem {
  name: string;
  status: SystemStatusType;
  value: string;
  metricValue: string;
  tooltip?: string;
  details?: string;
}

export interface SystemStatusItemProps extends SystemStatusItem {
  details?: string;
}

export interface SystemMetric {
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
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
    [key: string]: SystemMetric;
  };
  message?: string;
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
