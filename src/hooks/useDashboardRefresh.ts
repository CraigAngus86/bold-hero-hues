
import { useState, useEffect } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';
import { SystemStatus } from '@/types/system/status';

export function useDashboardRefresh(interval: number = 60000) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const statusResponse = await getSystemStatus();
      if (statusResponse.success && statusResponse.data) {
        setSystemStatus(statusResponse.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error refreshing dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up interval refresh if interval is > 0
    if (interval > 0) {
      const intervalId = setInterval(fetchData, interval);
      return () => clearInterval(intervalId);
    }
  }, [interval]);

  return {
    systemStatus,
    isLoading,
    error,
    refreshData: fetchData
  };
}
