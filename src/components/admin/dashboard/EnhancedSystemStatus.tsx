
import React, { useState, useEffect } from 'react';
import { systemLogsService } from '@/services/systemLogsService';
import SystemStatusPanel from './SystemStatusPanel';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { SystemStatus } from '@/types/system/status';

const EnhancedSystemStatus: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchSystemStatus = async (): Promise<void> => {
    setLoading(true);
    try {
      const status = await systemLogsService.getSystemStatus();
      setSystemStatus(status);
      setError(null);
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch system status'));
    } finally {
      setLoading(false);
    }
    
    // Return a resolved promise to satisfy the Promise<void> return type
    return Promise.resolve();
  };
  
  useEffect(() => {
    fetchSystemStatus();
  }, []);
  
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      )}
      
      <SystemStatusPanel 
        status={systemStatus}
        isLoading={loading}
        onRefresh={fetchSystemStatus}
        error={error}
      />
    </>
  );
};

export default EnhancedSystemStatus;
