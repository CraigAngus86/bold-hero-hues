
import { useState, useEffect } from 'react';
import { getSystemStatus, type SystemStatusData } from '@/services/logs/systemLogsService';

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const data = await getSystemStatus();
      setStatus(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching system status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStatus();
    
    // Refresh status every 5 minutes
    const interval = setInterval(() => {
      fetchStatus();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    status,
    isLoading,
    lastUpdated,
    refresh: fetchStatus
  };
}

// Define system keys for query invalidation
export const systemKeys = {
  status: ['system', 'status'],
  logs: ['system', 'logs']
};

export type { SystemStatusData };
