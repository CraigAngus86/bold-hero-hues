
export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  uptime: number;
  message: string;
  lastChecked: string;
}

export interface MetricItem {
  name: string;
  value: number;
  unit: string;
}

export interface SystemMetrics {
  performance: MetricItem[];
  storage: MetricItem[];
  usage: MetricItem[];
}

export interface SystemStatus {
  overall_status: 'healthy' | 'degraded' | 'offline';
  message: string;
  uptime: number;
  last_updated: string;
  services: ServiceStatus[];
  metrics: SystemMetrics;
  logs?: any[]; // Optional logs field
}
