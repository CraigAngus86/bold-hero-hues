
export interface SystemLog {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success' | 'debug';
  message: string;
  source: string;
  timestamp: Date | string;
  details?: any;
  metadata?: Record<string, any>;
  module?: string; // For backward compatibility
  level?: string; // For backward compatibility
  created_at?: string; // For backward compatibility
}

export interface SystemLogResponse {
  data: SystemLog[] | null;
  error: any | null;
}
