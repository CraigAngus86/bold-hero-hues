
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface ScrapeLog {
  id: string;
  created_at: string;
  status: string;
  source: string;
  items_found?: number;
  items_added?: number;
  items_updated?: number;
  error_message?: string;
}

const ScraperLogsPanel = () => {
  const [logs, setLogs] = useState<ScrapeLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, success, failed
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof ScrapeLog>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  
  // Fetch scraper logs
  const fetchLogs = async () => {
    setIsLoading(true);
    
    try {
      // Placeholder for actual API call
      // This would be replaced with your actual data fetching logic
      const mockLogs: ScrapeLog[] = [
        {
          id: '1',
          created_at: new Date().toISOString(),
          status: 'completed',
          source: 'highland_league',
          items_found: 12,
          items_added: 2,
          items_updated: 10
        },
        {
          id: '2',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'failed',
          source: 'highland_league',
          error_message: 'Connection timeout'
        }
      ];
      
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching scraper logs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load logs on component mount and when filter/sort changes
  useEffect(() => {
    fetchLogs();
  }, [filter, sortField, sortDirection]);
  
  // Handle sort toggle
  const toggleSort = (field: keyof ScrapeLog) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Toggle log expansion
  const toggleLogExpansion = (id: string) => {
    const newExpandedLogs = new Set(expandedLogs);
    if (newExpandedLogs.has(id)) {
      newExpandedLogs.delete(id);
    } else {
      newExpandedLogs.add(id);
    }
    setExpandedLogs(newExpandedLogs);
  };
  
  // Filter logs by search query
  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    
    // Search in error message and other fields
    return (
      (log.error_message && log.error_message.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'started':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format date with relative time
  const formatDateTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      const formattedDate = format(date, 'MMM dd, yyyy HH:mm:ss');
      const relativeTime = formatDistanceToNow(date, { addSuffix: true });
      return `${formattedDate} (${relativeTime})`;
    } catch (e) {
      return dateString;
    }
  };
  
  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'started':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-team-blue">
          Table Scraper Logs
        </CardTitle>
        
        <Button variant="outline" onClick={fetchLogs} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter logs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value="success">Successful Only</SelectItem>
                <SelectItem value="failed">Failed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-[250px]"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-blue"></div>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => toggleSort('created_at')}
                  >
                    <div className="flex items-center">
                      Timestamp
                      {sortField === 'created_at' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => toggleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Results</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => toggleLogExpansion(log.id)}>
                      <TableCell>
                        {getStatusIcon(log.status)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatDateTime(log.created_at)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(log.status)}
                      </TableCell>
                      <TableCell>
                        {log.status === 'completed' ? (
                          <span>
                            Found: {log.items_found ?? 0} | 
                            Added: {log.items_added ?? 0} | 
                            Updated: {log.items_updated ?? 0}
                          </span>
                        ) : log.status === 'failed' ? (
                          <span className="text-red-600">Failed</span>
                        ) : (
                          <span className="text-blue-600">In Progress</span>
                        )}
                      </TableCell>
                    </TableRow>
                    
                    {expandedLogs.has(log.id) && (
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={4} className="p-4">
                          <div className="space-y-2">
                            <div>
                              <span className="font-semibold">Log ID:</span> {log.id}
                            </div>
                            
                            {log.error_message && (
                              <div>
                                <span className="font-semibold text-red-600">Error:</span>
                                <div className="p-2 bg-red-50 text-red-800 rounded mt-1 whitespace-pre-wrap">
                                  {log.error_message}
                                </div>
                              </div>
                            )}
                            
                            {log.status === 'completed' && (
                              <div className="grid grid-cols-3 gap-2 bg-gray-100 p-2 rounded">
                                <div>
                                  <span className="font-semibold">Teams Found:</span> 
                                  <div className="text-lg font-bold">{log.items_found ?? 0}</div>
                                </div>
                                <div>
                                  <span className="font-semibold">Teams Added:</span> 
                                  <div className="text-lg font-bold text-green-600">{log.items_added ?? 0}</div>
                                </div>
                                <div>
                                  <span className="font-semibold">Teams Updated:</span> 
                                  <div className="text-lg font-bold text-blue-600">{log.items_updated ?? 0}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No scraper logs found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScraperLogsPanel;
