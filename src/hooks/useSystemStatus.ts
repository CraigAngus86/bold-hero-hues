
import { useState, useEffect } from 'react';
import { SystemStatus, SystemLogStats } from '@/types/system';
import { getSystemStatus, getSystemLogStats, updateSystemCheckTimestamp } from '@/services/logs/systemLogsService';

export function useSystemStatus() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [logStats, setLogStats] = useState<SystemLogStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch system status
        const status = await getSystemStatus();
        setSystemStatus(status);
        
        // Record the check timestamp
        await updateSystemCheckTimestamp();
        
        // Fetch log statistics
        const stats = await getSystemLogStats();
        setLogStats(stats);
      } catch (err) {
        console.error('Error fetching system status:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching system status'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemData();
  }, []);

  return { systemStatus, logStats, isLoading, error };
}
