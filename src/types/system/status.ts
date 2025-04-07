
export type SystemStatusName = 'healthy' | 'warning' | 'critical' | 'unknown' | 'degraded' | 'error';

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
}

export interface SystemService {
  name: string;
  status: SystemStatusName;
  uptime: number;
  message: string;
  lastChecked: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'debug';
  message: string;
  source: string;
  details?: any;
}

export interface SystemStatus {
  overall_status: SystemStatusName;
  message: string;
  uptime: number;
  last_updated: string;
  services?: SystemService[];
  metrics?: {
    performance?: SystemMetric[];
    storage?: SystemMetric[];
    usage?: SystemMetric[];
  };
  logs?: SystemLog[];
}
