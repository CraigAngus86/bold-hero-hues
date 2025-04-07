
import { useState, useCallback } from 'react';
import { systemLogsService } from '@/services/logs/systemLogsService';
import { SystemLog, SystemStatus } from '@/types/system/status';

export const useDashboardRefresh = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch system status
      const systemStatus = await systemLogsService.getSystemStatus();
      setStatus(systemStatus);

      // Fetch system logs
      const systemLogs = await systemLogsService.getSystemLogs(20);
      setLogs(systemLogs);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh dashboard data'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useState(() => {
    refresh();
  });

  return {
    status,
    logs,
    isLoading,
    error,
    refresh,
  };
};
