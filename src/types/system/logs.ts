
export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  details?: Record<string, any>;
}

export interface SystemLogResponse {
  data: SystemLog[];
  error: null | string;
}

export interface ClearSystemLogsResponse {
  success: boolean;
  error: null | string;
}
