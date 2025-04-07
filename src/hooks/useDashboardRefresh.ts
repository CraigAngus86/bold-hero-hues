
import { useState, useCallback, useEffect } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';

export const useDashboardRefresh = () => {
  const [refreshInterval, setRefreshInterval] = useState(60000); // 1 minute default
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const status = await getSystemStatus();
      setSystemStatus(status.systemStatus);
      setStatusError(null);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      setStatusError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsRefreshing(false);
      setStatusLoading(false);
    }
  }, []);

  // Handle auto-refresh
  useEffect(() => {
    refresh();
    
    const intervalId = setInterval(() => {
      refresh();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refresh, refreshInterval]);

  const changeRefreshInterval = (interval: number) => {
    setRefreshInterval(interval);
  };

  return {
    refresh,
    isRefreshing,
    lastRefreshed,
    refreshInterval,
    changeRefreshInterval,
    systemStatus,
    isLoading: statusLoading,
    error: statusError
  };
};

export default useDashboardRefresh;
