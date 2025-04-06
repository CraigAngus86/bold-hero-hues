
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, CheckSquare } from "lucide-react";
import { importHistoricFixtures } from '@/services/supabase/fixtures/importExport';
import validateFixtureData from '@/services/supabase/fixtures/testUtils';
import testFixturesImport from '@/services/supabase/fixtures/testUtils';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrapedFixture } from '@/types/fixtures';

export default function FixturesImporter() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
    fixtures?: ScrapedFixture[];
  } | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setValidationResult(null);
  };

  const validateFile = async () => {
    if (!file) {
      setError('Please select a JSON file to validate');
      return;
    }
    
    try {
      setIsTesting(true);
      
      // Read the file
      const text = await file.text();
      
      // Parse the JSON
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Failed to parse JSON file. Please ensure it is valid JSON.');
      }
      
      // Validate the data structure
      const result = validateFixtureData(jsonData);
      setValidationResult({
        valid: result.valid,
        message: result.message,
        fixtures: result.validFixtures
      });
      
      if (result.valid) {
        toast.success(`Validated ${result.validFixtures.length} fixtures`);
      } else {
        toast.warning('Validation found issues with the data');
      }
    } catch (error) {
      console.error('Error validating file:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error('Failed to validate fixtures file');
    } finally {
      setIsTesting(false);
    }
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
      
      // Import the data
      const result = await importHistoricFixtures(jsonData);
      
      if (result) {
        toast.success(`Successfully imported fixtures from ${file.name}`);
        setFile(null);
        setError(null);
        setValidationResult(null);
        
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
        
        {validationResult && (
          <Alert variant={validationResult.valid ? "default" : "destructive"}>
            <AlertDescription>
              {validationResult.valid ? (
                <div className="flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2 text-green-500" />
                  <span>{validationResult.message}</span>
                </div>
              ) : (
                validationResult.message
              )}
            </AlertDescription>
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
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={validateFile} 
              variant="outline"
              disabled={isTesting || isLoading || !file} 
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Validate File
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleImport} 
              disabled={isLoading || !file || (validationResult && !validationResult.valid)} 
              className="flex-1"
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
        </div>
        
        <div className="text-xs text-muted-foreground space-y-2 border-t pt-2">
          <p>Supported formats:</p>
          <p><strong>Standard format:</strong> Array of objects with homeTeam, awayTeam, date, time, competition, venue, isCompleted, homeScore, awayScore</p>
          <p><strong>Claude format:</strong> Array of objects with opposition, location (Home/Away), date, kickOffTime, competition, score (e.g., "2-1"), isCompleted</p>
        </div>
      </CardContent>
      
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          All imported fixtures will be tagged with source "manual-import" for tracking purposes
        </p>
      </CardFooter>
    </Card>
  );
}
