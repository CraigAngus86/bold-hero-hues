
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { toast } from 'sonner';
import { AlertCircle, Loader2, RefreshCw, Trash2 } from 'lucide-react';

// Mock data for system logs
const initialLogs = [
  { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'error', message: 'Failed to connect to API endpoint' },
  { id: 2, timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'warning', message: 'Cache storage is nearly full' },
  { id: 3, timestamp: new Date(Date.now() - 10800000).toISOString(), type: 'info', message: 'System backup completed successfully' },
  { id: 4, timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'error', message: 'Database query timeout' },
];

// Exported component to ensure it can be imported properly
export const SystemLogs = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [isLoading, setIsLoading] = useState(false);
  
  // Function for refreshing logs
  const refreshLogs = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Add a new log entry
      const newLog = {
        id: logs.length + 1,
        timestamp: new Date().toISOString(),
        type: Math.random() > 0.7 ? 'error' : Math.random() > 0.5 ? 'warning' : 'info',
        message: `Log entry at ${new Date().toLocaleTimeString()}`
      };
      setLogs([newLog, ...logs]);
      setIsLoading(false);
      toast.success('Logs refreshed');
    }, 1000);
  };

  // Function for clearing logs by type
  const clearLogsByType = (type: string) => () => {
    setLogs(logs.filter(log => log.type !== type));
    toast.success(`Cleared ${type} logs`);
  };

  // Function for formatting timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">System Logs</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshLogs}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Refresh Logs
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => {
              setLogs([]);
              toast.success('All logs cleared');
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearLogsByType('error')}
            className="bg-red-50 border-red-200 hover:bg-red-100"
          >
            <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
            Clear Errors
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearLogsByType('warning')}
            className="bg-amber-50 border-amber-200 hover:bg-amber-100"
          >
            <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
            Clear Warnings
          </Button>
        </div>
        
        <div className="border rounded-md">
          {logs.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No system logs to display
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${log.type === 'error' ? 'bg-red-100 text-red-800' : 
                          log.type === 'warning' ? 'bg-amber-100 text-amber-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {log.type}
                      </span>
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemLogs;
