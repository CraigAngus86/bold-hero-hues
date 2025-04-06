
export interface SystemLog {
  id: string;
  timestamp: string | Date;
  type: 'error' | 'warning' | 'info' | 'success' | 'debug';
  message: string;
  source: string;
  metadata?: Record<string, any>;
}

export interface SystemLogFilter {
  type?: string[];
  source?: string[];
  from?: Date | null;
  to?: Date | null;
  search?: string;
}
