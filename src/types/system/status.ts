
export type SystemStatusName = 'healthy' | 'warning' | 'degraded' | 'critical' | 'error' | 'unknown' | 'offline' | 'maintenance';

export interface SystemStatusItem {
  name: string;
  status: SystemStatusName;
  value?: string;
  lastChecked: Date;
  description?: string;
}

export interface SystemStatus {
  database: SystemStatusItem;
  api: SystemStatusItem;
  storage: SystemStatusItem;
  auth: SystemStatusItem;
  overall: SystemStatusName;
  lastUpdated: Date;
}
