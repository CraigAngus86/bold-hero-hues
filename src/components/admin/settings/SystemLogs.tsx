
import React, { useEffect, useState } from 'react';
import { SystemLogViewer } from './SystemLogViewer';
import { SystemLog } from '@/types';
import { fetchSystemLogs } from '@/services/logs/systemLogsService';
import { toast } from 'sonner';

export const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load logs from Supabase
  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const fetchedLogs = await fetchSystemLogs({ limit: 100 });
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      toast.error('Failed to load system logs');
      
      // Fallback to mock data if fetching fails
      setLogs([
        { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'error' as const, source: 'system', message: 'Failed to connect to API endpoint' },
        { id: 2, timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'warning' as const, source: 'system', message: 'Cache storage is nearly full' },
        { id: 3, timestamp: new Date(Date.now() - 10800000).toISOString(), type: 'info' as const, source: 'system', message: 'System backup completed successfully' },
        { id: 4, timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'error' as const, source: 'system', message: 'Database query timeout' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load logs on component mount
  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <SystemLogViewer
      initialLogs={logs}
      title="System Logs"
      description="View and manage system events and errors"
      onRefresh={loadLogs}
      isLoading={isLoading}
    />
  );
};

export default SystemLogs;
