
import { useState, useEffect } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';
import { SystemStatus } from '@/types/system/status';

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getSystemStatus();
      if (response.success && response.data) {
        setStatus(response.data as SystemStatus);
      } else {
        throw new Error(response.error || 'Failed to fetch system status');
      }
    } catch (error) {
      console.error('Error in useSystemStatus:', error);
      setError(error instanceof Error ? error.message : 'Unknown error fetching system status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    status,
    isLoading,
    error,
    refreshStatus: fetchStatus
  };
}
