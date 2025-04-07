
export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'debug';
  message: string;
  source: string;
  level?: string;
}

export interface SystemLogResponse {
  success: boolean;
  data?: SystemLog[];
  error?: string;
}

export interface ClearSystemLogsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  lastUpdated: string;
  metrics: {
    cpu: number;
    memory: number;
    storage: number;
    requests: number;
  };
  message?: string;
  components?: {
    database?: {
      status: string;
      responseTime?: number;
      lastChecked?: string;
    };
    storage?: {
      status: string;
      usedSpace?: number;
      lastChecked?: string;
    };
    auth?: {
      status: string;
      activeUsers?: number;
      lastChecked?: string;
    };
    api?: {
      status: string;
      responseTime?: number;
      lastChecked?: string;
    };
  };
}
