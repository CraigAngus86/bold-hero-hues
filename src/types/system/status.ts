
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

export interface SystemStatusProps {
  data: SystemStatus;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

export interface SystemStatusItemProps {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  value: string | number;
  Icon: React.ComponentType<{ className?: string }>;
  details?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  message: string;
  source: string;
  level: 'info' | 'warning' | 'error' | 'debug';
}

export interface ComponentStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  message?: string;
  lastUpdated: string;
  metrics?: Record<string, number>;
}

export interface SystemUsage {
  cpu: number;
  memory: number;
  storage: number;
  network: {
    in: number;
    out: number;
  };
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export type BucketType = 'team' | 'news' | 'events' | 'sponsors' | 'general' | 'uploads' | 'products';
