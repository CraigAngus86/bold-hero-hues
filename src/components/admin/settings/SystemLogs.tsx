import React, { useState } from 'react';
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle,
  AlertCircle,
  Info,
  FileDown,
  Trash2,
  RefreshCw,
  Filter,
  Clock,
  Search,
  Activity,
  Server,
  BarChart3,
  Database,
  HardDrive,
  Cpu
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

// Mock data for system logs
const errorLogs = [
  { id: 1, level: 'error', message: 'Failed to connect to database', timestamp: '2025-04-06 02:14:32', source: 'Database' },
  { id: 2, level: 'error', message: 'Unable to process image upload: file size exceeded', timestamp: '2025-04-05 18:45:21', source: 'Media' },
  { id: 3, level: 'error', message: 'BBC scraper connection timeout after 30 seconds', timestamp: '2025-04-05 08:30:15', source: 'Scraper' },
  { id: 4, level: 'error', message: 'Authentication failed: Invalid credentials', timestamp: '2025-04-04 12:12:54', source: 'Auth' },
  { id: 5, level: 'error', message: 'Failed to send email notification', timestamp: '2025-04-03 09:23:45', source: 'Email' },
];

const activityLogs = [
  { id: 1, level: 'info', message: 'User admin@banksofdee.com logged in', timestamp: '2025-04-06 09:12:34', source: 'Auth' },
  { id: 2, level: 'info', message: 'New news article published: "Match Preview"', timestamp: '2025-04-06 08:45:12', source: 'Content' },
  { id: 3, level: 'warning', message: 'High server CPU usage detected (85%)', timestamp: '2025-04-05 23:20:45', source: 'System' },
  { id: 4, level: 'info', message: 'Fixtures data updated with 3 new matches', timestamp: '2025-04-05 08:30:15', source: 'Scraper' },
  { id: 5, level: 'info', message: 'System backup completed successfully', timestamp: '2025-04-05 04:00:00', source: 'System' },
  { id: 6, level: 'warning', message: 'Low disk space warning (15% remaining)', timestamp: '2025-04-04 16:45:23', source: 'System' },
  { id: 7, level: 'info', message: 'Sponsor banner updated: "Aberdeen FC"', timestamp: '2025-04-04 11:32:18', source: 'Content' },
  { id: 8, level: 'info', message: 'Email newsletter sent to 245 recipients', timestamp: '2025-04-03 09:15:00', source: 'Email' },
];

// System metrics mock data
const systemMetrics = {
  cpu: 32,
  memory: 64,
  disk: 85,
  network: [
    { time: '9:00', value: 42 },
    { time: '9:05', value: 53 },
    { time: '9:10', value: 38 },
    { time: '9:15', value: 47 },
    { time: '9:20', value: 62 }
  ],
  uptime: '15 days, 7 hours, 23 minutes',
  requests: {
    today: 1253,
    yesterday: 1102
  }
};

const SystemLogs = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [logFilter, setLogFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter logs based on selected filter and search term
  const getFilteredLogs = (logs: any[]) => {
    return logs
      .filter(log => logFilter === 'all' || log.source.toLowerCase() === logFilter.toLowerCase())
      .filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };
  
  const handleClearLogs = () => {
    toast({
      title: "Logs cleared",
      description: "All log entries have been cleared successfully.",
    });
  };
  
  const handleDownloadLogs = () => {
    toast({
      title: "Logs export started",
      description: "Your log export is being prepared for download.",
    });
    
    // In a real implementation, this would trigger a file download
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            Activity Logs
          </TabsTrigger>
          <TabsTrigger value="errors">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Error Logs
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <BarChart3 className="h-4 w-4 mr-2" />
            System Metrics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Activity Logs</CardTitle>
                  <CardDescription>
                    Track all system activities and user actions
                  </CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex">
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button variant="outline" className="rounded-l-none border-l-0">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Select
                    value={logFilter}
                    onValueChange={setLogFilter}
                  >
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="auth">Authentication</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="scraper">Scraper</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredLogs(activityLogs).length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Level
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Message
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getFilteredLogs(activityLogs).map((log) => (
                          <tr key={log.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Clock className="h-4 w-4 inline mr-2" />
                              {log.timestamp}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {log.level === 'info' && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  <Info className="h-3 w-3 mr-1" />
                                  Info
                                </Badge>
                              )}
                              {log.level === 'warning' && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Warning
                                </Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {log.source}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {log.message}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No matching logs found</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredLogs(activityLogs).length} of {activityLogs.length} entries
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadLogs}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
                <Button variant="outline" className="text-red-500" onClick={handleClearLogs}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Logs
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Error Logs</CardTitle>
                  <CardDescription>
                    Review system errors and exceptions
                  </CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex">
                    <Input
                      placeholder="Search errors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button variant="outline" className="rounded-l-none border-l-0">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Select
                    value={logFilter}
                    onValueChange={setLogFilter}
                  >
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="scraper">Scraper</SelectItem>
                      <SelectItem value="auth">Authentication</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Some logs contain sensitive information. Please handle with care.
                  </AlertDescription>
                </Alert>
                
                {getFilteredLogs(errorLogs).length > 0 ? (
                  <div className="space-y-4">
                    {getFilteredLogs(errorLogs).map((log) => (
                      <div key={log.id} className="border border-red-200 rounded-md bg-red-50 p-4">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-red-800">{log.message}</h4>
                              <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
                                {log.source}
                              </Badge>
                            </div>
                            <div className="text-sm text-red-700 mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1.5" />
                              {log.timestamp}
                            </div>
                            <div className="mt-2 text-sm">
                              <Button variant="outline" size="sm" className="text-red-700 border-red-200 bg-red-50 hover:bg-red-100">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No matching error logs found</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <div className="flex items-center">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Auto-refresh
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadLogs}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export Errors
                </Button>
                <Button variant="destructive" onClick={handleClearLogs}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Errors
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status & Metrics</CardTitle>
              <CardDescription>
                Monitor system performance and resource usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">CPU Usage</div>
                      <Badge variant={systemMetrics.cpu > 80 ? 'destructive' : 'outline'}>
                        {systemMetrics.cpu}%
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          systemMetrics.cpu > 80 ? 'bg-red-500' : 
                          systemMetrics.cpu > 60 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${systemMetrics.cpu}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground flex items-center">
                      <Cpu className="h-3 w-3 mr-1" />
                      4-core processor
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Memory</div>
                      <Badge variant={systemMetrics.memory > 80 ? 'destructive' : 'outline'}>
                        {systemMetrics.memory}%
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          systemMetrics.memory > 80 ? 'bg-red-500' : 
                          systemMetrics.memory > 60 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${systemMetrics.memory}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground flex items-center">
                      <Server className="h-3 w-3 mr-1" />
                      2 GB allocated
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Disk Space</div>
                      <Badge variant={systemMetrics.disk > 90 ? 'destructive' : systemMetrics.disk > 80 ? 'warning' : 'outline'}>
                        {systemMetrics.disk}%
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          systemMetrics.disk > 90 ? 'bg-red-500' : 
                          systemMetrics.disk > 80 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${systemMetrics.disk}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground flex items-center">
                      <HardDrive className="h-3 w-3 mr-1" />
                      1 TB storage
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="font-medium">Uptime</div>
                    <div className="text-2xl font-bold mt-1">15d 7h</div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <Server className="h-3 w-3 mr-1" />
                      Last reboot: Apr 21, 2025
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Database Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-muted-foreground">Active Connections</div>
                      <div className="text-2xl font-bold">12</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <Database className="h-3 w-3 mr-1" />
                        Normal load
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-muted-foreground">Query Response</div>
                      <div className="text-2xl font-bold">24ms</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <Activity className="h-3 w-3 mr-1" />
                        Performing well
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-muted-foreground">Database Size</div>
                      <div className="text-2xl font-bold">238 MB</div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <HardDrive className="h-3 w-3 mr-1" />
                        9 tables
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Traffic & Usage</h3>
                    <Select defaultValue="24h">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="24h">24 hours</SelectItem>
                        <SelectItem value="7d">7 days</SelectItem>
                        <SelectItem value="30d">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="text-sm font-medium">API Requests Today</div>
                      <div className="text-2xl font-bold mt-2">{systemMetrics.requests.today.toLocaleString()}</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <span>↑ {((systemMetrics.requests.today - systemMetrics.requests.yesterday) / systemMetrics.requests.yesterday * 100).toFixed(1)}%</span>
                        <span className="text-muted-foreground ml-1">vs. yesterday</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="text-sm font-medium">Active Users</div>
                      <div className="text-2xl font-bold mt-2">24</div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>Peak: 78 users at 19:30</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 relative">
                    <div className="text-sm font-medium mb-4">Network Traffic</div>
                    {/* This would typically be a real chart component */}
                    <div className="h-40 flex items-end justify-between px-2">
                      {systemMetrics.network.map((point, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className="w-10 bg-blue-500 rounded-t"
                            style={{ height: `${point.value}%` }}
                          ></div>
                          <div className="text-xs mt-1">{point.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-5">
              <div className="text-sm text-muted-foreground">
                Last updated: 2 minutes ago
              </div>
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Refreshing metrics",
                  description: "System metrics are being updated.",
                });
              }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Metrics
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemLogs;
