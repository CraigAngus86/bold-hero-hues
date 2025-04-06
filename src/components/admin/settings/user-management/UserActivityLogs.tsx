
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Activity,
  Download, 
  RefreshCw, 
  Search, 
  Filter 
} from 'lucide-react';
import { format } from 'date-fns';
import { getUserActivityLogs } from '@/services/userManagementService';

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

const UserActivityLogs = () => {
  const [logs, setLogs] = useState<UserActivity[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50); // Items per page

  // Load logs when component mounts
  useEffect(() => {
    loadLogs();
  }, [page]);

  // Filter logs when search term or action filter changes
  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter]);

  // Function to load user activity logs
  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * limit;
      const result = await getUserActivityLogs(undefined, limit, offset);
      
      setLogs(result.logs);
      setTotalCount(result.count);
    } catch (error) {
      console.error('Error loading user activity logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to filter logs based on search term and action filter
  const filterLogs = () => {
    let filtered = [...logs];
    
    // Apply action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.details.toLowerCase().includes(search) ||
        log.action.toLowerCase().includes(search) ||
        log.userId.toLowerCase().includes(search)
      );
    }
    
    setFilteredLogs(filtered);
  };

  // Placeholder function to handle log export
  const handleExportLogs = () => {
    // In a real implementation, this would export logs to CSV/JSON
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `user-activity-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Function to get unique actions for filter dropdown
  const getUniqueActions = () => {
    const actions = new Set(logs.map(log => log.action));
    return Array.from(actions);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              User Activity Logs
            </CardTitle>
            <CardDescription>
              View and filter user actions and system events
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={loadLogs}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button 
              variant="outline"
              onClick={handleExportLogs}
              disabled={logs.length === 0 || isLoading}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={actionFilter}
              onValueChange={setActionFilter}
            >
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by action" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {getUniqueActions().map(action => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity Log Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Action</th>
                    <th className="px-4 py-3 text-left font-medium">Details</th>
                    <th className="px-4 py-3 text-left font-medium">User</th>
                    <th className="px-4 py-3 text-left font-medium">Timestamp</th>
                    <th className="px-4 py-3 text-left font-medium">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="bg-card hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <Badge variant="outline">{log.action}</Badge>
                      </td>
                      <td className="px-4 py-3 max-w-[300px] truncate">{log.details}</td>
                      <td className="px-4 py-3">{log.userId}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-4 py-3">{log.ipAddress || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No activity logs found.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {logs.length} of {totalCount} logs
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={page === 1 || isLoading}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={logs.length < limit || isLoading || page * limit >= totalCount}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserActivityLogs;
