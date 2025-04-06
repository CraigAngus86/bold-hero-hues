
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Download,
  Upload,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Save,
  FileJson,
  FileCog,
  FileWarning
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DatabaseManagement = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isActivatingBackup, setIsActivatingBackup] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          
          // Simulate download
          setTimeout(() => {
            toast({
              title: "Export complete",
              description: "Database exported successfully"
            });
          }, 500);
          
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    setImportProgress(0);
    
    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          
          toast({
            title: "Import complete",
            description: "Database imported successfully"
          });
          
          return 100;
        }
        return prevProgress + 5;
      });
    }, 200);
  };
  
  const handleOptimize = () => {
    toast({
      title: "Database optimization",
      description: "This feature will be available in a future update."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-primary" />
          Database Management
        </CardTitle>
        <CardDescription>
          Backup, restore, and optimize your database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Database operations can affect your site's data. Always make a backup before performing any database operations.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="backup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="restore">Restore</TabsTrigger>
            <TabsTrigger value="optimize">Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="backup" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Full Database Backup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export a complete backup of your database, including all tables.
                  </p>
                  {isExporting && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span>Exporting database...</span>
                        <span>{exportProgress}%</span>
                      </div>
                      <Progress value={exportProgress} />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleExport} 
                    disabled={isExporting}
                    className="w-full"
                  >
                    {isExporting ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {isExporting ? "Exporting..." : "Export Database"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <FileJson className="mr-2 h-4 w-4" />
                    Content Export
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export specific content types (news, fixtures, team, etc.).
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export Content
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <FileCog className="mr-2 h-4 w-4" />
                  Scheduled Backups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure automatic backup schedules to ensure data safety.
                </p>
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm">
                    Scheduled backups will be available in a future update.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled className="w-full">
                  Configure Scheduled Backups
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="restore" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <FileWarning className="mr-2 h-4 w-4" />
                  Database Restore
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Restoring a database will overwrite your current data. This action cannot be undone.
                  </AlertDescription>
                </Alert>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Restore your database from a previous backup file.
                </p>
                
                {isImporting && (
                  <div className="space-y-2 my-4">
                    <div className="flex justify-between text-xs">
                      <span>Importing database...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <div className="w-full">
                  <input
                    type="file"
                    id="database-file"
                    className="hidden"
                    accept=".json,.sql"
                    onChange={handleImport}
                    disabled={isImporting}
                  />
                  <Button 
                    asChild
                    variant="outline" 
                    className="w-full"
                    disabled={isImporting}
                  >
                    <label htmlFor="database-file" className="cursor-pointer flex items-center justify-center">
                      <Upload className="mr-2 h-4 w-4" />
                      {isImporting ? "Importing..." : "Select Backup File"}
                    </label>
                  </Button>
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => setIsConfirmDialogOpen(true)}
                  disabled={isImporting}
                >
                  Restore Database
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Available Backups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Select from previous backups to restore.
                </p>
                
                <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
                  No backups found. Create a backup first.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="optimize" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    Database Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Optimize database tables to improve performance.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleOptimize}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Optimize Database
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <FileCog className="mr-2 h-4 w-4" />
                    Clean Old Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Remove old logs, revisions, and temporary data.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleOptimize}
                  >
                    Clean Database
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Database Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-xs text-muted-foreground">Database Size</p>
                      <p className="text-lg font-semibold">24.7 MB</p>
                    </div>
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-xs text-muted-foreground">Total Tables</p>
                      <p className="text-lg font-semibold">42</p>
                    </div>
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-xs text-muted-foreground">Total Records</p>
                      <p className="text-lg font-semibold">3,241</p>
                    </div>
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-xs text-muted-foreground">Last Optimized</p>
                      <p className="text-lg font-semibold">Never</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-center italic">
                    Note: Values shown are for demonstration purposes
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will overwrite your current database with the backup data. 
              This action cannot be undone and may result in data loss.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setIsActivatingBackup(true);
                setTimeout(() => {
                  setIsActivatingBackup(false);
                  setIsConfirmDialogOpen(false);
                  toast({
                    title: "Database restored",
                    description: "Your database has been restored successfully",
                  });
                }, 2000);
              }}
              disabled={isActivatingBackup}
            >
              {isActivatingBackup ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isActivatingBackup ? "Restoring..." : "Yes, Restore Database"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default DatabaseManagement;
