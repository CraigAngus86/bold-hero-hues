
import React, { useEffect, useState } from 'react';
import { SystemLogViewer } from './SystemLogViewer';
import { SystemLog } from '@/types';
import { getSystemLogs } from '@/services/logs/systemLogsService';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export const SystemLogs: React.FC = () => {
  // Use React Query for data fetching with automatic error handling and caching
  const { 
    data: logs, 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ['systemLogs'],
    queryFn: async () => {
      try {
        return await getSystemLogs({ limit: 100 });
      } catch (error) {
        console.error('Error fetching system logs:', error);
        toast.error('Failed to load system logs');
        // Fallback to mock data if fetching fails
        return [
          { id: '1', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'error', source: 'system', message: 'Failed to connect to API endpoint' },
          { id: '2', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'warning', source: 'system', message: 'Cache storage is nearly full' },
          { id: '3', timestamp: new Date(Date.now() - 10800000).toISOString(), type: 'info', source: 'system', message: 'System backup completed successfully' },
          { id: '4', timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'debug', source: 'system', message: 'Database query timeout' },
        ] as SystemLog[];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = () => {
    refetch();
    toast.success('Refreshing system logs...');
  };

  return (
    <SystemLogViewer
      initialLogs={logs || []}
      title="System Logs"
      description="View and manage system events and errors"
      onRefresh={handleRefresh}
      isLoading={isLoading}
    />
  );
};

export default SystemLogs;
