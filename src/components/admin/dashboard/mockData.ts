
import { SystemStatus, SystemStatusName } from '@/types/system/status';

export const mockSystemStatus: SystemStatus = {
  database: {
    name: 'Database',
    status: 'healthy' as SystemStatusName,
    value: '100% uptime',
    lastChecked: new Date(Date.now() - 300000) // 5 minutes ago
  },
  api: {
    name: 'API',
    status: 'healthy' as SystemStatusName,
    value: '348ms avg',
    lastChecked: new Date(Date.now() - 120000) // 2 minutes ago
  },
  storage: {
    name: 'Storage',
    status: 'warning' as SystemStatusName,
    value: '83% capacity',
    lastChecked: new Date(Date.now() - 180000), // 3 minutes ago
    description: 'Storage usage is getting high'
  },
  auth: {
    name: 'Authentication',
    status: 'healthy' as SystemStatusName,
    value: '122 sessions',
    lastChecked: new Date(Date.now() - 60000) // 1 minute ago
  },
  overall: 'warning' as SystemStatusName,
  lastUpdated: new Date()
};

export default mockSystemStatus;
