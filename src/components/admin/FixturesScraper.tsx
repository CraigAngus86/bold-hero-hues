
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Check, Download, AlertCircle, Info, Link2 } from "lucide-react";
import { scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport'; 
import { toast } from 'sonner';
import { ScrapedFixture } from '@/types/fixtures';
import { supabase } from '@/services/supabase/supabaseClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FixturesScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [htmlSample, setHtmlSample] = useState<string | null>(null);
  const [dataFormatting, setDataFormatting] = useState<string | null>(null);
  const [bbcUrl, setBbcUrl] = useState<string>('https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures');
  
  const handleFetchFromHFL = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      setHtmlSample(null);
      setDataFormatting(null);
      
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
        
        // If we have an HTML sample for debugging, show it
        if (data?.htmlSample) {
          setHtmlSample(data.htmlSample);
          console.log('HTML sample from failed scraping:', data.htmlSample);
        }
        
        toast.error(errorMessage);
        return;
      }
      
      const fixtures = data.data;
      
      if (!fixtures || !Array.isArray(fixtures) || fixtures.length === 0) {
        setError('No fixtures found on the Highland Football League website');
        toast.error('No fixtures found');
        return;
      }
      
      processScrapedFixtures(fixtures, 'Highland Football League');
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchFromBBC = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      setHtmlSample(null);
      setDataFormatting(null);
      
      console.log('Starting fixture scraping from BBC Sport website...');
      toast.info('Scraping fixtures from BBC Sport... This may take a moment.');
      
      // Call the new Supabase Edge function to scrape fixtures from BBC Sport
      const { data, error } = await supabase.functions.invoke('scrape-bbc-fixtures', {
        body: { url: bbcUrl }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        setError(error.message || 'Failed to fetch fixtures from BBC Sport');
        toast.error('Failed to fetch fixtures from BBC Sport');
        return;
      }
      
      if (!data || !data.success) {
        const errorMessage = data?.error || 'Invalid data received from BBC Sport scraper';
        console.error('BBC Scraper error:', errorMessage);
        setError(errorMessage);
        
        // If we have an HTML sample for debugging, show it
        if (data?.htmlSample) {
          setHtmlSample(data.htmlSample);
          console.log('HTML sample from failed BBC scraping:', data.htmlSample);
        }
        
        toast.error(errorMessage);
        return;
      }
      
      const fixtures = data.data;
      
      if (!fixtures || !Array.isArray(fixtures) || fixtures.length === 0) {
        setError('No fixtures found on the BBC Sport website');
        toast.error('No fixtures found on BBC Sport');
        return;
      }
      
      processScrapedFixtures(fixtures, 'BBC Sport');
      
    } catch (error) {
      console.error('Error fetching fixtures from BBC:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures from BBC Sport');
    } finally {
      setIsLoading(false);
    }
  };

  const processScrapedFixtures = (fixtures: any[], source: string) => {
    console.log(`Fixtures fetch successful from ${source}, proceeding with import...`, fixtures);
    
    // Log a sample of the data to check format
    if (fixtures.length > 0) {
      const sample = fixtures[0];
      const formattingInfo = `
Sample fixture data format from ${source}:
- Date: "${sample.date}"
- Time: "${sample.time}"
- Home Team: "${sample.homeTeam}"
- Away Team: "${sample.awayTeam}"
- Competition: "${sample.competition}"
${sample.venue ? `- Venue: "${sample.venue}"` : ''}
${sample.isCompleted ? `- Completed: "${sample.isCompleted}"` : ''}
${sample.homeScore !== undefined ? `- Home Score: "${sample.homeScore}"` : ''}
${sample.awayScore !== undefined ? `- Away Score: "${sample.awayScore}"` : ''}
`;
      setDataFormatting(formattingInfo);
      console.log(formattingInfo);
    }
    
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
    
    // Show a preview of the data before storing
    setResults(formattedFixtures);
  };

  const handleStoreFixtures = async () => {
    if (results.length === 0) {
      toast.error('No fixtures to store');
      return;
    }
    
    try {
      setIsLoading(true);
      toast.info('Storing fixtures in database...');
      
      // Store fixtures
      const success = await scrapeAndStoreFixtures(results);
      
      if (!success) {
        setError('Failed to store fixtures. The data format might be incorrect, or there might be RLS policy issues.');
        toast.error('Failed to store fixtures in database - check console for details');
        return;
      }
      
      setSuccess(true);
      toast.success(`Successfully imported ${results.length} fixtures`);
    } catch (error) {
      console.error('Error storing fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while storing fixtures');
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
          Fetch fixtures from the Highland Football League website or BBC Sport
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="bbc" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="bbc" className="flex-1">BBC Sport</TabsTrigger>
            <TabsTrigger value="hfl" className="flex-1">Highland Football League</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bbc" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bbcUrl">BBC Sport URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="bbcUrl" 
                  value={bbcUrl} 
                  onChange={(e) => setBbcUrl(e.target.value)}
                  placeholder="Enter BBC Sport URL"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => window.open(bbcUrl, '_blank')}
                  title="Open URL in new tab"
                >
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                You can customize the URL to get fixtures for specific months, e.g., https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures/2025-04
              </p>
            </div>
            
            <Button
              className="w-full"
              onClick={handleFetchFromBBC}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Fetching from BBC Sport...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Fetch from BBC Sport
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="hfl" className="space-y-4 mt-4">
            <p className="text-muted-foreground">
              This will fetch fixtures directly from the Highland Football League website.
            </p>
            <Button
              className="w-full"
              onClick={handleFetchFromHFL}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Fetching from HFL...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Fetch from Highland League
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{error}</p>
              {htmlSample && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer">HTML Sample (for debugging)</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded-md overflow-x-auto max-h-40">
                    {htmlSample}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {dataFormatting && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Data Sample</AlertTitle>
            <AlertDescription className="text-blue-700">
              <pre className="text-xs bg-blue-50 p-2 rounded-md overflow-x-auto whitespace-pre-wrap">
                {dataFormatting}
              </pre>
            </AlertDescription>
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
            <h3 className="font-medium mb-2">Fetched Fixtures ({results.length}):</h3>
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
        {results.length > 0 && (
          <>
            <Button
              className="w-full"
              onClick={handleStoreFixtures}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Storing Fixtures...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Store Fixtures in Database
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleExportFixtures}
            >
              <Download className="mr-2 h-4 w-4" />
              Export to JSON
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
