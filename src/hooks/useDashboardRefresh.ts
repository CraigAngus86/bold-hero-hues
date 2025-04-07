
import { useState, useEffect } from 'react';
import { SystemLog } from '@/types/system/status';
import SystemLogsService from '@/services/logs/systemLogsService';

interface DashboardRefreshState {
  status: 'idle' | 'loading' | 'error' | 'success';
  lastRefresh: Date;
  error: string | null;
  logs: SystemLog[];
}

export const useDashboardRefresh = () => {
  const [state, setState] = useState<DashboardRefreshState>({
    status: 'idle',
    lastRefresh: new Date(),
    error: null,
    logs: []
  });

  const refreshDashboard = async () => {
    setState(prev => ({ ...prev, status: 'loading' }));
    try {
      // Fetch the latest logs
      const logs = await SystemLogsService.getSystemLogs(10);
      
      setState({
        status: 'success',
        lastRefresh: new Date(),
        error: null,
        logs
      });
    } catch (error) {
      setState({
        status: 'error',
        lastRefresh: new Date(),
        error: 'Failed to refresh dashboard data',
        logs: []
      });
    }
  };

  // Initial fetch
  useEffect(() => {
    refreshDashboard();
    // Refresh every 5 minutes
    const interval = setInterval(refreshDashboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    refresh: refreshDashboard
  };
};

export default useDashboardRefresh;
