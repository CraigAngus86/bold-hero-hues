
/**
 * System status type definition
 */
export interface SystemStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  message?: string;
  lastUpdated: string;
  metrics: {
    cpu: number;
    memory: number;
    storage: number;
    requests: number;
  };
}

/**
 * System component status type
 */
export interface ComponentStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  message?: string;
  lastUpdated: string;
  metrics?: Record<string, number>;
}

/**
 * System usage metrics
 */
export interface SystemUsage {
  cpu: number;
  memory: number;
  storage: number;
  network: {
    in: number;
    out: number;
  };
}
