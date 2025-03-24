
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Check, Rss, ExternalLink } from "lucide-react";
import { FirecrawlService, ScrapedFixture } from '@/utils/FirecrawlService';
import { scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport'; 
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FixturesScraper() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  
  // Load the API key when the component mounts
  useEffect(() => {
    const savedApiKey = FirecrawlService.getApiKey() || '';
    setApiKey(savedApiKey);
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    FirecrawlService.saveApiKey(apiKey.trim());
    toast.success('API key saved successfully');
  };
  
  // Test the API connection first without storage
  const handleTestFetch = async () => {
    try {
      setTestLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      setDebugInfo(null);
      
      console.log('Testing connection by fetching RSS without storing...');
      toast.info('Testing connection to Highland League RSS feed...');
      
      const result = await FirecrawlService.fetchHighlandLeagueRSS();
      
      if (!result.success || !result.data) {
        const errorMsg = result.error || 'Failed to fetch fixtures from RSS feed';
        console.error('Test fetch failed:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      console.log('Test fetch successful, found', result.data.length, 'fixtures');
      setResults(result.data);
      setSuccess(true);
      toast.success(`Successfully fetched ${result.data.length} fixtures`);
      
    } catch (error) {
      console.error('Error testing fetch:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while testing the connection');
    } finally {
      setTestLoading(false);
    }
  };
  
  const handleFetchFixtures = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      setDebugInfo(null);
      
      console.log('Starting fixture scraping and storage process...');
      toast.info('Scraping fixtures... This may take a moment.');
      
      // First, test the connection by fetching RSS without storing
      const testResult = await FirecrawlService.fetchHighlandLeagueRSS();
      
      if (!testResult.success || !testResult.data) {
        const errorMsg = testResult.error || 'Failed to fetch fixtures from RSS feed';
        console.error('Test fetch failed:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      console.log('Test fetch successful, proceeding with import...');
      
      // If test successful, proceed with storage
      const success = await scrapeAndStoreFixtures();
      
      if (!success) {
        setError('Failed to store fixtures. Check the console for details.');
        toast.error('Failed to store fixtures in database');
        return;
      }
      
      // Get the data to display
      setResults(testResult.data);
      setSuccess(true);
      toast.success(`Successfully imported ${testResult.data.length} fixtures`);
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowFirecrawlDocs = () => {
    window.open('https://docs.firecrawl.dev', '_blank');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Highland League Fixtures Importer</CardTitle>
        <CardDescription>
          Fetch fixtures from the Highland Football League RSS feed using Firecrawl API
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">Firecrawl API Key</Label>
          <div className="flex space-x-2">
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Firecrawl API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={handleSaveApiKey}>Save Key</Button>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Visit <a href="https://app.firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Firecrawl.dev</a> to get an API key.
            <Button variant="ghost" size="sm" className="h-5 px-1" onClick={handleShowFirecrawlDocs}>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <div>{error}</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDebug(!showDebug)} 
                className="mt-2"
              >
                {showDebug ? "Hide Debug Info" : "Show Debug Info"}
              </Button>
              
              {showDebug && debugInfo && (
                <div className="mt-2 p-2 bg-gray-800 text-white rounded text-xs font-mono overflow-auto max-h-48">
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
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

        <Accordion type="single" collapsible className="mt-2">
          <AccordionItem value="api-info">
            <AccordionTrigger className="text-sm">API Troubleshooting</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                <div className="font-medium">Firecrawl API Information</div>
                <p className="text-gray-600">
                  The Firecrawl API is being used to extract data from the Highland League RSS feed.
                  If you're experiencing issues, try the following:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Verify that your API key is correct</li>
                  <li>Check that the Highland League RSS feed is online at <a href="http://www.highlandfootballleague.com/rss/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">this URL</a></li>
                  <li>Try using the "Test Connection" button before attempting to store data</li>
                  <li>Check the browser console for detailed error messages</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
              <Rss className="mr-2 h-4 w-4" />
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
              <Rss className="mr-2 h-4 w-4" />
              Fetch & Store Fixtures
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
