
export interface SystemStatus {
  status: 'online' | 'offline' | 'degraded' | 'maintenance' | 'healthy' | 'warning' | 'error' | 'unknown';
  lastUpdated: string;
  message?: string;
  metrics: {
    users: number;
    activeUsers: number;
    uptime: number;
    responseTime: number;
    cpu: number;
    memory: number;
    storage: number;
    requests: number;
  };
}

export type SystemStatusType = 'healthy' | 'warning' | 'error' | 'unknown';

export interface SystemStatusItemProps {
  name: string;
  status: SystemStatusType;
  metricValue?: string | number;
  icon?: React.ElementType;
  tooltip?: string;
  lastChecked?: string;
  color?: string;
  viewAllLink?: string;
}

export interface SystemStatusProps {
  systems: SystemStatusItemProps[];
  isLoading: boolean;
  lastUpdated: string | Date;
  onRefresh: () => void;
}
