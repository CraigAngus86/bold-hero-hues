
import { useState, useCallback } from 'react';
import { SystemStatus } from '@/types/system';
import { getSystemStatus } from '@/services/logs/systemLogsService';

interface DashboardRefreshState {
  isLoading: boolean;
  error: Error | null;
  status: SystemStatus | null;
}

/**
 * Hook for refreshing system status data for the dashboard
 */
export const useDashboardRefresh = () => {
  const [state, setState] = useState<DashboardRefreshState>({
    isLoading: false,
    error: null,
    status: null,
  });

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const status = await getSystemStatus();
      setState({
        isLoading: false,
        error: null,
        status,
      });
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to refresh dashboard data'),
        status: null,
      });
    }
  }, []);

  return {
    ...state,
    refresh,
  };
};

export default useDashboardRefresh;
