
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DataWarningAlert: React.FC = () => {
  return (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4 mr-2" />
      <AlertDescription>
        Some data appears to be invalid or improperly formatted. This may indicate an issue with the data scraping process.
      </AlertDescription>
    </Alert>
  );
};

export default DataWarningAlert;
