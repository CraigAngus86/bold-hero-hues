
import { LucideIcon } from "lucide-react";

export interface SystemStatusItemProps {
  name: string;
  status: 'healthy' | 'degraded' | 'error' | 'unknown' | 'active' | 'warning' | 'info';
  lastChecked?: string;
  metricValue?: string;
  icon: LucideIcon;
  tooltip?: string;
  count?: number;
  color?: string;
  viewAllLink?: string;
}

export interface SystemStatusProps {
  systems: SystemStatusItemProps[];
  isLoading: boolean;
  lastUpdated: Date;
  onRefresh: () => void;
}
