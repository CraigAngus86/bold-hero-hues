
import { useState, useEffect } from 'react';
import { SystemLog } from '@/types/system/status';
import systemLogsService from '@/services/logs/systemLogsService';

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
  
  const [refreshData, setRefreshData] = useState(false);

  const refreshDashboard = async () => {
    setState(prev => ({ ...prev, status: 'loading' }));
    try {
      // Fetch the latest logs
      const logs = await systemLogsService.getSystemLogs(10);
      
      setState({
        status: 'success',
        lastRefresh: new Date(),
        error: null,
        logs
      });
      
      // Reset refresh flag
      setRefreshData(false);
    } catch (error) {
      setState({
        status: 'error',
        lastRefresh: new Date(),
        error: 'Failed to refresh dashboard data',
        logs: []
      });
      setRefreshData(false);
    }
  };

  // Handle refresh when refreshData changes
  useEffect(() => {
    if (refreshData) {
      refreshDashboard();
    }
  }, [refreshData]);

  // Initial fetch
  useEffect(() => {
    refreshDashboard();
    // Refresh every 5 minutes
    const interval = setInterval(refreshDashboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    refresh: refreshDashboard,
    refreshData,
    setRefreshData
  };
};

export default useDashboardRefresh;
