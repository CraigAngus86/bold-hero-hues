
export type SystemStatusType = 'error' | 'warning' | 'healthy' | 'unknown';

export interface SystemStatusItemProps {
  name: string;
  status: SystemStatusType;
  value?: string;
  metricValue?: string;
  details?: string;
  lastChecked?: string;
  icon?: React.ElementType;
  count?: number;
  color?: string;
  viewAllLink?: string;
}
