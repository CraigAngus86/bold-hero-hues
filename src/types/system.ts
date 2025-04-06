
export interface SystemComponent {
  id: string;
  name: string;
  status: string;
  isHealthy: boolean;
  lastChecked: string;
}

export interface SystemIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  isResolved: boolean;
  resolvedDate?: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeUsers: number;
  responseTime: number;
  uptime: number;
}

export interface SystemStatus {
  isHealthy: boolean;
  components: SystemComponent[];
  incidents: SystemIncident[];
  metrics: SystemMetrics;
  lastUpdated: string;
}

export interface SystemLog {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'debug';
  message: string;
  timestamp: string;
  source: string;
  created_at: string;
}

export interface SystemLogsResponse {
  success: boolean;
  data: SystemLog[];
  count?: number;
  error?: string;
}
