
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Keys for React Query
export const systemKeys = {
  status: ['system', 'status'],
};

export interface SystemStatusData {
  status: 'healthy' | 'warning' | 'error';
  databaseStatus: 'online' | 'degraded' | 'offline';
  storageStatus: 'online' | 'degraded' | 'offline';
  authStatus: 'online' | 'degraded' | 'offline';
  uptimeHours: number;
  lastIncident: string | null;
  lastBackup: string | null;
  version: string;
}

export const useSystemStatus = () => {
  return useQuery({
    queryKey: [...systemKeys.status],
    queryFn: async (): Promise<SystemStatusData> => {
      try {
        // Check database connection
        const { data: dbCheckData, error: dbError } = await supabase
          .from('settings')
          .select('key, value')
          .eq('key', 'system_version')
          .single();

        // Check storage service
        const { data: storageData, error: storageError } = await supabase.storage
          .getBucket('images');

        // Determine overall health status
        let status: 'healthy' | 'warning' | 'error' = 'healthy';
        if (dbError || storageError) {
          status = 'error';
        }

        return {
          status,
          databaseStatus: dbError ? 'offline' : 'online',
          storageStatus: storageError ? 'offline' : 'online',
          authStatus: 'online', // Assuming auth is online, could add specific check
          uptimeHours: 720, // Example: 30 days
          lastIncident: null,
          lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
          version: dbCheckData?.value || '1.0.0',
        };
      } catch (error) {
        console.error("Error fetching system status:", error);
        // Return degraded status if we can't get status
        return {
          status: 'warning',
          databaseStatus: 'degraded',
          storageStatus: 'degraded',
          authStatus: 'degraded',
          uptimeHours: 0,
          lastIncident: new Date().toISOString(),
          lastBackup: null,
          version: '1.0.0',
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export type SystemStatus = 'healthy' | 'warning' | 'error';
export { SystemStatusData };
