
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Check, Rss, ExternalLink, Database, Globe, Newspaper } from "lucide-react";
import { FirecrawlService, ScrapedFixture } from '@/utils/FirecrawlService';
import { scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport'; 
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FixturesScraper() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [activeMethod, setActiveMethod] = useState<'bbc' | 'rss' | 'firecrawl'>('bbc');
  
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
  
  // Test the connection with the selected method
  const handleTestFetch = async () => {
    try {
      setTestLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      setDebugInfo(null);
      
      console.log(`Testing connection using ${activeMethod} method...`);
      toast.info(`Testing connection to Highland League data source...`);
      
      let result;
      
      // Use the appropriate fetch method based on the active tab
      if (activeMethod === 'bbc') {
        result = await FirecrawlService.fetchBBCSportFixtures();
      } else if (activeMethod === 'rss') {
        result = await FirecrawlService.fetchRSSDirectly();
      } else {
        result = await FirecrawlService.fetchHighlandLeagueFixtures();
      }
      
      if (!result.success || !result.data) {
        const errorMsg = result.error || 'Failed to fetch fixtures';
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
      
      // Get fixtures using the best available method
      const testResult = await FirecrawlService.fetchHighlandLeagueFixtures();
      
      if (!testResult.success || !testResult.data) {
        const errorMsg = testResult.error || 'Failed to fetch fixtures';
        console.error('Fetch failed:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      console.log('Fixtures fetch successful, proceeding with import...');
      
      // Store fixtures
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
          Fetch fixtures from multiple Highland League data sources
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="bbc" onValueChange={(v) => setActiveMethod(v as 'bbc' | 'rss' | 'firecrawl')}>
          <TabsList>
            <TabsTrigger value="bbc">
              <Newspaper className="mr-2 h-4 w-4" />
              BBC Sport
            </TabsTrigger>
            <TabsTrigger value="rss">
              <Globe className="mr-2 h-4 w-4" />
              RSS Feed
            </TabsTrigger>
            <TabsTrigger value="firecrawl">
              <Database className="mr-2 h-4 w-4" />
              Firecrawl API
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bbc" className="space-y-4 pt-4">
            <Alert>
              <Newspaper className="h-4 w-4" />
              <AlertTitle>BBC Sport Data</AlertTitle>
              <AlertDescription>
                This method fetches fixtures from the BBC Sport Highland League page. No API key required.
                It's the most reliable source for current fixtures and results.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="rss" className="space-y-4 pt-4">
            <Alert>
              <Globe className="h-4 w-4" />
              <AlertTitle>Direct RSS Feed Access</AlertTitle>
              <AlertDescription>
                This method fetches directly from the Highland League RSS feed using a CORS proxy. No API key required.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="firecrawl" className="space-y-4 pt-4">
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
          </TabsContent>
        </Tabs>
        
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
            <AccordionTrigger className="text-sm">Troubleshooting</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                <div className="font-medium">Data Fetching Information</div>
                <p className="text-gray-600">
                  This tool now uses three different methods to fetch Highland League data:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li><strong>BBC Sport:</strong> Fetches fixtures from the BBC Sport website (most reliable)</li>
                  <li><strong>RSS Feed:</strong> Fetches directly from the Highland League RSS feed using a CORS proxy</li>
                  <li><strong>Firecrawl API:</strong> Uses Firecrawl as a backup if other methods fail</li>
                </ol>
                <p className="text-gray-600 mt-2">
                  If you're experiencing issues, try the following:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Try each data source using the tabs above</li>
                  <li>Use the "Test Connection" button before attempting to store data</li>
                  <li>Check the browser console for detailed error messages</li>
                  <li>If using Firecrawl, verify that your API key is correct</li>
                  <li>Some methods may be affected by CORS policies or site changes</li>
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
