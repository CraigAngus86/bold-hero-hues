
/**
 * System log entry type
 */
export interface SystemLog {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  source?: string;
  details?: any;
}

/**
 * Possible system status names
 */
export type SystemStatusName = 'healthy' | 'warning' | 'error' | 'unknown';

/**
 * Service status type
 */
export interface ServiceStatus {
  name: string;
  status: SystemStatusName;
  uptime: number;
  message: string;
  lastChecked: string;
}

/**
 * System metric type
 */
export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
}

/**
 * System metrics categories
 */
export interface SystemMetrics {
  performance: SystemMetric[];
  storage: SystemMetric[];
  usage: SystemMetric[];
}

/**
 * Complete system status type
 */
export interface SystemStatus {
  overall_status: SystemStatusName;
  message: string;
  uptime: number;
  last_updated: string;
  services: ServiceStatus[];
  metrics: SystemMetrics;
  logs: SystemLog[];
}
