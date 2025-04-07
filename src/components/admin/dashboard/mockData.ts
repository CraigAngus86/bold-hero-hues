
import { SystemStatus, SystemStatusName, SystemLog } from '@/types/system/status';

export const mockSystemStatus: SystemStatus = {
  overall_status: 'healthy',
  message: 'All systems operational',
  uptime: 99.98,
  metrics: {
    performance: {
      cpu: 32,
      memory: 41,
      requests: 214,
    },
    storage: {
      total: 1000,
      used: 350,
      free: 650,
    },
    usage: {
      requests: 15482,
      bandwidth: 125,
      users: 324,
    }
  },
  services: [
    {
      name: 'Web Server',
      status: 'healthy' as SystemStatusName,
      lastChecked: new Date().toISOString(),
      message: 'Normal response times',
      uptime: 99.9
    },
    {
      name: 'Database',
      status: 'healthy' as SystemStatusName,
      lastChecked: new Date().toISOString(),
      message: 'Normal query execution times',
      uptime: 99.8
    },
    {
      name: 'Storage Service',
      status: 'healthy' as SystemStatusName,
      lastChecked: new Date().toISOString(),
      message: 'Normal file operations',
      uptime: 99.7
    },
    {
      name: 'Email Service',
      status: 'warning' as SystemStatusName,
      lastChecked: new Date().toISOString(),
      message: 'Delayed email delivery',
      uptime: 97.5
    },
    {
      name: 'Payment Gateway',
      status: 'healthy' as SystemStatusName,
      lastChecked: new Date().toISOString(),
      message: 'Normal transaction processing',
      uptime: 99.95
    }
  ],
  messages: [
    'All systems functioning normally',
    'Recent update completed successfully'
  ],
  last_updated: new Date().toISOString(),
  version: '1.2.3'
};

export const mockSystemLogs: SystemLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: 'info',
    source: 'system',
    message: 'System update completed successfully'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: 'warning',
    source: 'database',
    message: 'High database load detected'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: 'error',
    source: 'storage',
    message: 'Failed to upload file - insufficient storage'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'info',
    source: 'auth',
    message: 'New admin user created'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    type: 'info',
    source: 'api',
    message: 'API rate limit increased for client A'
  }
];
