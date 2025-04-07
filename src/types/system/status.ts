
export type SystemStatusType = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface SystemStatus {
  id?: string;
  component: string;
  status: SystemStatusType;
  last_updated: string;
  message?: string;
  details?: Record<string, any>;
}

export interface SystemStatusResponse {
  status: SystemStatusType;
  components: {
    [key: string]: {
      status: SystemStatusType;
      message?: string;
      last_updated?: string;
    };
  };
  last_updated: string;
}
