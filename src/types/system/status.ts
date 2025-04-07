
export type SystemStatusType = 'error' | 'warning' | 'healthy' | 'unknown';

export interface SystemStatusItemProps {
  name: string;
  status: SystemStatusType;
  value?: string;
  metricValue?: string;
  details?: string;
  lastChecked?: string;
  icon?: React.ElementType;
  count?: number;
  color?: string;
  viewAllLink?: string;
  tooltip?: string;
}

export interface SystemStatus {
  status: SystemStatusType;
  lastUpdated: string;
  metrics: {
    cpu: number;
    memory: number;
    storage: number;
    requests: number;
  };
  message?: string;
}

export interface SystemStatusProps {
  systems: SystemStatusItemProps[];
  isLoading: boolean;
  lastUpdated: string | Date;
  onRefresh: () => void;
}
