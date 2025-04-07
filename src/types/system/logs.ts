
import { SystemLog } from './status';

export interface SystemLogFilter {
  type?: 'info' | 'warning' | 'error' | 'all';
  source?: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  searchTerm?: string;
}

export interface SystemLogEntry extends SystemLog {
  details?: Record<string, any>;
  related_entity?: {
    type: string;
    id: string;
    name: string;
  };
}

export interface LogAnalytics {
  info_count: number;
  warning_count: number;
  error_count: number;
  total_count: number;
  top_sources: Array<{
    source: string;
    count: number;
  }>;
  trend: Array<{
    date: string;
    info: number;
    warning: number;
    error: number;
  }>;
}

export interface SystemLogsResponse {
  logs: SystemLogEntry[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  analytics?: LogAnalytics;
}
