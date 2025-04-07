
import { SystemStatus, SystemStatusName, Service, SystemMetric } from '@/types/system/status';
import { Database, Server, HardDrive } from 'lucide-react';
import React from 'react';

export const mockSystemStatus: SystemStatus = {
  overall_status: 'healthy',
  message: 'All systems operational',
  uptime: 45,
  metrics: {
    uptime: 45,
    responseTime: 187,
    errors24h: 2,
    totalRequests24h: 25687,
    performance: [
      {
        name: 'CPU',
        value: 24,
        unit: '%',
        change: 5,
        changeType: 'negative',
        changeDirection: 'up',
        icon: React.createElement(Server, { className: "h-4 w-4 text-blue-500" }),
        description: 'Average CPU usage'
      },
      {
        name: 'Memory',
        value: 38,
        unit: '%',
        change: 2,
        changeType: 'negative',
        changeDirection: 'up',
        icon: React.createElement(Server, { className: "h-4 w-4 text-green-500" }),
        description: 'Memory utilization'
      },
      {
        name: 'Disk I/O',
        value: 12,
        unit: 'MB/s',
        change: 3,
        changeType: 'positive',
        changeDirection: 'down',
        icon: React.createElement(HardDrive, { className: "h-4 w-4 text-amber-500" }),
        description: 'Disk read/write rate'
      }
    ],
    storage: [
      {
        name: 'Disk Space',
        value: 68,
        unit: '%',
        change: 2,
        changeType: 'negative',
        changeDirection: 'up',
        icon: React.createElement(HardDrive, { className: "h-4 w-4 text-blue-500" }),
        description: 'Used disk space'
      },
      {
        name: 'Database Size',
        value: 128,
        unit: 'MB',
        change: 4,
        changeType: 'negative',
        changeDirection: 'up',
        icon: React.createElement(Database, { className: "h-4 w-4 text-purple-500" }),
        description: 'Database storage'
      },
      {
        name: 'Free Space',
        value: 24,
        unit: 'GB',
        change: 5,
        changeType: 'negative',
        changeDirection: 'down',
        icon: React.createElement(HardDrive, { className: "h-4 w-4 text-green-500" }),
        description: 'Available storage'
      }
    ],
    usage: [
      {
        name: 'API Requests',
        value: 23768,
        unit: '/day',
        change: 12,
        changeType: 'positive',
        changeDirection: 'up',
        icon: React.createElement(Server, { className: "h-4 w-4 text-blue-500" }),
        description: 'API call volume'
      },
      {
        name: 'Bandwidth',
        value: 1.2,
        unit: 'GB/day',
        change: 3,
        changeType: 'negative',
        changeDirection: 'up',
        icon: React.createElement(Server, { className: "h-4 w-4 text-amber-500" }),
        description: 'Network bandwidth usage'
      },
      {
        name: 'Active Users',
        value: 843,
        change: 5,
        changeType: 'positive',
        changeDirection: 'up',
        icon: React.createElement(Server, { className: "h-4 w-4 text-green-500" }),
        description: 'Current active users'
      }
    ]
  },
  services: [
    {
      name: 'Database',
      status: 'healthy',
      lastChecked: new Date(Date.now() - 120000),
      message: 'Database is operating normally',
      uptime: 99.98
    },
    {
      name: 'API Server',
      status: 'healthy',
      lastChecked: new Date(Date.now() - 180000),
      message: 'API endpoints are responding as expected',
      uptime: 99.95
    },
    {
      name: 'Storage',
      status: 'healthy',
      lastChecked: new Date(Date.now() - 240000),
      message: 'File storage service is available',
      uptime: 99.99
    },
    {
      name: 'Authentication',
      status: 'healthy',
      lastChecked: new Date(Date.now() - 300000),
      message: 'Authentication service is functioning properly',
      uptime: 99.97
    }
  ],
  messages: [
    'Scheduled maintenance planned for tomorrow at 2:00 AM UTC',
    'New API endpoints have been added for the fixtures module'
  ],
  last_updated: new Date(Date.now() - 60000),
  version: 'v1.2.5'
};

export const mockServerStatus = {
  database: {
    status: 'healthy' as SystemStatusName,
    uptime: '99.98%',
    lastChecked: new Date(Date.now() - 120000)
  },
  api: {
    status: 'healthy' as SystemStatusName,
    uptime: '99.95%',
    lastChecked: new Date(Date.now() - 180000)
  },
  storage: {
    status: 'healthy' as SystemStatusName,
    uptime: '99.99%',
    lastChecked: new Date(Date.now() - 240000)
  },
  auth: {
    status: 'healthy' as SystemStatusName,
    uptime: '99.97%',
    lastChecked: new Date(Date.now() - 300000)
  }
};

export const mockLogs = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 360000),
    type: 'info',
    source: 'system',
    message: 'System startup completed successfully'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 320000),
    type: 'info',
    source: 'database',
    message: 'Database connection established'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 280000),
    type: 'warning',
    source: 'api',
    message: 'High latency detected on endpoint /api/fixtures'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 240000),
    type: 'error',
    source: 'storage',
    message: 'Failed to upload file: permission denied'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 200000),
    type: 'info',
    source: 'auth',
    message: 'User John Doe logged in successfully'
  }
];
