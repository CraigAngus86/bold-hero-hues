
import { v4 as uuidv4 } from 'uuid';
import { SystemLog, SystemLogLevel } from '@/types/system/logs';
import { SystemStatus } from '@/types/system/status';

// Sample system logs data for development
const mockSystemLogs: SystemLog[] = [
  {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    type: 'info',
    message: 'System started successfully',
    source: 'system',
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'warning',
    message: 'High CPU usage detected',
    source: 'monitoring',
    details: { cpu: '87%', memory: '45%' }
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'error',
    message: 'Database connection failed',
    source: 'database',
    details: { error: 'Connection timeout' }
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    type: 'debug',
    message: 'Cache invalidated',
    source: 'cache',
  },
  {
    id: uuidv4(),
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    type: 'success',
    message: 'Backup completed successfully',
    source: 'backup',
  }
];

// Mock system status data
const mockSystemStatus: SystemStatus = {
  overall_status: 'healthy',
  message: 'All systems operational',
  uptime: 1209600, // 14 days in seconds
  last_updated: new Date().toISOString(),
  services: [
    {
      name: 'Database',
      status: 'healthy',
      uptime: 1209600,
      message: 'Operating normally',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'API',
      status: 'healthy',
      uptime: 1209600,
      message: 'Operating normally',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Storage',
      status: 'warning',
      uptime: 1209600,
      message: 'High usage detected',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Authentication',
      status: 'healthy',
      uptime: 1209600,
      message: 'Operating normally',
      lastChecked: new Date().toISOString()
    }
  ],
  metrics: {
    performance: [
      { name: 'CPU', value: 45, unit: '%' },
      { name: 'Memory', value: 68, unit: '%' },
      { name: 'Response Time', value: 120, unit: 'ms' }
    ],
    storage: [
      { name: 'Disk Usage', value: 72, unit: '%' },
      { name: 'Database Size', value: 1.2, unit: 'GB' },
      { name: 'Uploads', value: 240, unit: 'MB/day' }
    ],
    usage: [
      { name: 'API Calls', value: 45600, unit: '/day' },
      { name: 'Users', value: 1250, unit: 'active' },
      { name: 'Bandwidth', value: 5.8, unit: 'GB/day' }
    ]
  },
  logs: mockSystemLogs.slice(0, 3)
};

/**
 * Service for system logs operations
 */
export const systemLogsService = {
  /**
   * Get all system logs
   */
  getLogs: async (): Promise<SystemLog[]> => {
    // In a real app, this would fetch from Supabase
    return mockSystemLogs;
  },

  /**
   * Get system status information
   */
  getSystemStatus: async (): Promise<SystemStatus> => {
    // In a real app, this would fetch from Supabase
    return mockSystemStatus;
  },

  /**
   * Log a new system event
   */
  logEvent: async (eventData: Omit<SystemLog, 'id' | 'timestamp'>): Promise<SystemLog> => {
    // Generate a new log entry
    const newLog: SystemLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...eventData
    };
    
    // In a real app, this would insert into Supabase
    mockSystemLogs.unshift(newLog);
    
    return newLog;
  }
};
