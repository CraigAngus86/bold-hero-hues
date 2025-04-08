
export interface SystemStatus {
  status: 'online' | 'degraded' | 'offline';
  lastChecked: Date;
  services: {
    database: boolean;
    storage: boolean;
    authentication: boolean;
    api: boolean;
  };
}
