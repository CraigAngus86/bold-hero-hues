
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Check, Database } from "lucide-react";
import { FirecrawlService, ScrapedFixture } from '@/utils/FirecrawlService';
import { importMockDataToSupabase, scrapeAndStoreFixtures } from '@/services/supabase/fixturesService';
import { toast } from 'sonner';

export default function FixturesScraper() {
  const [apiKey, setApiKey] = useState(FirecrawlService.getApiKey() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    FirecrawlService.saveApiKey(apiKey.trim());
    toast.success('API key saved successfully');
  };
  
  const handleScrapeFixtures = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      const result = await FirecrawlService.scrapeHighlandLeagueFixtures();
      
      if (!result.success || !result.data) {
        setError(result.error || 'Failed to scrape fixtures');
        return;
      }
      
      setResults(result.data);
      setSuccess(true);
      
      // Store the scraped data in Supabase
      const stored = await importMockDataToSupabase(result.data);
      if (stored) {
        toast.success(`Successfully imported ${result.data.length} fixtures`);
      }
      
    } catch (error) {
      console.error('Error scraping fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Highland League Fixtures Scraper</CardTitle>
        <CardDescription>
          Scrape fixtures from the Highland Football League website
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
        </div>
        
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
              Successfully scraped {results.length} fixtures
            </AlertDescription>
          </Alert>
        )}
        
        {results.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Scraped Fixtures:</h3>
            <div className="max-h-60 overflow-y-auto border rounded-md p-4">
              {results.map((fixture, index) => (
                <div key={index} className="mb-2 text-sm">
                  {fixture.date} {fixture.time}: {fixture.homeTeam} vs {fixture.awayTeam}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleScrapeFixtures}
          disabled={isLoading || !apiKey}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Scrape Fixtures
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
