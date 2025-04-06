
import { LucideIcon } from "lucide-react";

export interface SystemStatusItemProps {
  name: string;
  status: 'healthy' | 'degraded' | 'error' | 'unknown' | 'active' | 'warning' | 'info' | 'online' | 'offline';
  lastChecked?: string;
  metricValue?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  count?: number;
  color?: string;
  viewAllLink?: string;
}

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

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  lastUpdated: string;
  message?: string;
  isHealthy?: boolean;
  components?: SystemComponent[];
  incidents?: SystemIncident[];
  metrics?: SystemMetrics;
  uptime?: number;
}

export interface SystemStatusProps {
  systems: SystemStatusItemProps[];
  isLoading: boolean;
  lastUpdated: Date;
  onRefresh: () => void;
}
