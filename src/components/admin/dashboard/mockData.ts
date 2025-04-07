
import { SystemStatusItemProps } from '@/types/system/status';

// Mock data for dashboard status items
export const mockStatusItems: SystemStatusItemProps[] = [
  {
    name: 'Users',
    status: 'healthy',
    value: '1,248',
    metricValue: '+12%',
    details: 'Active users in the last 30 days'
  },
  {
    name: 'News',
    status: 'info' as const,
    value: '48',
    metricValue: '+3',
    details: 'News articles published'
  },
  {
    name: 'System',
    status: 'info' as const,
    value: '99.9%',
    metricValue: 'Uptime',
    details: 'Server status'
  },
  {
    name: 'Storage',
    status: 'info' as const,
    value: '45%',
    metricValue: 'Used',
    details: 'Storage usage'
  }
];
