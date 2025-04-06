
import React from 'react';
import { Button } from '@/components/ui/button';

// Exported component to ensure it can be imported properly
export const SystemLogs = () => {
  // Mock function for clearing logs by type
  const clearLogsByType = (type: string) => () => {
    console.log(`Clearing logs of type: ${type}`);
    // Actual implementation would go here
  };

  return (
    <Button 
      variant="destructive" 
      size="sm"
      onClick={clearLogsByType('error')}
    >
      Clear Errors
    </Button>
  );
};

export default SystemLogs;
