
import React from 'react';
import { SystemLogViewer } from './SystemLogViewer';

// Ensure we're using the correct types for logs
const initialLogs = [
  { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'error' as const, source: 'system', message: 'Failed to connect to API endpoint' },
  { id: 2, timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'warning' as const, source: 'system', message: 'Cache storage is nearly full' },
  { id: 3, timestamp: new Date(Date.now() - 10800000).toISOString(), type: 'info' as const, source: 'system', message: 'System backup completed successfully' },
  { id: 4, timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'error' as const, source: 'system', message: 'Database query timeout' },
];

// Exported component to ensure it can be imported properly
export const SystemLogs = () => {
  return (
    <SystemLogViewer
      initialLogs={initialLogs}
      title="System Logs"
      description="View and manage system events and errors"
    />
  );
};

export default SystemLogs;
