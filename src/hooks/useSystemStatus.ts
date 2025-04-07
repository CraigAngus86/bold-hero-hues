
import { useState, useEffect } from 'react';
import { SystemStatus } from '@/types/system/status';
import { systemLogsService } from '@/services/systemLogsService';

export function useSystemStatus() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const status = await systemLogsService.getSystemStatus();
      setSystemStatus(status);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch system status'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSystemStatus();
  }, []);
  
  return {
    systemStatus,
    loading,
    error,
    fetchSystemStatus
  };
}
