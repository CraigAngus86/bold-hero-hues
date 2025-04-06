
import { useState, useCallback, useEffect } from 'react';
import { SystemStatus } from '@/types/system';

// In a real app, this would fetch from an API
const getMockSystemStatus = (): SystemStatus => {
  return {
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    isHealthy: true,
    components: [
      {
        id: '1',
        name: 'Database',
        status: 'Operational',
        isHealthy: true,
        lastChecked: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'API Server',
        status: 'Operational',
        isHealthy: true,
        lastChecked: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Website Frontend',
        status: 'Operational',
        isHealthy: true,
        lastChecked: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Email Service',
        status: Math.random() > 0.7 ? 'Degraded' : 'Operational',
        isHealthy: Math.random() > 0.7 ? false : true,
        lastChecked: new Date().toISOString(),
      },
    ],
    incidents: Math.random() > 0.7 ? [
      {
        id: '1',
        title: 'Intermittent Email Delivery Delays',
        description: 'Some emails may experience delayed delivery.',
        severity: 'medium',
        date: new Date().toISOString(),
        isResolved: false,
      },
    ] : [],
    metrics: {
      cpuUsage: Math.floor(Math.random() * 40) + 20, // 20-60%
      memoryUsage: Math.floor(Math.random() * 50) + 30, // 30-80%
      diskUsage: Math.floor(Math.random() * 30) + 50, // 50-80%
      activeUsers: Math.floor(Math.random() * 100) + 50, // 50-150 users
      responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
      uptime: Math.floor(Math.random() * 90) + 99.9, // 99.9-99.99%
    }
  };
};

export const useSystemStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<SystemStatus | null>(null);

  const fetchSystemStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const status = getMockSystemStatus();
      setData(status);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch system status'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSystemStatus();
  }, [fetchSystemStatus]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchSystemStatus,
  };
};

export default useSystemStatus;
