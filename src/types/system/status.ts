
export interface SystemStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  message?: string;
  lastUpdated: string;
  metrics: {
    cpu: number;
    memory: number;
    storage: number;
    requests: number;
  };
}

export interface SystemStatusProps {
  data: SystemStatus;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  systems?: SystemStatusItem[];
  lastUpdated?: Date;
}

export interface SystemStatusItemProps {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  value?: string | number;
  Icon?: React.ComponentType<{ className?: string }>;
  details?: string;
  metricValue?: string | number;
  count?: number;
  color?: string;
  viewAllLink?: string;
}

export interface SystemStatusItem {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown' | 'active' | 'info' | 'online' | 'degraded' | 'offline';
  lastChecked: Date | string | null;
  metricValue?: string | number;
  tooltip?: string;
  icon?: React.ReactNode;
}

export interface ComponentStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  message?: string;
  lastUpdated: string;
  metrics?: Record<string, number>;
}

export interface SystemUsage {
  cpu: number;
  memory: number;
  storage: number;
  network: {
    in: number;
    out: number;
  };
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  timestamp: string;
  resolved: boolean;
}
