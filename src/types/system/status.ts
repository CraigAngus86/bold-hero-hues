
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
  details?: string;
  value?: string | number;
}

export interface SystemStatusProps {
  systems: SystemStatusItemProps[];
  isLoading: boolean;
  lastUpdated: string | Date;
  onRefresh: () => void;
}

export interface StatusItemProps {
  name: string;
  status: SystemStatusType;
  icon: React.ElementType;
  color: string;
  viewAllLink: string;
}
