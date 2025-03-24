
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Check, Database, Rss } from "lucide-react";
import { FirecrawlService, ScrapedFixture } from '@/utils/FirecrawlService';
import { importMockDataToSupabase } from '@/services/supabase/fixturesService'; 
import { toast } from 'sonner';
import { Match } from '@/components/fixtures/types';

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
  
  const handleFetchFixtures = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      
      const result = await FirecrawlService.fetchHighlandLeagueRSS();
      
      if (!result.success || !result.data) {
        setError(result.error || 'Failed to fetch fixtures from RSS feed');
        return;
      }
      
      setResults(result.data);
      setSuccess(true);
      
      // Store the scraped data in Supabase
      // We need to ensure all required fields are present for Match type
      const matchesWithRequiredFields: Match[] = result.data.map((fixture, index) => ({
        id: `temp-${index}`, // temporary id for display, will be replaced by UUID in Supabase
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        date: fixture.date,
        time: fixture.time,
        competition: fixture.competition,
        venue: fixture.venue,
        isCompleted: fixture.isCompleted || false, // Provide default value for required field
        homeScore: fixture.homeScore || null,
        awayScore: fixture.awayScore || null
      }));
      
      const stored = await importMockDataToSupabase(matchesWithRequiredFields);
      if (stored) {
        toast.success(`Successfully imported ${result.data.length} fixtures`);
      }
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Highland League Fixtures Importer</CardTitle>
        <CardDescription>
          Fetch fixtures from the Highland Football League RSS feed
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
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleFetchFixtures}
          disabled={isLoading || !apiKey}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Rss className="mr-2 h-4 w-4" />
              Fetch Fixtures from RSS
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
