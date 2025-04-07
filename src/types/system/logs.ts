
/**
 * System log level
 */
export type SystemLogLevel = 'info' | 'warning' | 'error' | 'debug';

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

// Export system log types
export type { SystemLog };
