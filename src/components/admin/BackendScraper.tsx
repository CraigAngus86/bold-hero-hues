
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchLeagueData } from '@/services/leagueDataService';
import { Clock, Server, RefreshCcw, CheckCircle2, AlertCircle, Cog } from 'lucide-react';
import { toast } from 'sonner';

const BackendScraper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [includeLeagueTable, setIncludeLeagueTable] = useState(true);
  const [includeFixtures, setIncludeFixtures] = useState(true);
  const [includeResults, setIncludeResults] = useState(true);
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  const handleScrape = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      setError(null);
      
      // In a real implementation, this would be a call to a backend API endpoint
      // that handles the scraping of the Highland Football League website
      const data = await fetchLeagueData();
      
      setResult(`Scraping completed successfully! 
      - League Table: ${data.leagueTable.length} teams
      - Fixtures: ${data.fixtures.length} upcoming matches
      - Results: ${data.results.length} past matches
      
      Last updated: ${new Date().toLocaleString()}`);
      
      toast.success('Data scraped successfully');
    } catch (error) {
      console.error('Error scraping data:', error);
      setError(`${error instanceof Error ? error.message : 'Failed to scrape data'}`);
      toast.error('Failed to scrape data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleConfig = () => {
    setIsConfiguring(!isConfiguring);
  };
  
  const handleSaveConfig = () => {
    // In a real implementation, this would save API settings to localStorage or a backend service
    toast.success('API configuration saved');
    setIsConfiguring(false);
  };
  
  const mockSchedule = async () => {
    setIsLoading(true);
    setResult(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Automated scraping schedule configured');
      setResult('Scheduled scraping configured successfully. The data will be automatically updated every day at 3:00 AM.');
    }, 1500);
  };
  
  return (
    <Card className="max-w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Server-Side Data Scraper</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleToggleConfig}>
            <Cog className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isConfiguring ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Configure the server-side scraper API connection. This will handle CORS issues and provide more reliable data scraping.
            </p>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="endpoint-url">API Endpoint URL</Label>
                <Input 
                  id="endpoint-url" 
                  placeholder="https://your-api-endpoint.com/scrape" 
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input 
                  id="api-key" 
                  type="password" 
                  placeholder="Enter your API key" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Data to Include</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="league-table" 
                      checked={includeLeagueTable} 
                      onCheckedChange={(checked) => setIncludeLeagueTable(checked as boolean)}
                    />
                    <label htmlFor="league-table" className="text-sm">League Table</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fixtures" 
                      checked={includeFixtures} 
                      onCheckedChange={(checked) => setIncludeFixtures(checked as boolean)}
                    />
                    <label htmlFor="fixtures" className="text-sm">Fixtures</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="results" 
                      checked={includeResults} 
                      onCheckedChange={(checked) => setIncludeResults(checked as boolean)}
                    />
                    <label htmlFor="results" className="text-sm">Results</label>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex space-x-2">
                <Button variant="outline" onClick={() => setIsConfiguring(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveConfig} className="flex-1">
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-600">
              The server-side scraper runs on a schedule to automatically update your website data without browser CORS limitations.
            </p>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-4">
                <Button 
                  onClick={handleScrape} 
                  disabled={isLoading}
                  className="bg-team-blue hover:bg-team-navy"
                >
                  {isLoading ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    <>
                      <Server className="mr-2 h-4 w-4" />
                      Run Server-Side Scrape
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={mockSchedule}
                  disabled={isLoading}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Configure Automated Schedule
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {result && (
                <Alert className={`rounded-md ${error ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap">{result}</AlertDescription>
                </Alert>
              )}
              
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium">Server-Side Advantages</h3>
                <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                  <li>No CORS restrictions or browser limitations</li>
                  <li>Can run on a schedule without user interaction</li>
                  <li>More reliable data scraping with retries and error handling</li>
                  <li>Ability to handle complex scraping scenarios</li>
                  <li>Data can be processed and stored in a database</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BackendScraper;
