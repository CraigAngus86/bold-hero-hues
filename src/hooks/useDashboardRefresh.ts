
import { useState, useEffect, useCallback } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';
import { SystemStatus } from '@/types/system/status';

export function useDashboardRefresh(refreshInterval = 30000) {
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch system status
            const statusResponse = await getSystemStatus();
            if (statusResponse.data) {
                setSystemStatus(statusResponse.data);
            }
            
            // Update last refreshed time
            setLastRefreshed(new Date());
        } catch (error) {
            console.error('Error refreshing dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // Set up interval for auto-refresh
    useEffect(() => {
        if (refreshInterval <= 0) return;
        
        const intervalId = setInterval(() => {
            refreshData();
        }, refreshInterval);
        
        return () => clearInterval(intervalId);
    }, [refreshData, refreshInterval]);

    return {
        systemStatus,
        isLoading,
        lastRefreshed,
        refreshData
    };
}
