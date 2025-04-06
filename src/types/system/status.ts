
import { ReactNode } from 'react';

export interface SystemStatusItemProps {
  name: string;
  status: 'healthy' | 'degraded' | 'error' | 'unknown';
  lastChecked: Date | string | null;
  icon?: ReactNode;
  tooltip?: string;
  metricValue?: string;
}

export interface SystemStatusProps {
  systems: SystemStatusItemProps[];
  isLoading?: boolean;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
}

export interface SystemStatusData {
  database: {
    status: string;
    lastChecked: Date;
    metricValue: string;
  };
  api: {
    status: string;
    lastChecked: Date;
    metricValue: string;
  };
  content: {
    status: string;
    lastChecked: Date;
    metricValue: string;
  };
  uploads: {
    status: string;
    lastChecked: Date;
    metricValue: string;
  };
}
