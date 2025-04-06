
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

/**
 * Options for filtering system logs
 */
export interface LogFilterOptions {
  startDate?: string;
  endDate?: string;
  types?: ('info' | 'warning' | 'error' | 'debug' | 'success')[];
  source?: string;
  search?: string;
  limit?: number;
  page?: number;
}
