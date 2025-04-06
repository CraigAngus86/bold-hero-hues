
import { LucideIcon } from "lucide-react";

export interface SystemStatusItemProps {
  name: string;
  status: 'healthy' | 'degraded' | 'error' | 'unknown';
  lastChecked?: string;
  metricValue?: string;
  icon: LucideIcon;
  tooltip?: string;
}

export interface SystemStatusProps {
  systems: SystemStatusItemProps[];
  isLoading: boolean;
  lastUpdated: Date;
  onRefresh: () => void;
}
