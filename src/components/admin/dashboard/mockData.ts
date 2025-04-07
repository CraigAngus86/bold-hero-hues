
import { SystemLog, SystemStatus, SystemStatusName } from '@/types/system/status';

export const generateMockSystemStatus = (): SystemStatus => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 3600000);
  const twoHoursAgo = new Date(now.getTime() - 7200000);
  
  const mockLogs: SystemLog[] = [
    {
      id: '1',
      timestamp: now.toISOString(),
      type: 'info',
      message: 'System started successfully',
      source: 'system'
    },
    {
      id: '2',
      timestamp: oneHourAgo.toISOString(),
      type: 'warning',
      message: 'High CPU usage detected',
      source: 'monitoring'
    },
    {
      id: '3',
      timestamp: twoHoursAgo.toISOString(),
      type: 'error',
      message: 'Database connection failed',
      source: 'database'
    }
  ];
  
  return {
    overall_status: 'healthy' as SystemStatusName,
    message: 'All systems operational',
    uptime: 14400, // 4 hours in seconds
    last_updated: now.toISOString(),
    services: [
      {
        name: 'Database',
        status: 'healthy',
        uptime: 14400,
        message: 'Connected and responding normally',
        lastChecked: now.toISOString(),
      },
      {
        name: 'API Server',
        status: 'healthy',
        uptime: 14300,
        message: 'Processing requests within normal parameters',
        lastChecked: now.toISOString(),
      },
      {
        name: 'Storage',
        status: 'warning',
        uptime: 14400,
        message: 'Storage capacity at 85%',
        lastChecked: now.toISOString(),
      }
    ],
    metrics: {
      performance: [
        { name: 'Request Latency', value: 120, unit: 'ms' },
        { name: 'CPU Usage', value: 45, unit: '%' }
      ],
      storage: [
        { name: 'Database Size', value: 852, unit: 'MB' },
        { name: 'File Storage', value: 4.2, unit: 'GB' }
      ],
      usage: [
        { name: 'Active Users', value: 143, unit: 'users' },
        { name: 'Requests/min', value: 86, unit: 'rpm' }
      ]
    },
    logs: mockLogs
  };
};
