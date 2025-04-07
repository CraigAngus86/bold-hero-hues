
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { SystemStatusPanel } from './';
import { SystemStatus } from '@/types/system/status';

interface EnhancedSystemStatusProps {
  initialData?: SystemStatus;
}

export const EnhancedSystemStatus: React.FC<EnhancedSystemStatusProps> = ({ initialData }) => {
  const { status, isLoading, error, refresh } = useSystemStatus();

  return (
    <Card>
      <CardContent className="pt-6">
        <SystemStatusPanel 
          status={status || initialData!} 
          isLoading={isLoading} 
          onRefresh={refresh}
          error={error || undefined}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedSystemStatus;
