
export interface SystemMetric {
  name: string;
  value: number | string;
  change?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  unit?: string;
}

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown' | 'online' | 'offline' | 'degraded' | 'maintenance';
  lastUpdated: string;
  uptime: number;
  version: string;
  metrics: {
    memory: SystemMetric;
    cpu: SystemMetric;
    storage: SystemMetric;
    activeUsers: SystemMetric;
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
