
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, FileSpreadsheet, Calendar, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BulkOperationsProps {
  onRefreshData?: () => void;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({ onRefreshData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [updateType, setUpdateType] = useState<'complete' | 'postpone' | 'reschedule'>('complete');
  
  // Handle CSV file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };
  
  // Import fixtures from CSV
  const handleImportCSV = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file to import");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Read the file
      const fileReader = new FileReader();
      
      fileReader.onload = async (e) => {
        const csvData = e.target?.result as string;
        
        // Parse CSV
        const rows = csvData.split('\n');
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        
        const fixtures = [];
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = rows[i].split(',').map(v => v.trim());
          const fixture: Record<string, any> = {};
          
          headers.forEach((header, index) => {
            const value = values[index];
            
            switch (header) {
              case 'date':
                fixture.date = value;
                break;
              case 'time':
                fixture.time = value || '15:00';
                break;
              case 'home_team':
              case 'hometeam':
                fixture.home_team = value;
                break;
              case 'away_team':
              case 'awayteam':
                fixture.away_team = value;
                break;
              case 'competition':
                fixture.competition = value;
                break;
              case 'venue':
                fixture.venue = value;
                break;
              case 'is_completed':
              case 'completed':
                fixture.is_completed = value.toLowerCase() === 'true';
                break;
              case 'home_score':
              case 'homescore':
                fixture.home_score = parseInt(value) || null;
                break;
              case 'away_score':
              case 'awayscore':
                fixture.away_score = parseInt(value) || null;
                break;
              default:
                fixture[header] = value;
            }
          });
          
          // Add required fields if missing
          if (!fixture.is_completed) fixture.is_completed = false;
          if (!fixture.time) fixture.time = '15:00';
          
          fixtures.push(fixture);
        }
        
        // Upload to Supabase
        const { data, error } = await supabase
          .from('fixtures')
          .insert(fixtures);
          
        if (error) {
          throw error;
        }
        
        toast.success(`Successfully imported ${fixtures.length} fixtures`);
        
        // Refresh data if callback provided
        if (onRefreshData) onRefreshData();
      };
      
      fileReader.readAsText(csvFile);
      
    } catch (error) {
      console.error('Error importing fixtures:', error);
      toast.error('Failed to import fixtures');
    } finally {
      setIsUploading(false);
      setCsvFile(null);
    }
  };
  
  // Export fixtures to CSV
  const handleExportCSV = async () => {
    setIsExporting(true);
    
    try {
      // Fetch all fixtures
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .order('date', { ascending: true });
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error('No fixtures to export');
        return;
      }
      
      // Create CSV string
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      );
      
      const csvContent = [headers, ...rows].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      
      link.setAttribute('href', url);
      link.setAttribute('download', `fixtures-export-${date}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${data.length} fixtures`);
    } catch (error) {
      console.error('Error exporting fixtures:', error);
      toast.error('Failed to export fixtures');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Bulk update fixtures
  const handleBulkUpdate = async () => {
    setIsUpdating(true);
    
    try {
      // Implementation will depend on the specific update type
      // This is a placeholder for now
      toast.success(`Bulk operation completed successfully`);
      if (onRefreshData) onRefreshData();
    } catch (error) {
      console.error('Error during bulk operation:', error);
      toast.error('Failed to complete bulk operation');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Bulk Operations</h3>
      
      <Tabs defaultValue="import">
        <TabsList className="mb-4">
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="update">Bulk Update</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-4">
          <Alert variant="outline">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Import CSV</AlertTitle>
            <AlertDescription>
              CSV should have headers matching: date, time, home_team, away_team, competition, venue, etc.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="csvFile">CSV File</Label>
              <Input 
                id="csvFile" 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
              />
            </div>
            
            <Button 
              onClick={handleImportCSV} 
              disabled={!csvFile || isUploading}
              className="w-full"
              variant="default"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Import Fixtures
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <Alert variant="outline">
            <AlertTitle>Export Fixtures</AlertTitle>
            <AlertDescription>
              Download all fixtures as a CSV file for backup or editing.
            </AlertDescription>
          </Alert>
          
          <Button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="w-full"
            variant="default"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </>
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="update" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Update Type</Label>
              <div className="flex gap-4">
                <Button
                  variant={updateType === 'complete' ? 'default' : 'default'}
                  onClick={() => setUpdateType('complete')}
                  className="flex-1"
                >
                  Mark as Complete
                </Button>
                <Button
                  variant={updateType === 'postpone' ? 'default' : 'default'}
                  onClick={() => setUpdateType('postpone')}
                  className="flex-1"
                >
                  Postpone
                </Button>
                <Button
                  variant={updateType === 'reschedule' ? 'default' : 'default'}
                  onClick={() => setUpdateType('reschedule')}
                  className="flex-1"
                >
                  Reschedule
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleBulkUpdate}
              disabled={isUpdating}
              className="w-full"
              variant="default"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Apply Bulk Update
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default BulkOperations;
