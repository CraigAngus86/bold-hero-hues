
// Define type for system status names
export type SystemStatusName = 'healthy' | 'warning' | 'degraded' | 'error' | 'critical' | 'unknown';

// Define types for system metrics
export interface Metric {
  name: string;
  value: number | string;
  unit: string;
}

// Define types for system service statuses
export interface Service {
  name: string;
  status: SystemStatusName;
  uptime: number;
  message: string;
  lastChecked: string;
}

// Define type for system logs
export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

// Define comprehensive system status interface
export interface SystemStatus {
  overall_status: SystemStatusName;
  message?: string;
  uptime: number;
  last_updated: string;
  services: Service[];
  metrics: {
    performance: Metric[];
    storage: Metric[];
    usage: Metric[];
  };
  logs?: SystemLog[];
}

// Define interfaces for system status service responses
export interface GetSystemStatusResponse {
  status: SystemStatus | null;
  error: null | string;
}

export interface UpdateServiceStatusResponse {
  success: boolean;
  error: null | string;
}
