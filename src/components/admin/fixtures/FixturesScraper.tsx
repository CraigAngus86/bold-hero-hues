
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Check, Download, Globe } from "lucide-react";
import { scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport'; 
import { toast } from 'sonner';
import { supabase } from '@/services/supabase/supabaseClient';
import { ScrapedFixture } from '@/utils/FirecrawlService';

export default function FixturesScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Test the scraping function
  const handleTestFetch = async () => {
    try {
      setTestLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      console.log('Testing fixture scraping from HFL website...');
      toast.info('Testing connection to Highland League website...');
      
      // Call the Edge Function directly
      const { data, error: fnError } = await supabase.functions.invoke('scrape-fixtures', {
        body: { url: 'http://www.highlandfootballleague.com/Fixtures/' }
      });
      
      if (fnError || !data?.success) {
        const errorMsg = fnError?.message || data?.error || 'Failed to fetch fixtures';
        console.error('Test fetch failed:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      console.log('Test fetch successful, found', data.data.length, 'fixtures');
      setResults(data.data);
      setSuccess(true);
      toast.success(`Successfully fetched ${data.data.length} fixtures`);
      
    } catch (error) {
      console.error('Error testing fetch:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while testing the connection');
    } finally {
      setTestLoading(false);
    }
  };
  
  // Fetch and store fixtures
  const handleFetchFixtures = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      console.log('Starting fixture scraping and storage process...');
      toast.info('Scraping fixtures... This may take a moment.');
      
      // Get fixtures using the Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('scrape-fixtures', {
        body: { url: 'http://www.highlandfootballleague.com/Fixtures/' }
      });
      
      if (fnError || !data?.success) {
        const errorMsg = fnError?.message || data?.error || 'Failed to fetch fixtures';
        console.error('Fetch failed:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      console.log('Fixtures fetch successful, proceeding with import...');
      
      // Store fixtures
      const success = await scrapeAndStoreFixtures(data.data);
      
      if (!success) {
        setError('Failed to store fixtures. Check the console for details.');
        toast.error('Failed to store fixtures in database');
        return;
      }
      
      // Get the data to display
      setResults(data.data);
      setSuccess(true);
      toast.success(`Successfully imported ${data.data.length} fixtures`);
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportFixtures = () => {
    try {
      if (results.length === 0) {
        toast.warning('No fixtures to export');
        return;
      }
      
      const jsonData = JSON.stringify(results, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `highland-league-fixtures-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success('Fixtures exported successfully');
    } catch (error) {
      console.error('Failed to export fixtures:', error);
      toast.error('Failed to export fixtures');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Highland League Fixtures Importer</CardTitle>
        <CardDescription>
          Fetch fixtures from the official Highland Football League website
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <Globe className="h-4 w-4" />
          <AlertTitle>Official Highland League Website</AlertTitle>
          <AlertDescription>
            This tool fetches fixtures directly from the official Highland Football League website 
            using a Supabase Edge Function, similar to how the league table is fetched.
          </AlertDescription>
        </Alert>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              Successfully fetched {results.length} fixtures
            </AlertDescription>
          </Alert>
        )}
        
        {results.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Fetched Fixtures:</h3>
              <Button size="sm" variant="outline" onClick={handleExportFixtures}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-md p-4">
              {results.map((fixture, index) => (
                <div key={index} className="mb-2 text-sm">
                  {fixture.date} {fixture.time}: {fixture.homeTeam} vs {fixture.awayTeam}
                  {fixture.isCompleted && (
                    <span className="ml-2 text-green-600">
                      ({fixture.homeScore} - {fixture.awayScore})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="w-full"
          onClick={handleTestFetch}
          disabled={testLoading}
          variant="outline"
        >
          {testLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Test Connection
            </>
          )}
        </Button>
        
        <Button
          className="w-full"
          onClick={handleFetchFixtures}
          disabled={isLoading || testLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Fetching & Storing...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Fetch & Store Fixtures
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
