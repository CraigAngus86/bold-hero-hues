
/**
 * System log level
 */
export type SystemLogLevel = 'info' | 'warning' | 'error' | 'debug' | 'success';

/**
 * System log entry type
 */
export interface SystemLog {
  id: string;
  timestamp: string;
  type: SystemLogLevel;
  message: string;
  source?: string;
  details?: any;
}
