
/**
 * System log entry type
 */
export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  context?: string;
  timestamp: string;
  source?: string;
  details?: any;
}

/**
 * System status type
 */
export interface SystemStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  lastUpdated: string;
  message?: string;
}
