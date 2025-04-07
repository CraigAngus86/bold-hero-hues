
export type SystemStatusName = 'healthy' | 'warning' | 'critical' | 'unknown';

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
  type: 'info' | 'warning' | 'error';
  message: string;
  source: string;
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
