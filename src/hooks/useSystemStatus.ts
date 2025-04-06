
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { SystemStatus } from '@/types';

// Default system status
const defaultStatus: SystemStatus = {
  storageUsage: {
    total: 10000,
    used: 2500,
    percentage: 25
  },
  serverStatus: 'online',
  databaseStatus: 'online',
  newUsers24h: 0,
  activeUsers: 0
};

/**
 * Hook for fetching and managing system status
 */
export const useSystemStatus = () => {
  const [status, setStatus] = useState<SystemStatus>(defaultStatus);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSystemStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      // Here we would normally make an API request to get the system status
      // For now, use mock data with some randomization for demo purposes
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock data with some randomness
      const mockStatus: SystemStatus = {
        lastBackup: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        storageUsage: {
          total: 10000,
          used: Math.floor(1000 + Math.random() * 4000),
          percentage: 0 // Will calculate below
        },
        serverStatus: Math.random() > 0.9 ? 'degraded' : 'online',
        databaseStatus: Math.random() > 0.95 ? 'degraded' : 'online',
        newUsers24h: Math.floor(Math.random() * 10),
        activeUsers: Math.floor(10 + Math.random() * 50)
      };
      
      // Calculate percentage
      mockStatus.storageUsage.percentage = Math.round(
        (mockStatus.storageUsage.used / mockStatus.storageUsage.total) * 100
      );
      
      // Add last error if status is degraded
      if (mockStatus.serverStatus === 'degraded' || mockStatus.databaseStatus === 'degraded') {
        mockStatus.lastError = {
          timestamp: new Date().toISOString(),
          message: 'Performance degradation detected in system resources'
        };
      }
      
      setStatus(mockStatus);
      return mockStatus;
    } catch (error) {
      console.error('Error fetching system status:', error);
      toast.error('Failed to fetch system status');
      return status;
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  // Initial fetch on hook mount
  const refresh = useCallback(async () => {
    return await fetchSystemStatus();
  }, [fetchSystemStatus]);

  return {
    status,
    isLoading,
    refresh
  };
};

export default useSystemStatus;
