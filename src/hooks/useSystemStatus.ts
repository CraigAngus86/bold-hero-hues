
import { useState, useEffect, useCallback } from 'react';
import { SystemStatus } from '@/types/system/status';
import systemLogsService from '@/services/logs/systemLogsService';

export interface UseSystemStatusResult {
  status: SystemStatus | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to get and manage system status
 */
export const useSystemStatus = (): UseSystemStatusResult => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await systemLogsService.getSystemStatus();
      setStatus(data);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError('Failed to fetch system status');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    isLoading,
    error,
    refresh: fetchStatus
  };
};

export default useSystemStatus;
