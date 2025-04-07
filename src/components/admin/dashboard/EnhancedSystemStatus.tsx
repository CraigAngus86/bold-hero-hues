
import React from 'react';
import SystemStatusPanel from './SystemStatusPanel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSystemStatus } from '@/hooks/useSystemStatus';

const EnhancedSystemStatus: React.FC = () => {
  const { systemStatus, loading, error, fetchSystemStatus } = useSystemStatus();
  
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
