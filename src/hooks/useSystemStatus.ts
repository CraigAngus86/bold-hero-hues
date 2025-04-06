
import { useState, useEffect } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';
import { SystemStatus } from '@/types/system/status';

export function useSystemStatus() {
  const [data, setData] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const status = await getSystemStatus();
      setData(status);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch system status'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    data,
    isLoading,
    error,
    refresh: fetchStatus
  };
}
