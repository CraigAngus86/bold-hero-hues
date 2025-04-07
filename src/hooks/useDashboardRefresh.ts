
import { useState, useEffect } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';
import { SystemStatus } from '@/types/system/status';

// Hook for auto-refreshing dashboard data
export function useDashboardRefresh(refreshInterval = 60000) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSystemStatus = async () => {
    setIsLoading(true);
    try {
      const { status, error } = await getSystemStatus();
      
      if (error) {
        throw error;
      }
      
      setSystemStatus(status);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSystemStatus();
  }, []);

  // Set up polling interval
  useEffect(() => {
    if (refreshInterval <= 0) return;
    
    const intervalId = setInterval(() => {
      fetchSystemStatus();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return {
    systemStatus,
    isLoading,
    error,
    lastUpdated,
    refresh: fetchSystemStatus
  };
}
