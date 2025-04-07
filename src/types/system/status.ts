
export type SystemStatusName = 'healthy' | 'warning' | 'error' | 'critical' | 'unknown' | 'degraded';

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
}

export interface Service {
  name: string;
  status: SystemStatusName;
  lastChecked: string;
  message: string;
  uptime: number;
}

export interface SystemStatus {
  overall_status: SystemStatusName;
  message: string;
  uptime: number;
  metrics: {
    performance: SystemMetric[];
    storage: SystemMetric[];
    usage: SystemMetric[];
  };
  services: Service[];
  messages: string[];
  last_updated: string;
  version: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
  source: string;
  message: string;
}
