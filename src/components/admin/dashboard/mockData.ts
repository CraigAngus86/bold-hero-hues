
import { ServerStatus, SystemStatusItemProps, SystemStatusName } from '@/types/system/status';
import { Database, HardDrive, Clock, Users } from 'lucide-react';
import React from 'react';

export const mockStatusItems: SystemStatusItemProps[] = [
  {
    name: 'API Server',
    status: 'healthy',
    value: 'Online',
    metricValue: '99.9%',
    tooltip: 'API server is running normally',
    lastChecked: new Date(),
    icon: React.createElement(Database, { className: "h-4 w-4" }),
    color: 'green'
  },
  {
    name: 'Database',
    status: 'healthy',
    value: 'Connected',
    metricValue: '30ms',
    tooltip: 'Database response time normal',
    lastChecked: new Date(),
    icon: React.createElement(HardDrive, { className: "h-4 w-4" }),
    color: 'green'
  },
  {
    name: 'Cache',
    status: 'healthy',
    value: 'Operational',
    metricValue: '12ms',
    tooltip: 'Cache hit rate: 94%',
    lastChecked: new Date(),
    icon: React.createElement(Clock, { className: "h-4 w-4" }),
    color: 'green'
  },
  {
    name: 'Users',
    status: 'healthy',
    value: 'Active',
    metricValue: '1.2k',
    tooltip: '1,247 active users in the last 24h',
    lastChecked: new Date(),
    icon: React.createElement(Users, { className: "h-4 w-4" }),
    color: 'green'
  }
];

export const mockServerStatus: ServerStatus = {
  status: 'active',
  uptime: '99.98%',
  lastChecked: new Date()
};

// Add more mock data as needed
