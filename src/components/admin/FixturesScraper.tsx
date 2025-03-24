
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Check, Download, AlertCircle, Info, Link2, Database } from "lucide-react";
import { scrapeAndStoreFixtures } from '@/services/supabase/fixtures/importExport'; 
import { toast } from 'sonner';
import { ScrapedFixture } from '@/types/fixtures';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/services/supabase/supabaseClient';

export default function FixturesScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScrapedFixture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [htmlSample, setHtmlSample] = useState<string | null>(null);
  const [dataFormatting, setDataFormatting] = useState<string | null>(null);
  const [bbcUrl, setBbcUrl] = useState<string>(
    'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures'
  );
  const [hflUrl, setHflUrl] = useState<string>(
    'http://www.highlandfootballleague.com/Fixtures/'
  );
  
  const handleFetchFromBBC = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      setHtmlSample(null);
      setDataFormatting(null);
      
      console.log('Starting fixture scraping from BBC Sport...');
      toast.info('Scraping fixtures from BBC Sport... This may take a moment.');
      
      // Call the Supabase edge function to scrape BBC Sport data
      const { data, error } = await supabase.functions.invoke('scrape-bbc-fixtures', {
        body: { url: bbcUrl }
      });
      
      if (error || !data.success) {
        const errorMessage = error ? error.message : (data?.error || 'Failed to fetch fixtures from BBC Sport');
        console.error('BBC scraper error:', errorMessage);
        setError(errorMessage);
        
        // If we have an HTML sample for debugging, show it
        if (data?.htmlSample) {
          setHtmlSample(data.htmlSample);
          console.log('HTML sample from failed scraping:', data.htmlSample);
        }
        
        toast.error(errorMessage);
        return;
      }
      
      if (!data.data || data.data.length === 0) {
        setError('No fixtures found on the BBC Sport website');
        
        // If we have an HTML sample for debugging, show it
        if (data.htmlSample) {
          setHtmlSample(data.htmlSample);
          console.log('HTML sample from failed scraping:', data.htmlSample);
        }
        
        toast.error('No fixtures found');
        return;
      }
      
      processScrapedFixtures(data.data, 'BBC Sport');
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFetchFromHFL = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      setHtmlSample(null);
      setDataFormatting(null);
      
      console.log('Starting fixture scraping from Highland Football League...');
      toast.info('Scraping fixtures from Highland Football League... This may take a moment.');
      
      // Call the Supabase edge function to scrape HFL data
      const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
        body: { url: hflUrl }
      });
      
      if (error || !data.success) {
        const errorMessage = error ? error.message : (data?.error || 'Failed to fetch fixtures from Highland Football League');
        console.error('HFL scraper error:', errorMessage);
        setError(errorMessage);
        
        // If we have an HTML sample for debugging, show it
        if (data?.htmlSample) {
          setHtmlSample(data.htmlSample);
          console.log('HTML sample from failed scraping:', data.htmlSample);
        }
        
        toast.error(errorMessage);
        return;
      }
      
      if (!data.data || data.data.length === 0) {
        setError('No fixtures found on the Highland Football League website');
        
        // If we have an HTML sample for debugging, show it
        if (data.htmlSample) {
          setHtmlSample(data.htmlSample);
          console.log('HTML sample from failed scraping:', data.htmlSample);
        }
        
        toast.error('No fixtures found');
        return;
      }
      
      processScrapedFixtures(data.data, 'Highland Football League');
      
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while fetching fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMockData = () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      setResults([]);
      setHtmlSample(null);
      setDataFormatting(null);
      
      console.log('Generating mock fixture data...');
      
      // Generate mock fixtures directly
      const mockFixtures = generateMockFixtures();
      
      processScrapedFixtures(mockFixtures, 'Mock Data');
      
      toast.success(`Generated ${mockFixtures.length} mock fixtures`);
    } catch (error) {
      console.error('Error generating mock fixtures:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error('An error occurred while generating mock fixtures');
    } finally {
      setIsLoading(false);
    }
  };

  const processScrapedFixtures = (fixtures: ScrapedFixture[], source: string) => {
    console.log(`Fixtures fetch successful from ${source}, proceeding with import...`, fixtures);
    
    // Log a sample of the data to check format
    if (fixtures.length > 0) {
      const sample = fixtures[0];
      const formattingInfo = `
Sample fixture data format from ${source}:
- ID: "${sample.id || 'Not provided'}"
- Date: "${sample.date}"
- Time: "${sample.time}"
- Home Team: "${sample.homeTeam}"
- Away Team: "${sample.awayTeam}"
- Competition: "${sample.competition}"
${sample.venue ? `- Venue: "${sample.venue}"` : ''}
${sample.isCompleted !== undefined ? `- Completed: "${sample.isCompleted}"` : ''}
${sample.homeScore !== undefined ? `- Home Score: "${sample.homeScore}"` : ''}
${sample.awayScore !== undefined ? `- Away Score: "${sample.awayScore}"` : ''}
`;
      setDataFormatting(formattingInfo);
      console.log(formattingInfo);
    }
    
    // Format the data as ScrapedFixture objects, ensuring each fixture has an ID
    const formattedFixtures = fixtures.map((item: any): ScrapedFixture => ({
      id: item.id || `fixture-${Math.random().toString(36).substring(2, 9)}`,
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
    setSuccess(true);
    toast.success(`Found ${formattedFixtures.length} fixtures from ${source}`);
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
    const exportFileDefaultName = `banks-o-dee-fixtures-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Fixtures exported to JSON file');
  };
  
  // Generate mock fixtures function moved directly to this component
  const generateMockFixtures = (): ScrapedFixture[] => {
    const teams = [
      'Banks O\' Dee FC', 'Brechin City FC', 'Buckie Thistle FC', 'Clachnacuddin FC',
      'Deveronvale FC', 'Formartine Utd FC', 'Forres Mechanics FC', 'Fraserburgh FC',
      'Huntly FC', 'Inverurie Loco Works FC', 'Keith FC', 'Lossiemouth FC',
      'Nairn County FC', 'Rothes FC', 'Strathspey Thistle FC', 'Turriff Utd FC', 'Wick Academy FC'
    ];
    
    const venues = ['Spain Park', 'Glebe Park', 'Victoria Park', 'Grant Street Park', 'Princess Royal Park'];
    
    // Current date
    const startDate = new Date();
    const fixtures: ScrapedFixture[] = [];
    
    // Generate 20 fixtures (10 upcoming, 10 completed)
    for (let i = 0; i < 20; i++) {
      const isCompleted = i < 10;
      const fixtureDate = new Date(startDate);
      
      if (isCompleted) {
        // Completed matches in the past
        fixtureDate.setDate(fixtureDate.getDate() - (i + 1));
      } else {
        // Upcoming matches in the future
        fixtureDate.setDate(fixtureDate.getDate() + (i - 9));
      }
      
      // Format date as YYYY-MM-DD
      const dateStr = fixtureDate.toISOString().split('T')[0];
      
      // Randomly select teams (ensuring they are different)
      let homeTeamIndex = Math.floor(Math.random() * teams.length);
      let awayTeamIndex;
      do {
        awayTeamIndex = Math.floor(Math.random() * teams.length);
      } while (awayTeamIndex === homeTeamIndex);
      
      // Ensure Banks O' Dee is in every fixture
      const isBanksHome = Math.random() > 0.5;
      if (isBanksHome) {
        homeTeamIndex = 0; // Banks O' Dee is the first team in the array
      } else {
        awayTeamIndex = 0;
      }
      
      // Generate random scores for completed matches
      let homeScore = null;
      let awayScore = null;
      if (isCompleted) {
        homeScore = Math.floor(Math.random() * 4);
        awayScore = Math.floor(Math.random() * 4);
      }
      
      // Pick a random venue or use Spain Park for home games
      const venue = isBanksHome ? "Spain Park" : venues[Math.floor(Math.random() * venues.length)];
      
      // Generate a truly unique ID for each fixture
      const uniqueId = `mock-${dateStr}-${teams[homeTeamIndex].substring(0, 3)}-${teams[awayTeamIndex].substring(0, 3)}-${Date.now()}-${i}`;
      
      fixtures.push({
        id: uniqueId,
        homeTeam: teams[homeTeamIndex],
        awayTeam: teams[awayTeamIndex],
        date: dateStr,
        time: '15:00',
        competition: 'Highland League',
        venue,
        isCompleted,
        homeScore,
        awayScore
      });
    }
    
    return fixtures;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fixtures Importer</CardTitle>
        <CardDescription>
          Fetch and import fixtures from Highland League sources
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="bbc" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="bbc">BBC Sport</TabsTrigger>
            <TabsTrigger value="hfl">Highland League</TabsTrigger>
            <TabsTrigger value="mock">Mock Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bbc" className="space-y-4">
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
                The default URL fetches fixtures for the Highland League from BBC Sport.
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
            
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">About BBC Sport Scraping</AlertTitle>
              <AlertDescription className="text-blue-700">
                This feature uses Supabase Edge Functions to scrape fixture data from BBC Sport.
                The edge function runs on Supabase's servers, which helps avoid CORS issues.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="hfl" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hflUrl">Highland Football League URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="hflUrl" 
                  value={hflUrl} 
                  onChange={(e) => setHflUrl(e.target.value)}
                  placeholder="Enter Highland Football League URL"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => window.open(hflUrl, '_blank')}
                  title="Open URL in new tab"
                >
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The default URL fetches fixtures from the official Highland Football League website.
              </p>
            </div>
            
            <Button
              className="w-full"
              onClick={handleFetchFromHFL}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Fetching from Highland League...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Fetch from Highland League
                </>
              )}
            </Button>
            
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">About Highland League Scraping</AlertTitle>
              <AlertDescription className="text-blue-700">
                This feature uses Supabase Edge Functions to scrape fixture data from the Highland Football League website.
                Data quality may vary based on the website's structure.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="mock" className="space-y-4">
            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Mock Data</AlertTitle>
              <AlertDescription className="text-amber-700">
                If external scraping fails, you can generate random mock fixtures for testing purposes.
                These fixtures will include both upcoming and past matches for Banks O' Dee FC.
              </AlertDescription>
            </Alert>
            
            <Button
              className="w-full"
              onClick={handleUseMockData}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Database className="mr-2 h-4 w-4 animate-pulse" />
                  Generating Mock Data...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Generate Mock Fixtures
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
                  <Database className="mr-2 h-4 w-4" />
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
