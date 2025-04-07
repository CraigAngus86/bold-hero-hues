
import { useState, useEffect, useCallback } from 'react';
import { SystemStatus } from '@/types/system/status';
import { getSystemStatus } from '@/services/logs/systemLogsService';

export const useDashboardRefresh = (autoRefreshInterval = 60000) => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchSystemStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getSystemStatus();
      if (result.error) {
        setError(result.error);
      } else {
        setStatus(result.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      setError('Failed to fetch system status');
      console.error('Error fetching system status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshStatus = useCallback(() => {
    fetchSystemStatus();
  }, [fetchSystemStatus]);

  useEffect(() => {
    fetchSystemStatus();

    if (autoRefreshInterval > 0) {
      const intervalId = setInterval(refreshStatus, autoRefreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchSystemStatus, autoRefreshInterval, refreshStatus]);

  return {
    status,
    isLoading,
    error,
    lastUpdated,
    refreshStatus
  };
};
