
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { importHistoricFixtures } from '@/services/supabase/fixtures/importExport';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FixturesImporter() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
  };
  
  const handleImport = async () => {
    if (!file) {
      setError('Please select a JSON file to import');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Read the file
      const text = await file.text();
      
      // Parse the JSON
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Failed to parse JSON file. Please ensure it is valid JSON.');
      }
      
      // Validate minimal structure
      if (!Array.isArray(jsonData)) {
        throw new Error('Invalid JSON structure. Expected an array of fixtures.');
      }
      
      // Check if it has at least one item with key properties
      if (jsonData.length > 0) {
        const firstItem = jsonData[0];
        const hasClaudeFormat = 'opposition' in firstItem && 'location' in firstItem;
        const hasStandardFormat = ('homeTeam' in firstItem || 'home_team' in firstItem) && 
                                ('awayTeam' in firstItem || 'away_team' in firstItem);
        
        if (!hasClaudeFormat && !hasStandardFormat) {
          throw new Error('Invalid fixture data format. Expected either standard format (homeTeam/awayTeam) or Claude format (opposition/location).');
        }
      }
      
      // Import the data
      const result = await importHistoricFixtures(jsonData);
      
      if (result) {
        toast.success(`Successfully imported fixtures from ${file.name}`);
        setFile(null);
        setError(null);
        
        // Reset the file input
        const fileInput = document.getElementById('fixture-file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        throw new Error('Failed to import fixtures. See console for details.');
      }
    } catch (error) {
      console.error('Error importing fixtures:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error('Failed to import fixtures');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Historic Fixtures</CardTitle>
        <CardDescription>
          Import fixture data from a JSON file
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="fixture-file" className="text-sm font-medium">
              Select JSON File
            </label>
            <input
              id="fixture-file"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/80"
            />
            <p className="text-xs text-muted-foreground">
              Supports standard format or Claude's fixture format
            </p>
          </div>
          
          <Button 
            onClick={handleImport} 
            disabled={isLoading || !file} 
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Import Fixtures
              </>
            )}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-2 border-t pt-2">
          <p>Supported formats:</p>
          <p><strong>Standard format:</strong> Array of objects with homeTeam, awayTeam, date, time, competition, venue, isCompleted, homeScore, awayScore</p>
          <p><strong>Claude format:</strong> Array of objects with opposition, location (Home/Away), date, kickOffTime, competition, score (e.g., "2-1"), isCompleted</p>
        </div>
      </CardContent>
    </Card>
  );
}
