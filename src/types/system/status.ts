
export interface SystemStatus {
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  lastUpdated: string;
  message?: string;
  metrics: {
    users: number;
    activeUsers: number;
    uptime: number;
    responseTime: number;
  };
}
