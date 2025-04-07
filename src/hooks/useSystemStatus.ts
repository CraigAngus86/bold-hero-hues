
import { useState, useEffect, useCallback } from 'react';
import { getSystemStatus } from '@/services/logs/systemLogsService';
import { SystemStatus } from '@/types/system';

export function useSystemStatus() {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getSystemStatus();
            if (response.success && response.data) {
                setStatus(response.data);
            } else {
                throw new Error(response.error || 'Failed to fetch system status');
            }
        } catch (err) {
            console.error('Error fetching system status:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshStatus();
    }, [refreshStatus]);

    return {
        status,
        isLoading,
        error,
        refreshStatus
    };
}
