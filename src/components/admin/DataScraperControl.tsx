import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  fetchLeagueData, 
  clearLeagueDataCache, 
  getApiConfig, 
  saveApiConfig, 
  ApiConfig,
  exportAllData,
  importDataFromJson 
} from '@/services/leagueDataService';
import { scrapeLeagueTable, scrapeFixtures, scrapeResults } from '@/services/highlandLeagueScraper';
import { RefreshCcw, AlertCircle, CheckCircle2, Download, Upload, Settings, Database } from 'lucide-react';
import { TeamStats } from '@/components/league/types';
import { Match } from '@/components/fixtures/types';
import { toast } from "sonner";

const DataScraperControl = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [leagueTable, setLeagueTable] = useState<TeamStats[]>([]);
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [results, setResults] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [apiConfig, setApiConfig] = useState<ApiConfig>(getApiConfig());
  const [useBbcProxy, setUseBbcProxy] = useState<boolean>(false);
  const [bbcScraperStatus, setBbcScraperStatus] = useState<string | null>(null);

  useEffect(() => {
    setApiConfig(getApiConfig());
  }, []);

  const handleSaveConfig = () => {
    saveApiConfig(apiConfig);
    toast.success('API configuration saved');
    setSuccess('Configuration saved successfully');
    
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleScrapeAll = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const data = await fetchLeagueData(true);
      setLeagueTable(data.leagueTable);
      setFixtures(data.fixtures);
      setResults(data.results);
      
      setSuccess('Successfully fetched all Highland League data!');
      toast.success('Data scraped and updated successfully');
    } catch (error) {
      console.error('Error scraping data:', error);
      setError('Failed to scrape data. Check console for details.');
      toast.error('Failed to scrape data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = () => {
    clearLeagueDataCache();
    setSuccess('Cache cleared successfully!');
    toast.success('Cache cleared successfully');
    
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleScrapeLeagueTable = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setBbcScraperStatus("Starting BBC Sport scraper...");
    
    try {
      const data = await scrapeLeagueTable(useBbcProxy);
      setLeagueTable(data);
      setSuccess('Successfully fetched league table data!');
      setBbcScraperStatus(`Successfully fetched data for ${data.length} teams from BBC Sport`);
      toast.success('League table data updated');
    } catch (error) {
      console.error('Error scraping league table:', error);
      setError('Failed to scrape league table. Check console for details.');
      setBbcScraperStatus(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Failed to scrape league table');
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
      toast.success('Fixtures data updated');
    } catch (error) {
      console.error('Error scraping fixtures:', error);
      setError('Failed to scrape fixtures. Check console for details.');
      toast.error('Failed to scrape fixtures');
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
      toast.success('Results data updated');
    } catch (error) {
      console.error('Error scraping results:', error);
      setError('Failed to scrape results. Check console for details.');
      toast.error('Failed to scrape results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const jsonData = exportAllData();
      const dataBlob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `banks-o-dee-data-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const success = importDataFromJson(jsonString);
        
        if (success) {
          toast.success('Data imported successfully');
          setSuccess('Data imported successfully! Refreshing...');
          
          setTimeout(() => {
            handleScrapeAll();
          }, 1000);
        } else {
          toast.error('Failed to import data: Invalid format');
          setError('Failed to import data: Invalid format');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        toast.error('Failed to import data');
        setError('Failed to import data. Check console for details.');
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <Card className="w-full">
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Data View</TabsTrigger>
            <TabsTrigger value="controls">Scraper Controls</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
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
                onClick={handleExportData}
                disabled={isLoading}
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              
              <div className="relative">
                <Button 
                  onClick={() => document.getElementById('import-file')?.click()}
                  disabled={isLoading}
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
                <input 
                  id="import-file" 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={handleImportData}
                />
              </div>
              
              <Button 
                onClick={handleClearCache}
                disabled={isLoading}
                variant="ghost"
                className="ml-auto"
              >
                Clear Cache
              </Button>
            </div>
            
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
          
          <TabsContent value="controls">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">BBC Sport League Table</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-500 mb-4">Scrape the current Highland League table from BBC Sport</p>
                    
                    {bbcScraperStatus && (
                      <div className={`text-xs mb-3 p-2 rounded ${bbcScraperStatus.includes('Failed') ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
                        {bbcScraperStatus}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch 
                        id="use-bbc-proxy"
                        checked={useBbcProxy}
                        onCheckedChange={setUseBbcProxy}
                      />
                      <Label htmlFor="use-bbc-proxy" className="text-xs">
                        Use proxy for BBC Sport
                      </Label>
                    </div>
                    
                    <Button 
                      onClick={handleScrapeLeagueTable}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Scrape BBC League Table
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Fixtures</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-500 mb-4">Scrape upcoming fixture information</p>
                    <Button 
                      onClick={handleScrapeFixtures}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Scrape Fixtures
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Results</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-500 mb-4">Scrape recent match results</p>
                    <Button 
                      onClick={handleScrapeResults}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Scrape Results
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Scheduled Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Auto-refresh data</p>
                        <p className="text-xs text-gray-500">Automatically update data every {apiConfig.refreshInterval} minutes</p>
                      </div>
                      <Switch 
                        checked={apiConfig.autoRefresh}
                        onCheckedChange={(checked) => setApiConfig({...apiConfig, autoRefresh: checked})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="refresh-interval" className="text-sm">Refresh interval (minutes)</Label>
                        <span className="text-sm">{apiConfig.refreshInterval} min</span>
                      </div>
                      <Slider 
                        id="refresh-interval"
                        min={15} 
                        max={1440} 
                        step={15} 
                        value={[apiConfig.refreshInterval]} 
                        onValueChange={(value) => setApiConfig({...apiConfig, refreshInterval: value[0]})}
                        disabled={!apiConfig.autoRefresh}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>15m</span>
                        <span>6h</span>
                        <span>12h</span>
                        <span>24h</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Scraper Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Use local storage</p>
                      <p className="text-xs text-gray-500">Cache scraped data to local storage</p>
                    </div>
                    <Switch 
                      checked={apiConfig.useLocalStorage}
                      onCheckedChange={(checked) => setApiConfig({...apiConfig, useLocalStorage: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Use proxy server</p>
                      <p className="text-xs text-gray-500">Route requests through a proxy to avoid CORS issues</p>
                    </div>
                    <Switch 
                      checked={apiConfig.useProxy}
                      onCheckedChange={(checked) => setApiConfig({...apiConfig, useProxy: checked})}
                    />
                  </div>
                  
                  {apiConfig.useProxy && (
                    <div className="space-y-2">
                      <Label htmlFor="proxy-url" className="text-sm">Proxy URL</Label>
                      <Input 
                        id="proxy-url"
                        placeholder="https://your-proxy-server.com/api/scrape"
                        value={apiConfig.proxyUrl || ''}
                        onChange={(e) => setApiConfig({...apiConfig, proxyUrl: e.target.value})}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key" className="text-sm">API Key (optional)</Label>
                    <Input 
                      id="api-key"
                      placeholder="Enter API key if required"
                      value={apiConfig.apiKey || ''}
                      onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                      type="password"
                    />
                    <p className="text-xs text-gray-500">Used for authentication with proxy services</p>
                  </div>
                  
                  <Button onClick={handleSaveConfig} className="w-full">
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Data Storage Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Configure how data is stored and retrieved. For production use, we recommend:
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <h3 className="text-sm font-medium mb-2">Recommended Setup</h3>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc ml-4">
                      <li>Set up a Firebase or Supabase backend for data storage</li>
                      <li>Create a server-side API to handle scraping requests</li>
                      <li>Configure scheduled tasks to update data automatically</li>
                      <li>Implement proper authentication for admin access</li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center">
                    <Button variant="outline" className="flex-1">Connect Database</Button>
                    <span className="px-4 text-gray-500">or</span>
                    <Button variant="outline" className="flex-1">Setup API Connection</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-sm text-gray-500">
        <p>Note: Due to CORS restrictions, the scraper may not work directly in the browser. A server-side solution is recommended for production use.</p>
      </CardFooter>
    </Card>
  );
};

export default DataScraperControl;
