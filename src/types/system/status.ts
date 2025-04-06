
import { ReactNode } from 'react';

/**
 * Represents a system status item for display purposes
 */
export interface SystemStatusItemProps {
  name: string;
  status: 'healthy' | 'degraded' | 'error' | 'unknown';
  lastChecked: string | Date | null;
  metricValue?: string | number;
  icon?: ReactNode;
  tooltip?: string;
}

/**
 * Represents complete system status data
 */
export interface SystemStatusData {
  database: {
    status: 'healthy' | 'degraded' | 'error' | 'unknown';
    lastChecked: string | Date | null;
    metricValue?: string | number;
  };
  api: {
    status: 'healthy' | 'degraded' | 'error' | 'unknown';
    lastChecked: string | Date | null;
    metricValue?: string | number;
  };
  content: {
    status: 'healthy' | 'degraded' | 'error' | 'unknown';
    lastChecked: string | Date | null;
    metricValue?: string | number;
  };
  uploads: {
    status: 'healthy' | 'degraded' | 'error' | 'unknown';
    lastChecked: string | Date | null;
    metricValue?: string | number;
  };
}

/**
 * Props for the SystemStatus component
 */
export interface SystemStatusProps {
  systems: SystemStatusItemProps[];
  isLoading: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}
