
import { useState, useEffect } from 'react';
import { SystemStatus } from '@/types/system/status';
import { getSystemStatus } from '@/services/logs/systemLogsService';

export const useSystemStatus = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const result = await getSystemStatus();
        if (result.error) {
          setError(result.error);
        } else {
          setStatus(result.data);
        }
      } catch (err) {
        setError('Failed to fetch system status');
        console.error('Error fetching system status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const result = await getSystemStatus();
      if (result.error) {
        setError(result.error);
      } else {
        setStatus(result.data);
      }
    } catch (err) {
      setError('Failed to fetch system status');
    } finally {
      setIsLoading(false);
    }
  };

  return { status, isLoading, error, refresh };
};
