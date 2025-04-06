
export interface SystemLog {
  id: string;
  timestamp: string | Date;
  type: 'error' | 'warning' | 'info' | 'success' | 'debug';
  message: string;
  source: string;
  metadata?: Record<string, any>;
}

export interface SystemStatus {
  status: 'online' | 'degraded' | 'maintenance' | 'offline';
  lastCheck: Date;
  uptimePercentage: number;
  message?: string;
  services: {
    database: boolean;
    api: boolean;
    storage: boolean;
    auth: boolean;
  };
  issues?: Array<{
    component: string;
    message: string;
    timestamp: Date;
  }>;
}

export interface SystemLogStats {
  total: number;
  byType: {
    error: number;
    warning: number;
    info: number;
    success: number;
    debug: number;
  };
  recentErrors: SystemLog[];
}
