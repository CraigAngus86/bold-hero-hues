
export interface SystemStatusItemProps {
  service: {
    name: string;
    status: 'online' | 'offline' | 'warning' | 'maintenance';
    message?: string;
    lastChecked: Date;
    uptime?: number;
    responseTime?: number;
  };
}
