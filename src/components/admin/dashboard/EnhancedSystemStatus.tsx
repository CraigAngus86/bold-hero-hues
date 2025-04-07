
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import SystemStatusPanel from './SystemStatusPanel';
import { SystemStatus } from '@/types/system/status';

interface EnhancedSystemStatusProps {
  initialData?: SystemStatus;
}

export const EnhancedSystemStatus: React.FC<EnhancedSystemStatusProps> = ({ initialData }) => {
  const { systemStatus, loading, error, fetchSystemStatus } = useSystemStatus();

  return (
    <Card>
      <CardContent className="pt-6">
        <SystemStatusPanel 
          status={systemStatus || initialData!} 
          isLoading={loading} 
          onRefresh={fetchSystemStatus}
          error={error || undefined}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedSystemStatus;
