import React from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  Database,
  Shield,
  Copy,
  HardDrive,
  RefreshCcw,
  Download,
  Upload,
  CheckCircle2,
  Key,
  Save,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/services/supabase/supabaseClient';

const SupabaseConnection = () => {
  const [databaseInfo, setDatabaseInfo] = React.useState({
    connected: true,
    version: '15.1.0.25',
    size: 35.4, // MB
    tables: 9,
    lastBackup: '2025-04-05 02:00:00'
  });
  
  const [storageInfo, setStorageInfo] = React.useState({
    size: 158.2, // MB
    files: 247,
    buckets: 3,
    usage: 7.9 // percentage
  });
  
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('••••••••••••••••••••••');
    toast({
      title: "API Key copied",
      description: "The key has been copied to your clipboard.",
    });
  };
  
  const handleTestConnection = () => {
    toast({
      title: "Connection successful",
      description: "Your database connection is working properly.",
    });
  };
  
  const handleBackupNow = () => {
    toast({
      title: "Backup initiated",
      description: "Your database backup is being created.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Status</CardTitle>
          <CardDescription>
            Monitor and manage your Supabase database connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-emerald-500 mr-3" />
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">Database Status</h3>
                    {databaseInfo.connected ? (
                      <span className="ml-3 px-2 py-1 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700">Connected</span>
                    ) : (
                      <span className="ml-3 px-2 py-1 rounded-full bg-red-50 text-xs font-medium text-red-700">Disconnected</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current connection status with your Supabase project
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleTestConnection}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Database Information</h3>
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database Engine:</span>
                  <span className="font-medium">PostgreSQL {databaseInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database Size:</span>
                  <span className="font-medium">{databaseInfo.size} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tables:</span>
                  <span className="font-medium">{databaseInfo.tables}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Backup:</span>
                  <span className="font-medium">{databaseInfo.lastBackup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project ID:</span>
                  <span className="font-medium">bbbxhwaixjjxgboeiktq</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region:</span>
                  <span className="font-medium">West Europe (Amsterdam)</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={handleBackupNow}>
                  <Save className="h-4 w-4 mr-2" />
                  Backup Now
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Schema
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Storage Information</h3>
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage Used:</span>
                  <span className="font-medium">{storageInfo.size} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Files:</span>
                  <span className="font-medium">{storageInfo.files}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buckets:</span>
                  <span className="font-medium">{storageInfo.buckets}</span>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Usage:</span>
                    <span className="font-medium">{storageInfo.usage}%</span>
                  </div>
                  <Progress value={storageInfo.usage} className="h-2" />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Manage API Keys
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>API Key Management</DialogTitle>
                      <DialogDescription>
                        Manage the API keys used to connect to Supabase
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Anonymous Key</label>
                        <div className="flex">
                          <Input 
                            value="•••••••••••••••••••••••••••••••••••" 
                            readOnly 
                            className="font-mono text-sm rounded-r-none"
                          />
                          <Button 
                            variant="outline" 
                            className="rounded-l-none border-l-0"
                            onClick={handleCopyApiKey}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Used for public client access with RLS policies
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Service Role Key</label>
                        <div className="flex">
                          <Input 
                            value="•••••••••••••••••••••••••••••••••••" 
                            readOnly 
                            className="font-mono text-sm rounded-r-none"
                          />
                          <Button 
                            variant="outline" 
                            className="rounded-l-none border-l-0"
                            onClick={handleCopyApiKey}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <AlertTriangle className="h-3 w-3 inline mr-1 text-amber-500" />
                          Caution: This key bypasses RLS policies
                        </p>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline">
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Rotate Keys
                      </Button>
                      <Button>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Done
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  RLS Policies
                </Button>
                
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Database Tables</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>RLS Protected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">fixtures</TableCell>
                  <TableCell>324</TableCell>
                  <TableCell>2.4 MB</TableCell>
                  <TableCell>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">highland_league_table</TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>0.2 MB</TableCell>
                  <TableCell>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">news_articles</TableCell>
                  <TableCell>156</TableCell>
                  <TableCell>5.8 MB</TableCell>
                  <TableCell>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">sponsors</TableCell>
                  <TableCell>18</TableCell>
                  <TableCell>0.3 MB</TableCell>
                  <TableCell>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">team_members</TableCell>
                  <TableCell>48</TableCell>
                  <TableCell>1.8 MB</TableCell>
                  <TableCell>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-5">
          <Button variant="outline">
            <HardDrive className="h-4 w-4 mr-2" />
            Reset Project
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              window.open('https://supabase.com/dashboard/project/bbbxhwaixjjxgboeiktq', '_blank');
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Supabase Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SupabaseConnection;
