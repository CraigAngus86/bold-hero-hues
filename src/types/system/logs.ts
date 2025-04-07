
export interface SystemLog {
  id: string;
  message: string;
  source: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'debug';
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
