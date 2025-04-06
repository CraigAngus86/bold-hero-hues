
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSystemStatus, SystemStatusData } from '@/services/logs/systemLogsService';

export function useSystemStatus() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const { 
    data,
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: async () => {
      const result = await getSystemStatus();
      if (result.error) {
        throw result.error;
      }
      setLastUpdated(new Date());
      return result.data;
    },
    staleTime: 60000, // 1 minute
  });
  
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);
  
  return {
    data: data as SystemStatusData,
    isLoading,
    error,
    lastUpdated,
    refresh
  };
}

export default useSystemStatus;
