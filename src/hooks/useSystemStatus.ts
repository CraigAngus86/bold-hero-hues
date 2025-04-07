
import { useState, useEffect, useCallback } from 'react';
import { SystemStatus } from '@/types/system/status';
import { systemLogsService } from '@/services/logs/systemLogsService';

interface UseSystemStatusResult {
  systemStatus: SystemStatus | undefined;
  loading: boolean;
  error: Error | null;
  fetchSystemStatus: () => Promise<void>;
}

/**
 * Hook to fetch and manage system status
 */
export function useSystemStatus(): UseSystemStatusResult {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchSystemStatus = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const status = await systemLogsService.getSystemStatus();
      setSystemStatus(status);
      setError(null);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch system status'));
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchSystemStatus();
  }, [fetchSystemStatus]);
  
  return {
    systemStatus,
    loading,
    error,
    fetchSystemStatus
  };
}
