
import { SystemStatusItemProps } from '@/types/system/status';

// Mock data for dashboard status items
export const mockStatusItems: SystemStatusItemProps[] = [
  {
    name: 'Users',
    status: 'healthy',
    value: '1,248',
    metricValue: '+12%',
    tooltip: 'Active users in the last 30 days'
  },
  {
    name: 'News',
    status: 'healthy',
    value: '48',
    metricValue: '+3',
    tooltip: 'News articles published'
  },
  {
    name: 'System',
    status: 'healthy',
    value: '99.9%',
    metricValue: 'Uptime',
    tooltip: 'Server status'
  },
  {
    name: 'Storage',
    status: 'healthy',
    value: '45%',
    metricValue: 'Used',
    tooltip: 'Storage usage'
  }
];
