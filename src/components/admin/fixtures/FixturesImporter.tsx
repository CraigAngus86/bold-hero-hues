
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Upload, Loader2 } from "lucide-react";
import { importHistoricFixtures } from '@/services/supabase/fixtures/importExport';
import { ScrapedFixture } from '@/types/fixtures';
import { toast } from 'sonner';

const FixturesImporter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fixturesCount, setFixturesCount] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file to import');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // Read the file
      const fileContent = await file.text();
      
      // Parse the JSON
      let fixtures: any[];
      try {
        fixtures = JSON.parse(fileContent);
        
        if (!Array.isArray(fixtures)) {
          throw new Error('The file does not contain a valid array of fixtures');
        }
      } catch (err) {
        setError('Invalid JSON format. Please ensure the file contains a valid array of fixtures.');
        setIsLoading(false);
        return;
      }

      // Basic validation - we now support both our format and Claude's format
      const isStandardFormat = fixtures.some(fixture => fixture.homeTeam || fixture.home_team);
      const isClaudeFormat = fixtures.some(fixture => fixture.opposition && fixture.location);
      
      if (!isStandardFormat && !isClaudeFormat) {
        setError(`Invalid fixture format. Each fixture must have either homeTeam/awayTeam fields or opposition/location fields.`);
        setIsLoading(false);
        return;
      }

      // Import fixtures - uses a single argument now
      const success = await importHistoricFixtures(fixtures);
      
      if (success) {
        setSuccess(true);
        setFixturesCount(fixtures.length);
        setFile(null);
        // Reset the file input
        const fileInput = document.getElementById('fixture-file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    } catch (err) {
      setError(`Error importing fixtures: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error importing fixtures:', err);
      toast.error('Failed to import fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historic Fixtures Import</CardTitle>
        <CardDescription>
          Import historic fixtures from a JSON file to build your fixtures database
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              Successfully imported {fixturesCount} fixtures
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="fixture-file" className="block text-sm font-medium text-gray-700 mb-1">
              Select JSON File
            </label>
            <input
              id="fixture-file"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              The JSON file should contain an array of fixture objects. Both standard and Claude formats are supported.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-medium">Supported JSON Formats:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-xs font-semibold mb-1">Standard Format:</h5>
                <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto">
{`[
  {
    "homeTeam": "Team A",
    "awayTeam": "Team B",
    "date": "2023-08-15",
    "time": "15:00",
    "competition": "Highland League"
  }
]`}
                </pre>
              </div>
              <div>
                <h5 className="text-xs font-semibold mb-1">Claude Format:</h5>
                <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto">
{`[
  {
    "date": "2023-08-15",
    "opposition": "Team B",
    "location": "Home",
    "kickOffTime": "15:00",
    "competition": "Highland League"
  }
]`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleImport} 
          disabled={isLoading || !file}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Import Fixtures
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FixturesImporter;
