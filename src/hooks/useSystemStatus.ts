
import { useState, useEffect } from 'react';
import { getLatestLogBySource } from '@/services/logs/systemLogsService';

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  lastUpdated: Date | null;
  message: string;
}

// Define system keys for different subsystems
export const systemKeys = {
  status: 'system-status',
  leagueTable: 'league-table-scraper',
  fixtures: 'fixtures-scraper',
  news: 'news-system',
  media: 'media-system',
  database: 'database',
  storage: 'storage',
  auth: 'auth-system'
};

export const useSystemStatus = (source: string, refreshInterval = 60000) => {
  const [status, setStatus] = useState<SystemStatus>({
    status: 'unknown',
    lastUpdated: null,
    message: 'Checking system status...'
  });

  const [isLoading, setIsLoading] = useState(true);

  const checkStatus = async () => {
    try {
      setIsLoading(true);
      const latestLog = await getLatestLogBySource(source);
      
      if (!latestLog) {
        setStatus({
          status: 'unknown',
          lastUpdated: null,
          message: 'No status information available'
        });
        return;
      }

      const lastUpdateTime = new Date(latestLog.timestamp);
      const now = new Date();
      const hoursSinceUpdate = (now.getTime() - lastUpdateTime.getTime()) / (1000 * 60 * 60);

      let statusType: 'healthy' | 'warning' | 'error' | 'unknown' = 'unknown';
      let message = latestLog.message;

      // Determine status based on log type and time since last update
      if (latestLog.type === 'error') {
        statusType = 'error';
      } else if (latestLog.type === 'warning' || hoursSinceUpdate > 24) {
        statusType = 'warning';
      } else if (latestLog.type === 'success' || latestLog.type === 'info') {
        statusType = 'healthy';
      }

      // Add time warning if it's been too long
      if (hoursSinceUpdate > 48) {
        statusType = 'error';
        message = `No updates for ${Math.floor(hoursSinceUpdate)} hours. System may be offline.`;
      } else if (hoursSinceUpdate > 24) {
        statusType = 'warning';
        message = `Last update was ${Math.floor(hoursSinceUpdate)} hours ago`;
      }

      setStatus({
        status: statusType,
        lastUpdated: lastUpdateTime,
        message
      });

    } catch (error) {
      console.error('Error checking system status:', error);
      setStatus({
        status: 'error',
        lastUpdated: null,
        message: 'Failed to check system status'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    
    // Set up automatic refresh
    const intervalId = setInterval(() => {
      checkStatus();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [source, refreshInterval]);

  return {
    status,
    isLoading,
    refresh: checkStatus
  };
};
