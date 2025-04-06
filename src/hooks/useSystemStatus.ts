
import { useState, useEffect, useCallback } from 'react';
import { getSystemStatus, updateSystemCheckTimestamp, SystemStatusData } from '@/services/logs/systemLogsService';

interface UseSystemStatusResult {
  status: SystemStatusData | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching and refreshing system status
 */
export const useSystemStatus = (): UseSystemStatusResult => {
  const [status, setStatus] = useState<SystemStatusData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchSystemStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getSystemStatus();
      setStatus(data);
      setLastUpdated(new Date());
      setError(null);
      await updateSystemCheckTimestamp();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred fetching system status'));
      console.error('Failed to fetch system status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemStatus();
  }, [fetchSystemStatus]);

  return {
    status,
    isLoading,
    error,
    lastUpdated,
    refresh: fetchSystemStatus
  };
};
