
export type SystemStatusType = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface SystemService {
  name: string;
  status: SystemStatusType;
  message?: string;
  uptime?: number;
  response_time?: number;
  last_checked?: string;
}

export interface SystemMetric {
  name: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeDirection?: 'up' | 'down' | 'stable';
  status?: SystemStatusType;
  description?: string;
}

export interface SystemStatus {
  overall_status: SystemStatusType;
  last_updated: string;
  uptime?: number;
  version?: string;
  services?: SystemService[];
  metrics?: {
    performance?: SystemMetric[];
    storage?: SystemMetric[];
    usage?: SystemMetric[];
  };
  messages?: string[];
}

export interface SystemStatusItemProps {
  name: string;
  status: SystemStatusType;
  value: string;
  metricValue?: string;
  tooltip?: string;
  lastChecked?: string;
  icon?: React.ComponentType<any>;
  color?: string;
  viewAllLink?: string;
  details?: string;
}

export interface SystemLog {
  id: string;
  timestamp: Date | string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  details?: any;
}

export interface SystemStatusProps {
  systems: SystemStatus;
  isLoading: boolean;
  lastUpdated: Date;
  onRefresh: () => void;
  error?: string;
}

export interface StatusItemProps {
  name: string;
  status: SystemStatusType;
  value: string;
  metricValue: string;
  tooltip?: string;
  lastChecked: string;
  icon?: React.ComponentType<any>;
  color?: string;
  viewAllLink?: string;
  details?: string;
}

export interface SystemStatusPanelProps {
  status: SystemStatus;
  isLoading: boolean;
  onRefresh: () => void;
  error?: string;
}
