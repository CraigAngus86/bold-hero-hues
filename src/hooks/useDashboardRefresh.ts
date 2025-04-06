
import { useState, useEffect, useCallback } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';

export function useDashboardRefresh(initialInterval = 60) {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [nextRefresh, setNextRefresh] = useState<Date>(new Date(Date.now() + initialInterval * 1000));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [intervalTime] = useState<number>(initialInterval);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Get system status data
      await getSystemStatus();
      
      // Update timestamps
      const now = new Date();
      setLastRefreshed(now);
      setNextRefresh(new Date(now.getTime() + intervalTime * 1000));
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [intervalTime]);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  useEffect(() => {
    // On initial mount, refresh data
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (autoRefresh) {
      timer = setTimeout(() => {
        refresh();
      }, intervalTime * 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoRefresh, intervalTime, lastRefreshed, refresh]);

  return {
    lastRefreshed,
    nextRefresh,
    isRefreshing,
    autoRefresh,
    toggleAutoRefresh,
    refresh
  };
}

export default useDashboardRefresh;
