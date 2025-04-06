
export interface SystemStatusItemProps {
  name: string;
  status?: 'healthy' | 'warning' | 'error' | 'info' | 'offline' | 'active' | 'degraded' | 'online';
  metricValue?: string | number;
  count?: number;
  icon?: React.ElementType;
  color?: string;
  viewAllLink?: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeUsers: number;
  responseTime: number;
  uptime: number;
  fixturesCount?: number;
  newsCount?: number;
  dailyActiveUsers?: number;
}

export interface SystemComponent {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  lastUpdated: string;
  details?: string;
}

export interface SystemIncident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  createdAt: string;
  updatedAt: string;
  message: string;
  affectedComponents?: string[];
}

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'unknown';
  isHealthy?: boolean;
  lastUpdated: string;
  metrics: SystemMetrics;
  components?: SystemComponent[];
  incidents?: SystemIncident[];
}

export interface SystemStatusResponse {
  success: boolean;
  data?: SystemStatus;
  error?: string;
}
