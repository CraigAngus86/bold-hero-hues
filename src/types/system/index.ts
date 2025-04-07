
// Re-export types from the system directory
export * from './status';
export * from './logs';
export * from './images';

// Define SystemLog interface
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
