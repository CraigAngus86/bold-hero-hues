
/**
 * Represents a system log entry
 */
export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'debug' | 'success';
  source: string;
  message: string;
  metadata?: Record<string, any>;
}
