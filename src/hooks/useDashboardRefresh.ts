
import { useCallback, useEffect, useState } from 'react';
import { getSystemStatus, SystemStatusData } from '@/services/logs/systemLogsService';

export interface DashboardData {
  system: SystemStatusData;
  lastUpdated: Date;
}

/**
 * Hook to periodically refresh dashboard data
 * @param initialInterval - Initial refresh interval in milliseconds (default: 60000 = 1 minute)
 */
export const useDashboardRefresh = (initialInterval = 60000) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(initialInterval);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch system data
      const systemData = await getSystemStatus();
      
      setData({
        system: systemData,
        lastUpdated: new Date()
      });
      
      setLastRefreshed(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);
  
  // Set up interval for auto-refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      refresh();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refresh, refreshInterval]);
  
  return {
    data,
    isLoading,
    error,
    refresh,
    lastRefreshed,
    setRefreshInterval
  };
};
