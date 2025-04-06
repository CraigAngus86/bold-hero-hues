
/**
 * Represents a system log entry
 */
export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'debug';
  source: string;
  message: string;
}
