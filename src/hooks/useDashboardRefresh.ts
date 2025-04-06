
import { useState, useEffect, useCallback } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';
import type { SystemStatusData } from '@/services/logs/systemLogsService';

/**
 * Custom hook for managing dashboard data refresh
 */
export function useDashboardRefresh(refreshInterval = 60000) {
  const [systemStatus, setSystemStatus] = useState<SystemStatusData | undefined>(undefined);
  const [isSystemStatusLoading, setIsSystemStatusLoading] = useState<boolean>(true);
  const [systemStatusUpdatedAt, setSystemStatusUpdatedAt] = useState<number>(Date.now());
  
  const fetchSystemStatus = useCallback(async () => {
    setIsSystemStatusLoading(true);
    try {
      const data = await getSystemStatus();
      setSystemStatus(data);
      setSystemStatusUpdatedAt(Date.now());
    } catch (error) {
      console.error('Error fetching system status:', error);
    } finally {
      setIsSystemStatusLoading(false);
    }
  }, []);
  
  const refreshAll = useCallback(() => {
    fetchSystemStatus();
    // Add other refresh functions here if needed
  }, [fetchSystemStatus]);
  
  useEffect(() => {
    fetchSystemStatus();
    
    const intervalId = setInterval(() => {
      fetchSystemStatus();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [fetchSystemStatus, refreshInterval]);
  
  return {
    systemStatus,
    isSystemStatusLoading,
    systemStatusUpdatedAt,
    refetchSystemStatus: fetchSystemStatus,
    refreshAll
  };
}
