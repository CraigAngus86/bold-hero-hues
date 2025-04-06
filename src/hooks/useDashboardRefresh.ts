
import { useState, useEffect, useRef } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';

export function useDashboardRefresh(refreshInterval = 60000) {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [nextRefresh, setNextRefresh] = useState<Date>(new Date(Date.now() + refreshInterval));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      // Simulate refresh by getting system status
      await getSystemStatus();
      
      // Update refresh timestamps
      const now = new Date();
      setLastRefreshed(now);
      setNextRefresh(new Date(now.getTime() + refreshInterval));
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(() => {
        refresh();
      }, refreshInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  return {
    lastRefreshed,
    nextRefresh,
    isRefreshing,
    autoRefresh,
    toggleAutoRefresh,
    refresh
  };
}
