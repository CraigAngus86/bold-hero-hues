
export interface SystemLog {
  id: string;
  timestamp: string;
  message: string;
  source: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'debug';
}

export interface SystemLogResponse {
  success: boolean;
  data: SystemLog[];
  error?: string;
}

export interface ClearSystemLogsResponse {
  success: boolean;
  error?: string;
}
