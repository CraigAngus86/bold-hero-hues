
/**
 * System related type definitions
 */

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'error' | 'warning' | 'info' | 'debug';
  source: string;
  message: string;
}
