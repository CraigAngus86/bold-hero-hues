
import { useState, useEffect } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';
import { SystemStatus } from '@/types/system/status';

export function useDashboardRefresh(interval = 60000) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshDashboard = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch system status
      const status = await getSystemStatus();
      setSystemStatus(status);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error refreshing dashboard:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while refreshing');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    refreshDashboard();
  }, []);
  
  // Set up interval for auto-refresh
  useEffect(() => {
    if (interval <= 0) return;
    
    const timerId = setInterval(() => {
      refreshDashboard();
    }, interval);
    
    return () => {
      clearInterval(timerId);
    };
  }, [interval]);
  
  return {
    systemStatus,
    lastRefreshed,
    isLoading,
    error,
    refreshDashboard
  };
}

export default useDashboardRefresh;
