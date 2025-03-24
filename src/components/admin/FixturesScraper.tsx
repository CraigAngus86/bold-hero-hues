
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Check, Download } from "lucide-react";
import { scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport'; 
import { toast } from 'sonner';
import { ScrapedFixture } from '@/types/fixtures';
import { supabase } from '@/services/supabase/supabaseClient';

export default function FixturesScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleFetchFixtures = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      console.log('Starting fixture scraping from Highland Football League website...');
      toast.info('Scraping fixtures from Highland Football League website... This may take a moment.');
      
      // Call the Supabase Edge function to scrape fixtures
      const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
        body: { url: 'http://www.highlandfootballleague.com/Fixtures/' }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        setError(error.message || 'Failed to fetch fixtures');
        toast.error('Failed to fetch fixtures from Highland Football League website');
        return;
      }
      
      if (!data || !data.success) {
        const errorMessage = data?.error || 'Invalid data received from scraper';
        console.error('Scraper error:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }
      
      const fixtures = data.data;
      
      if (!fixtures || !Array.isArray(fixtures) || fixtures.length === 0) {
        setError('No fixtures found on the Highland Football League website');
        toast.error('No fixtures found');
        return;
      }
      
      console.log('Fixtures fetch successful, proceeding with import...', fixtures);
      
      // Format the data as ScrapedFixture objects
      const formattedFixtures = fixtures.map((item: any): ScrapedFixture => ({
        homeTeam: item.homeTeam,
        awayTeam: item.awayTeam,
        date: item.date,
        time: item.time || '15:00',
        competition: item.competition || 'Highland League',
        venue: item.venue || 'TBD',
        isCompleted: !!item.isCompleted,
        homeScore: item.isCompleted ? item.homeScore : null,
        awayScore: item.isCompleted ? item.awayScore : null
      }));
      
      // Store fixtures
      const success = await scrapeAndStoreFixtures(formattedFixtures);
      
      if (!success) {
        setError('Failed to store fixtures. Check the console for details.');
        toast.error('Failed to store fixtures in database');
        return;
      }
      
      // Get the data to display
      setResults(formattedFixtures);
      setSuccess(true);
      toast.success(`Successfully imported ${formattedFixtures.length} fixtures`);
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportFixtures = () => {
    if (results.length === 0) {
      toast.error('No fixtures to export');
      return;
    }

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `highland-league-fixtures-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Fixtures exported to JSON file');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Highland League Fixtures Importer</CardTitle>
        <CardDescription>
          Fetch fixtures directly from the Highland Football League website
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
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
            <h3 className="font-medium mb-2">Fetched Fixtures:</h3>
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
          onClick={handleFetchFixtures}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Fetching & Storing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Fetch & Store Fixtures
            </>
          )}
        </Button>
        
        {results.length > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleExportFixtures}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to JSON
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
