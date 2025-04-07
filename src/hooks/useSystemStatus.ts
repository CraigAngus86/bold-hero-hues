
import { useState, useCallback } from 'react';
import { SystemStatus } from '@/types/system/status';
import systemLogsService from '@/services/logs/systemLogsService';

export const useSystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSystemStatus = useCallback(async () => {
    try {
      setLoading(true);
      const status = await systemLogsService.getSystemStatus();
      setSystemStatus(status);
      setError(null);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    systemStatus,
    loading,
    error,
    fetchSystemStatus
  };
};
