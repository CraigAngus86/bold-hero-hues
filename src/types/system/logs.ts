
export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'debug';
  message: string;
  source: string;
  details?: any;
}

export type SystemLogLevel = 'info' | 'warning' | 'error' | 'success' | 'debug';
