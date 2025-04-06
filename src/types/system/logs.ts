
export interface SystemLog {
  id: string;
  level?: string; // For backward compatibility
  type: 'error' | 'warning' | 'info' | 'success' | 'debug';
  message: string;
  source: string;
  context?: string;
  timestamp: Date | string;
  details?: any;
  metadata?: Record<string, any>;
  module?: string; // For backward compatibility
  created_at?: string; // For backward compatibility
}

export interface SystemLogResponse {
  data: SystemLog[] | null;
  error: string | null;
  success: boolean;
}

export interface ClearSystemLogsResponse {
  success: boolean;
  error: string | null;
  message?: string;
}
