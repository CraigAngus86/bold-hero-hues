
import { useState, useEffect } from 'react';
import { SystemStatus } from '@/types/system/status';
import SystemLogsService from '@/services/logs/systemLogsService';

interface SystemStatusState {
  status: SystemStatus | null;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useSystemStatus = () => {
  const [state, setState] = useState<SystemStatusState>({
    status: null,
    isLoading: true,
    error: null,
    lastChecked: null
  });

  const fetchSystemStatus = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { status, error } = await SystemLogsService.getSystemStatus();
      
      setState({
        status,
        isLoading: false,
        error: error || null,
        lastChecked: new Date()
      });
    } catch (error) {
      setState({
        status: null,
        isLoading: false,
        error: 'Failed to fetch system status',
        lastChecked: new Date()
      });
    }
  };

  // Auto-refresh every 60 seconds
  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    refresh: fetchSystemStatus
  };
};

export default useSystemStatus;
