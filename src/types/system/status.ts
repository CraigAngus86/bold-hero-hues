
export interface SystemStatus {
  status: 'online' | 'degraded' | 'offline';
  lastChecked: Date;
  overall_status?: string;
  systemStatus?: string;
  services: {
    database: boolean;
    storage: boolean;
    authentication: boolean;
    api: boolean;
  };
}

export type SystemStatusName = 
  | 'database' 
  | 'storage' 
  | 'authentication' 
  | 'api' 
  | 'cache' 
  | 'media' 
  | 'fixtures' 
  | 'news' 
  | 'users' 
  | 'tickets';
