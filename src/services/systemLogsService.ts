
import { SystemLog, SystemStatus } from '@/types/system/status';
import { SystemLogEntry, SystemLogsResponse } from '@/types/system/logs';
import { supabase } from '@/lib/supabase';

// Mock system status for development testing
const mockSystemStatus: SystemStatus = {
  overall_status: 'healthy',
  message: 'All systems operational',
  uptime: 99.98,
  last_updated: new Date().toISOString(),
  services: [
    {
      name: 'Web Server',
      status: 'healthy',
      uptime: 99.9,
      message: 'Operating normally',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Database',
      status: 'healthy',
      uptime: 99.99,
      message: 'Operating normally',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Storage Service',
      status: 'healthy',
      uptime: 100,
      message: 'Operating normally',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Email Service',
      status: 'warning',
      uptime: 98.5,
      message: 'Slight delay in delivery',
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Payment Gateway',
      status: 'healthy',
      uptime: 99.95,
      message: 'Operating normally',
      lastChecked: new Date().toISOString()
    }
  ],
  metrics: {
    performance: [
      { name: 'Response Time', value: 245, unit: 'ms' },
      { name: 'CPU Usage', value: 32, unit: '%' },
      { name: 'Memory Usage', value: 64, unit: '%' }
    ],
    storage: [
      { name: 'Database Size', value: 4.2, unit: 'GB' },
      { name: 'Storage Used', value: 156, unit: 'GB' },
      { name: 'Free Space', value: 844, unit: 'GB' }
    ],
    usage: [
      { name: 'Active Users', value: 243, unit: 'users' },
      { name: 'Requests', value: '28.5K', unit: 'daily' },
      { name: 'Errors', value: 12, unit: 'daily' }
    ]
  }
};

// Mock system logs for development testing
const mockSystemLogs: SystemLog[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    type: 'info',
    message: 'System startup complete',
    source: 'system'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    type: 'warning',
    message: 'High memory usage detected',
    source: 'monitoring'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    type: 'info',
    message: 'Daily backup completed successfully',
    source: 'backup'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    type: 'error',
    message: 'Failed to connect to email service',
    source: 'email'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    type: 'info',
    message: 'User authentication successful',
    source: 'auth'
  }
];

/**
 * Service for system logs management
 */
export const systemLogsService = {
  /**
   * Get the current system status
   */
  getSystemStatus: async (): Promise<SystemStatus> => {
    try {
      // For development, return the mock data
      return mockSystemStatus;
      
      // In production, this would call Supabase
      // const { data, error } = await supabase
      //   .from('system_status')
      //   .select('*')
      //   .single();
      
      // if (error) throw error;
      // return data as SystemStatus;
    } catch (error) {
      console.error('Error fetching system status:', error);
      throw error;
    }
  },
  
  /**
   * Get system logs with optional filtering
   */
  getSystemLogs: async (limit: number = 20): Promise<SystemLog[]> => {
    try {
      // For development, return the mock data
      return mockSystemLogs.slice(0, limit);
      
      // In production, this would call Supabase
      // const { data, error } = await supabase
      //   .from('system_logs')
      //   .select('*')
      //   .order('timestamp', { ascending: false })
      //   .limit(limit);
      
      // if (error) throw error;
      // return data as SystemLog[];
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  },
  
  /**
   * Log a new system event
   */
  logSystemEvent: async (type: 'error' | 'warning' | 'info', source: string, message: string): Promise<SystemLog> => {
    try {
      const newLog: SystemLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type,
        message,
        source
      };
      
      // In production, this would insert to Supabase
      // const { data, error } = await supabase
      //   .from('system_logs')
      //   .insert([newLog])
      //   .select()
      //   .single();
      
      // if (error) throw error;
      // return data as SystemLog;
      
      // For development, just return the mock log
      return newLog;
    } catch (error) {
      console.error('Error logging system event:', error);
      throw error;
    }
  }
};
