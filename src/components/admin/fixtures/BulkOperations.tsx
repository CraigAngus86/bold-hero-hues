
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Upload, Download, Clipboard, Save, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const BulkOperations: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [importTab, setImportTab] = useState<string>('csv');
  const [exportTab, setExportTab] = useState<string>('csv');
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (importTab === 'csv') {
        setCsvData(content);
      } else {
        setJsonData(content);
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleImport = async () => {
    try {
      setIsLoading(true);
      
      const dataToImport = importTab === 'csv' ? csvData : jsonData;
      
      // Replace with actual API call
      const response = await fetch('/api/fixtures/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: dataToImport,
          format: importTab,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Import failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      toast.success(`Successfully imported ${result.count} fixtures`);
      
      // Clear form after successful import
      if (importTab === 'csv') {
        setCsvData('');
      } else {
        setJsonData('');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import fixtures');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = async () => {
    try {
      setIsLoading(true);
      
      // Replace with actual API call
      const response = await fetch(`/api/fixtures/export?format=${exportTab}`);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `fixtures-export.${exportTab}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success('Fixtures exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export fixtures');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateStatuses = async () => {
    try {
      setIsLoading(true);
      
      // Replace with actual API call
      const response = await fetch('/api/fixtures/update-statuses', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Update failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      toast.success(`Updated ${result.count} fixture statuses`);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update fixture statuses');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Fixtures</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="csv" 
            value={importTab}
            onValueChange={setImportTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="csv">CSV Import</TabsTrigger>
              <TabsTrigger value="json">JSON Import</TabsTrigger>
            </TabsList>
            
            <TabsContent value="csv" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Upload a CSV file with columns: date, time, homeTeam, awayTeam, competition, venue, isCompleted, homeScore, awayScore
              </p>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="csv-file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button asChild variant="outline" className="w-full">
                    <label htmlFor="csv-file" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Select CSV File
                    </label>
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Clipboard className="mr-2 h-4 w-4" />
                        Paste CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Paste CSV Data</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        value={csvData}
                        onChange={(e) => setCsvData(e.target.value)}
                        placeholder="date,time,homeTeam,awayTeam,competition,venue,isCompleted,homeScore,awayScore"
                        className="min-h-[200px]"
                      />
                      <DialogFooter>
                        <Button onClick={() => setCsvData('')} variant="outline">
                          Clear
                        </Button>
                        <Button onClick={() => toast.success('CSV data saved')}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {csvData && (
                  <div className="border rounded-md p-2">
                    <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                    <pre className="text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                      {csvData.length > 500 
                        ? csvData.substring(0, 500) + '...' 
                        : csvData}
                    </pre>
                  </div>
                )}
                
                <Button
                  onClick={handleImport}
                  disabled={!csvData || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import CSV Data
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Upload a JSON file with fixture data matching the database schema
              </p>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="json-file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button asChild variant="outline" className="w-full">
                    <label htmlFor="json-file" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Select JSON File
                    </label>
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Clipboard className="mr-2 h-4 w-4" />
                        Paste JSON
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Paste JSON Data</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        value={jsonData}
                        onChange={(e) => setJsonData(e.target.value)}
                        placeholder='[{"date": "2023-01-01", "time": "15:00", "homeTeam": "Team A", ...}]'
                        className="min-h-[200px]"
                      />
                      <DialogFooter>
                        <Button onClick={() => setJsonData('')} variant="outline">
                          Clear
                        </Button>
                        <Button onClick={() => toast.success('JSON data saved')}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {jsonData && (
                  <div className="border rounded-md p-2">
                    <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                    <pre className="text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                      {jsonData.length > 500 
                        ? jsonData.substring(0, 500) + '...' 
                        : jsonData}
                    </pre>
                  </div>
                )}
                
                <Button
                  onClick={handleImport}
                  disabled={!jsonData || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import JSON Data
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Export Fixtures</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="csv" 
            value={exportTab}
            onValueChange={setExportTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="csv">CSV Export</TabsTrigger>
              <TabsTrigger value="json">JSON Export</TabsTrigger>
            </TabsList>
            
            <div className="flex justify-end">
              <Button
                onClick={handleExport}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export Fixtures
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Bulk Update Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Update Match Statuses</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Automatically mark fixtures as completed based on date
              </p>
              <Button
                onClick={handleUpdateStatuses}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Fixture Statuses
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
