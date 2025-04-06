
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { 
  Download, 
  Upload, 
  Database, 
  FileJson, 
  Package, 
  Calendar, 
  Users, 
  Newspaper, 
  Award, 
  ShoppingBag,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  FileUp,
  FileDown,
  Trash2,
  Sparkles,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

const ImportExportTools = () => {
  const [exportOptions, setExportOptions] = useState({
    fixtures: true,
    team: true,
    news: true,
    sponsors: true,
    tickets: true,
    settings: false,
    format: 'json'
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // For data cleansing configuration
  const [cleansingConfig, setCleansingConfig] = useState({
    removeEmptyFixtures: true,
    consolidateDuplicates: true,
    normalizeTeamNames: true,
    removePastEvents: false,
    cleanupOrphanedData: true
  });
  
  // Handle export process
  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          toast({
            title: "Export complete",
            description: "Your data has been exported successfully.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle import process
  const handleImport = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to import.",
        variant: "destructive"
      });
      return;
    }
    
    setIsImporting(true);
    setImportProgress(0);
    
    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          toast({
            title: "Import complete",
            description: `Data from ${selectedFile.name} has been imported successfully.`,
          });
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };
  
  // Handle database cleaning
  const handleCleanDatabase = () => {
    toast({
      title: "Database cleaning started",
      description: "Your database is being cleaned according to the selected options.",
    });
    
    // In a real implementation, this would call an API to clean the database
    setTimeout(() => {
      toast({
        title: "Database cleaning complete",
        description: "Your database has been cleaned successfully.",
      });
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Import & Export</CardTitle>
          <CardDescription>
            Export or import data to and from your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Export Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <FileDown className="h-5 w-5 mr-2" />
                Export Data
              </h3>
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="export-fixtures" 
                    checked={exportOptions.fixtures}
                    onCheckedChange={(checked) => setExportOptions({...exportOptions, fixtures: !!checked})}
                  />
                  <label htmlFor="export-fixtures" className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Fixtures & Results</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="export-team" 
                    checked={exportOptions.team}
                    onCheckedChange={(checked) => setExportOptions({...exportOptions, team: !!checked})}
                  />
                  <label htmlFor="export-team" className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Team & Management</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="export-news" 
                    checked={exportOptions.news}
                    onCheckedChange={(checked) => setExportOptions({...exportOptions, news: !!checked})}
                  />
                  <label htmlFor="export-news" className="flex items-center space-x-2 text-sm">
                    <Newspaper className="h-4 w-4" />
                    <span>News Articles</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="export-sponsors" 
                    checked={exportOptions.sponsors}
                    onCheckedChange={(checked) => setExportOptions({...exportOptions, sponsors: !!checked})}
                  />
                  <label htmlFor="export-sponsors" className="flex items-center space-x-2 text-sm">
                    <Award className="h-4 w-4" />
                    <span>Sponsors</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="export-tickets" 
                    checked={exportOptions.tickets}
                    onCheckedChange={(checked) => setExportOptions({...exportOptions, tickets: !!checked})}
                  />
                  <label htmlFor="export-tickets" className="flex items-center space-x-2 text-sm">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Tickets</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="export-settings" 
                    checked={exportOptions.settings}
                    onCheckedChange={(checked) => setExportOptions({...exportOptions, settings: !!checked})}
                  />
                  <label htmlFor="export-settings" className="flex items-center space-x-2 text-sm">
                    <Package className="h-4 w-4" />
                    <span>Settings & Configuration</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-2">
                <label className="text-sm font-medium">Export Format</label>
                <Select
                  value={exportOptions.format}
                  onValueChange={(value) => setExportOptions({...exportOptions, format: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <div className="flex items-center">
                        <FileJson className="h-4 w-4 mr-2" />
                        JSON
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center">
                        <FileDown className="h-4 w-4 mr-2" />
                        CSV
                      </div>
                    </SelectItem>
                    <SelectItem value="sql">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        SQL Dump
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                {isExporting ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exporting data...</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} />
                  </div>
                ) : (
                  <Button onClick={handleExport} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Selected Data
                  </Button>
                )}
              </div>
            </div>
            
            {/* Import Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <FileUp className="h-5 w-5 mr-2" />
                Import Data
              </h3>
              <Separator />
              
              <div className="space-y-4">
                <label className="block">
                  <div className="text-sm font-medium mb-2">Select Import File</div>
                  <div className="flex">
                    <Input
                      type="file"
                      accept=".json,.csv,.sql,.zip"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: JSON, CSV, SQL Dump, ZIP
                  </p>
                </label>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Import Options</label>
                  
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox id="merge-data" defaultChecked />
                    <label htmlFor="merge-data" className="text-sm">Merge with existing data</label>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox id="overwrite-data" />
                    <label htmlFor="overwrite-data" className="text-sm">Overwrite existing data</label>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox id="validate-data" defaultChecked />
                    <label htmlFor="validate-data" className="text-sm">Validate data before import</label>
                  </div>
                </div>
                
                <div className="pt-4">
                  {isImporting ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Importing data...</span>
                        <span>{importProgress}%</span>
                      </div>
                      <Progress value={importProgress} />
                    </div>
                  ) : (
                    <Button 
                      onClick={handleImport} 
                      className="w-full"
                      disabled={!selectedFile}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {selectedFile ? `Import ${selectedFile.name}` : 'Import Data'}
                    </Button>
                  )}
                </div>
                
                {selectedFile && (
                  <div className="rounded-md bg-muted p-3 mt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileJson className="h-5 w-5 mr-2" />
                        <div>
                          <div className="font-medium text-sm">{selectedFile.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">Ready to import</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Data Cleaning */}
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Data Cleansing
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remove-empty" 
                      checked={cleansingConfig.removeEmptyFixtures}
                      onCheckedChange={(checked) => setCleansingConfig({...cleansingConfig, removeEmptyFixtures: !!checked})}
                    />
                    <label htmlFor="remove-empty" className="text-sm">Remove empty fixtures</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="consolidate-duplicates" 
                      checked={cleansingConfig.consolidateDuplicates}
                      onCheckedChange={(checked) => setCleansingConfig({...cleansingConfig, consolidateDuplicates: !!checked})}
                    />
                    <label htmlFor="consolidate-duplicates" className="text-sm">Consolidate duplicate entries</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="normalize-teams" 
                      checked={cleansingConfig.normalizeTeamNames}
                      onCheckedChange={(checked) => setCleansingConfig({...cleansingConfig, normalizeTeamNames: !!checked})}
                    />
                    <label htmlFor="normalize-teams" className="text-sm">Normalize team names</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remove-past" 
                      checked={cleansingConfig.removePastEvents}
                      onCheckedChange={(checked) => setCleansingConfig({...cleansingConfig, removePastEvents: !!checked})}
                    />
                    <label htmlFor="remove-past" className="text-sm">Archive past events (older than 1 year)</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cleanup-orphaned" 
                      checked={cleansingConfig.cleanupOrphanedData}
                      onCheckedChange={(checked) => setCleansingConfig({...cleansingConfig, cleanupOrphanedData: !!checked})}
                    />
                    <label htmlFor="cleanup-orphaned" className="text-sm">Clean up orphaned data</label>
                  </div>
                </div>
              </div>
              
              <div>
                <Alert variant="warning" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Caution</AlertTitle>
                  <AlertDescription>
                    Data cleansing operations cannot be undone. We recommend creating a backup first.
                  </AlertDescription>
                </Alert>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Clean Database
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Database Cleaning</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to clean the database? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span>Improves database performance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span>Reduces storage usage</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span>Ensures data consistency</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span>Cannot be reversed</span>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" type="button">Cancel</Button>
                      <Button onClick={handleCleanDatabase}>Proceed with Cleaning</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-5">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Last backup: 2025-04-05 04:00 AM
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Data Reset</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to reset your data? This will delete all data and cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Danger Zone</AlertTitle>
                    <AlertDescription>
                      This action will permanently delete all your data. Please type "DELETE" to confirm.
                    </AlertDescription>
                  </Alert>
                  <Input className="mt-4" placeholder="Type DELETE to confirm" />
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Reset All Data</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button>
              <RotateCcw className="h-4 w-4 mr-2" />
              Backup Now
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImportExportTools;
