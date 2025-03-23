
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Database, RefreshCcw, Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AdminDatabaseSection = () => {
  const [activeTab, setActiveTab] = useState('tables');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Mock database tables
  const tables = [
    { name: 'league_table', records: 16, lastUpdated: '2023-10-15' },
    { name: 'fixtures', records: 42, lastUpdated: '2023-10-14' },
    { name: 'results', records: 28, lastUpdated: '2023-10-14' },
    { name: 'players', records: 24, lastUpdated: '2023-10-12' },
    { name: 'news', records: 8, lastUpdated: '2023-10-10' },
  ];
  
  const handleConnectDatabase = () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess('Successfully connected to database');
      toast.success('Database connection established');
    }, 1500);
  };
  
  const handleBackupData = () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess('Database backup created successfully');
      toast.success('Database backup completed');
      
      // Create and download a mock JSON file
      const mockData = { tables, timestamp: new Date().toISOString() };
      const dataStr = JSON.stringify(mockData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `banks-o-dee-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }, 1500);
  };
  
  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Database Management</CardTitle>
      </CardHeader>
      
      <CardContent className="px-0 pb-0">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-300">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Database Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Connection Type</label>
                  <Select defaultValue="local">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="firebase">Firebase</SelectItem>
                      <SelectItem value="supabase">Supabase</SelectItem>
                      <SelectItem value="custom">Custom API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">API Key/Endpoint</label>
                  <Input placeholder="Enter API key or endpoint URL" />
                </div>
                
                <Button 
                  onClick={handleConnectDatabase} 
                  disabled={isLoading}
                  className="w-full mt-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Connect Database
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Backup & Restore</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleBackupData}
                  disabled={isLoading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Backup Database
                </Button>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Restore from Backup</label>
                  <div className="flex space-x-2">
                    <Input type="file" className="text-sm" />
                    <Button variant="outline" disabled={isLoading}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Database Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Total Tables:</span>
                  <span className="font-medium">{tables.length}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Total Records:</span>
                  <span className="font-medium">{tables.reduce((acc, t) => acc + t.records, 0)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Last Backup:</span>
                  <span className="font-medium">Never</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Storage Used:</span>
                  <span className="font-medium">~1.2 MB</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Storage Available:</span>
                  <span className="font-medium">5 MB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="tables">Database Tables</TabsTrigger>
            <TabsTrigger value="queries">Custom Queries</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tables">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 font-medium">Table Name</th>
                    <th className="text-left p-3 font-medium">Records</th>
                    <th className="text-left p-3 font-medium">Last Updated</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tables.map((table) => (
                    <tr key={table.name} className="bg-white">
                      <td className="p-3">{table.name}</td>
                      <td className="p-3">{table.records}</td>
                      <td className="p-3">{table.lastUpdated}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Export</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="queries">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">SQL Query</label>
                    <textarea 
                      className="w-full h-32 border rounded-md p-2 text-sm font-mono"
                      placeholder="SELECT * FROM league_table WHERE points > 20 ORDER BY points DESC"
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <Button>Run Query</Button>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Query Results</p>
                    <div className="bg-gray-100 h-48 rounded-md p-3 text-sm overflow-auto">
                      <p className="text-gray-400 italic">Results will appear here...</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Database Activity Logs</p>
                    <Button variant="ghost" size="sm">Clear Logs</Button>
                  </div>
                  <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-md h-64 overflow-auto">
                    <div>[2023-10-15 08:12:34] Connected to database</div>
                    <div>[2023-10-15 08:13:05] Table league_table updated - 16 records</div>
                    <div>[2023-10-15 08:13:22] Table fixtures updated - 42 records</div>
                    <div>[2023-10-15 08:13:35] Table results updated - 28 records</div>
                    <div>[2023-10-14 15:46:12] Backup created - 1.2MB</div>
                    <div>[2023-10-14 15:45:03] Custom query executed - SELECT * FROM league_table</div>
                    <div>[2023-10-14 15:44:12] Connected to database</div>
                    <div>[2023-10-12 09:22:18] Added new record to players table</div>
                    <div>[2023-10-12 09:21:45] Table players updated - 24 records</div>
                    <div>[2023-10-10 14:17:32] Added new record to news table</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminDatabaseSection;
