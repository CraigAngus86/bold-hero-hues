
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Download, FileSpreadsheet, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { importFixturesFromJson, exportFixturesToJson } from '@/services/supabase/fixtures/importExport';

const BulkOperations: React.FC = () => {
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [importData, setImportData] = useState<string>('');
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload for import
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.type === 'application/json') {
        // Handle JSON file
        const text = await file.text();
        setImportData(text);
        
        try {
          const jsonData = JSON.parse(text);
          
          if (Array.isArray(jsonData)) {
            setImportPreview(jsonData.slice(0, 5));
            setValidationErrors([]);
          } else if (jsonData.fixtures && Array.isArray(jsonData.fixtures)) {
            setImportPreview(jsonData.fixtures.slice(0, 5));
            setValidationErrors([]);
          } else {
            setValidationErrors(['Invalid JSON format. Expected array of fixtures or object with fixtures array.']);
            setImportPreview([]);
          }
        } catch (error) {
          setValidationErrors(['Invalid JSON format']);
          setImportPreview([]);
        }
      } else if (file.type === 'text/csv') {
        // Handle CSV file (basic implementation)
        const text = await file.text();
        setImportData(text);
        
        try {
          // Basic CSV parsing
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
          const fixtures = [];
          for (let i = 1; i < Math.min(lines.length, 6); i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim());
            const fixture: any = {};
            
            headers.forEach((header, index) => {
              fixture[header] = values[index] || '';
            });
            
            fixtures.push(fixture);
          }
          
          setImportPreview(fixtures);
          setValidationErrors([]);
        } catch (error) {
          setValidationErrors(['Invalid CSV format']);
          setImportPreview([]);
        }
      } else {
        setValidationErrors(['Unsupported file type. Please upload JSON or CSV.']);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setValidationErrors(['Error processing file']);
    }
  };

  // Import fixtures from JSON or CSV
  const handleImport = async () => {
    if (!importData) {
      toast.error('No data to import');
      return;
    }
    
    setImportLoading(true);
    
    try {
      let jsonData;
      
      try {
        jsonData = JSON.parse(importData);
      } catch (error) {
        // Try to convert CSV to JSON
        const lines = importData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        jsonData = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.trim());
          const fixture: any = {};
          
          headers.forEach((header, index) => {
            fixture[header] = values[index] || '';
          });
          
          jsonData.push(fixture);
        }
      }
      
      // Process fixtures
      const result = await importFixturesFromJson(jsonData);
      
      if (result.success) {
        toast.success(result.message);
        setImportData('');
        setImportPreview([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error importing fixtures:', error);
      toast.error('Failed to import fixtures');
    } finally {
      setImportLoading(false);
    }
  };

  // Export all fixtures
  const handleExport = async () => {
    setExportLoading(true);
    
    try {
      const result = await exportFixturesToJson();
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error exporting fixtures:', error);
      toast.error('Failed to export fixtures');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
        <CardDescription>Import and export fixture data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file-upload">Upload Fixtures</Label>
              <Input 
                id="file-upload" 
                type="file" 
                accept=".json,.csv" 
                onChange={handleFileUpload} 
                ref={fileInputRef}
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: JSON, CSV
              </p>
            </div>
            
            <div className="grid w-full gap-1.5">
              <Label htmlFor="import-data">Or paste JSON/CSV data</Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
                placeholder='[{"date":"2023-04-01","time":"15:00","home_team":"Banks o\' Dee","away_team":"Opponent FC","competition":"Highland League"}]'
              />
            </div>
            
            {validationErrors.length > 0 && (
              <div className="bg-destructive/15 p-3 rounded-md">
                <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Validation Errors
                </div>
                <ul className="list-disc pl-5 text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {importPreview.length > 0 && (
              <div className="border rounded-md p-3">
                <Label className="block mb-2">Preview (first 5 fixtures):</Label>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-[200px]">
                  {JSON.stringify(importPreview, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <div className="flex flex-col gap-4 items-center justify-center py-6 border-2 border-dashed rounded-md">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Export Fixture Data</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Download all fixtures as a JSON file
                </p>
                <Button onClick={handleExport} disabled={exportLoading}>
                  {exportLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export All Fixtures
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleImport} 
          disabled={importLoading || !importData || validationErrors.length > 0}
          variant="default"
        >
          {importLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Import Fixtures
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BulkOperations;
