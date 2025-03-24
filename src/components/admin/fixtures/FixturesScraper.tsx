
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Check, Download, Globe } from "lucide-react";
import { scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport'; 
import { toast } from 'sonner';
import { supabase } from '@/services/supabase/supabaseClient';
import { ScrapedFixture } from '@/types/fixtures';

export default function FixturesScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Test the scraping function with BBC Sport
  const handleTestFetch = async () => {
    try {
      setTestLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      console.log('Testing fixture scraping from BBC Sport website...');
      toast.info('Testing connection to BBC Sport website...');
      
      // Call the Edge Function directly
      const { data, error: fnError } = await supabase.functions.invoke('scrape-bbc-fixtures', {
        body: { url: 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures' }
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
      toast.success(`Successfully fetched ${data.data.length} fixtures from BBC Sport`);
      
    } catch (error) {
      console.error('Error testing fetch:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while testing the connection');
    } finally {
      setTestLoading(false);
    }
  };
  
  // Fetch from Highland League website
  const handleFetchFromHFL = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      console.log('Starting fixture scraping from Highland League website...');
      toast.info('Scraping fixtures from Highland League website...');
      
      // Get fixtures using the Highland League Edge Function
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
      toast.success(`Successfully imported ${data.data.length} fixtures from Highland League website`);
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch from BBC Sport
  const handleFetchFromBBC = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      console.log('Starting fixture scraping from BBC Sport...');
      toast.info('Scraping fixtures from BBC Sport...');
      
      // Get fixtures using the BBC Sport Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('scrape-bbc-fixtures', {
        body: { url: 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures' }
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
      toast.success(`Successfully imported ${data.data.length} fixtures from BBC Sport`);
      
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
          Fetch fixtures from official Highland League sources using Supabase Edge Functions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <Globe className="h-4 w-4" />
          <AlertTitle>Data Sources</AlertTitle>
          <AlertDescription>
            This tool offers two data sources: The official Highland Football League website and BBC Sport's
            Highland League section. The BBC source typically provides more reliable structured data.
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
      
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          className="w-full sm:w-auto"
          onClick={handleTestFetch}
          disabled={testLoading || isLoading}
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
              Test BBC Sport Connection
            </>
          )}
        </Button>
        
        <Button
          className="w-full sm:w-auto"
          onClick={handleFetchFromBBC}
          disabled={isLoading || testLoading}
        >
          {isLoading && success === false ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Fetching from BBC Sport...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Fetch from BBC Sport
            </>
          )}
        </Button>
        
        <Button
          className="w-full sm:w-auto"
          onClick={handleFetchFromHFL}
          disabled={isLoading || testLoading}
          variant="secondary"
        >
          {isLoading && success === true ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Fetching from HFL...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Fetch from Highland League
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
