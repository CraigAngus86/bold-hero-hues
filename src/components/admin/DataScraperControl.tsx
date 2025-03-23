
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchLeagueData, clearLeagueDataCache } from '@/services/leagueDataService';
import { scrapeLeagueTable, scrapeFixtures, scrapeResults } from '@/services/highlandLeagueScraper';
import { RefreshCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TeamStats } from '@/components/league/types';
import { Match } from '@/components/fixtures/types';

const DataScraperControl = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [leagueTable, setLeagueTable] = useState<TeamStats[]>([]);
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [results, setResults] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const handleScrapeAll = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const data = await fetchLeagueData();
      
      setLeagueTable(data.leagueTable);
      setFixtures(data.fixtures);
      setResults(data.results);
      
      setSuccess('Successfully fetched all Highland League data!');
    } catch (error) {
      console.error('Error scraping data:', error);
      setError('Failed to scrape data. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = () => {
    clearLeagueDataCache();
    setSuccess('Cache cleared successfully!');
    
    // Clear the success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleScrapeLeagueTable = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const data = await scrapeLeagueTable();
      setLeagueTable(data);
      setSuccess('Successfully fetched league table data!');
    } catch (error) {
      console.error('Error scraping league table:', error);
      setError('Failed to scrape league table. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrapeFixtures = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const data = await scrapeFixtures();
      setFixtures(data);
      setSuccess('Successfully fetched fixtures data!');
    } catch (error) {
      console.error('Error scraping fixtures:', error);
      setError('Failed to scrape fixtures. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrapeResults = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const data = await scrapeResults();
      setResults(data);
      setSuccess('Successfully fetched results data!');
    } catch (error) {
      console.error('Error scraping results:', error);
      setError('Failed to scrape results. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Highland League Data Scraper</CardTitle>
        <CardDescription>
          Fetch and visualize data from the Highland Football League website
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-300">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            onClick={handleScrapeAll} 
            disabled={isLoading}
            className="bg-team-blue hover:bg-team-navy flex items-center"
          >
            {isLoading ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                <span>Scraping...</span>
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                <span>Scrape All Data</span>
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleScrapeLeagueTable}
            disabled={isLoading}
            variant="outline"
          >
            Scrape League Table
          </Button>
          
          <Button 
            onClick={handleScrapeFixtures}
            disabled={isLoading}
            variant="outline"
          >
            Scrape Fixtures
          </Button>
          
          <Button 
            onClick={handleScrapeResults}
            disabled={isLoading}
            variant="outline"
          >
            Scrape Results
          </Button>
          
          <Button 
            onClick={handleClearCache}
            disabled={isLoading}
            variant="ghost"
            className="ml-auto"
          >
            Clear Cache
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Data</TabsTrigger>
            <TabsTrigger value="table">League Table</TabsTrigger>
            <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">League Table</CardTitle>
                </CardHeader>
                <CardContent className="h-64 overflow-y-auto text-xs">
                  {leagueTable.length > 0 ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(leagueTable, null, 2)}</pre>
                  ) : (
                    <p className="text-gray-500">No league table data available</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">Fixtures</CardTitle>
                </CardHeader>
                <CardContent className="h-64 overflow-y-auto text-xs">
                  {fixtures.length > 0 ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(fixtures, null, 2)}</pre>
                  ) : (
                    <p className="text-gray-500">No fixtures data available</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">Results</CardTitle>
                </CardHeader>
                <CardContent className="h-64 overflow-y-auto text-xs">
                  {results.length > 0 ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(results, null, 2)}</pre>
                  ) : (
                    <p className="text-gray-500">No results data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="table">
            <div className="bg-white rounded-md p-4 h-96 overflow-y-auto">
              {leagueTable.length > 0 ? (
                <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(leagueTable, null, 2)}</pre>
              ) : (
                <p className="text-gray-500">No league table data available</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="fixtures">
            <div className="bg-white rounded-md p-4 h-96 overflow-y-auto">
              {fixtures.length > 0 ? (
                <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(fixtures, null, 2)}</pre>
              ) : (
                <p className="text-gray-500">No fixtures data available</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="bg-white rounded-md p-4 h-96 overflow-y-auto">
              {results.length > 0 ? (
                <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(results, null, 2)}</pre>
              ) : (
                <p className="text-gray-500">No results data available</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-sm text-gray-500">
        <p>Note: Due to CORS restrictions, the scraper will not work directly in the browser. A server-side solution is recommended for production use.</p>
      </CardFooter>
    </Card>
  );
};

export default DataScraperControl;
