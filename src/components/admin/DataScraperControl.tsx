
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, RefreshCw, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  scrapeHighlandLeagueData,
  scrapeLeagueTable,
  scrapeFixtures,
  scrapeResults
} from '@/services/highlandLeagueScraper';
import { getApiConfig, saveApiConfig, DEFAULT_API_CONFIG } from '@/services/config/apiConfig';

const DataScraperControl = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [apiConfig, setApiConfig] = useState(getApiConfig());
  
  const handleConfigChange = (field: keyof typeof DEFAULT_API_CONFIG, value: any) => {
    const updatedConfig = { ...apiConfig, [field]: value };
    setApiConfig(updatedConfig);
    saveApiConfig(updatedConfig);
    
    toast({
      title: "Settings updated",
      description: `API configuration has been updated.`,
    });
  };
  
  const refreshData = async (dataType: 'all' | 'table' | 'fixtures' | 'results') => {
    setLoading(true);
    
    try {
      let result;
      
      switch (dataType) {
        case 'all':
          result = await scrapeHighlandLeagueData();
          toast({
            title: "Data refreshed",
            description: "All Highland League data has been updated.",
          });
          break;
        case 'table':
          result = await scrapeLeagueTable();
          toast({
            title: "League table refreshed",
            description: "Highland League table has been updated.",
          });
          break;
        case 'fixtures':
          result = await scrapeFixtures();
          toast({
            title: "Fixtures refreshed",
            description: "Highland League fixtures have been updated.",
          });
          break;
        case 'results':
          result = await scrapeResults();
          toast({
            title: "Results refreshed",
            description: "Highland League results have been updated.",
          });
          break;
      }
      
      console.log(`Refreshed ${dataType} data:`, result);
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh data. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Data Scraper & API Settings</h3>
        <p className="text-sm text-gray-500">
          Configure how the application retrieves Highland League data and refresh data manually.
        </p>
      </div>
      
      <Separator />
      
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure how data is fetched and stored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Use Local Storage</Label>
              <p className="text-sm text-gray-500">
                Cache data locally to reduce API calls
              </p>
            </div>
            <Switch
              checked={apiConfig.useLocalStorage}
              onCheckedChange={(checked) => handleConfigChange('useLocalStorage', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Refresh</Label>
              <p className="text-sm text-gray-500">
                Periodically refresh data
              </p>
            </div>
            <Switch
              checked={apiConfig.autoRefresh}
              onCheckedChange={(checked) => handleConfigChange('autoRefresh', checked)}
            />
          </div>
          
          {apiConfig.autoRefresh && (
            <div className="grid gap-2">
              <Label htmlFor="refreshInterval">Refresh Interval (minutes)</Label>
              <Input
                id="refreshInterval"
                type="number"
                min="5"
                value={apiConfig.refreshInterval}
                onChange={(e) => handleConfigChange('refreshInterval', Number(e.target.value))}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Use Proxy</Label>
              <p className="text-sm text-gray-500">
                Use a proxy server for API requests (recommended for production to avoid CORS issues)
              </p>
            </div>
            <Switch
              checked={apiConfig.useProxy}
              onCheckedChange={(checked) => handleConfigChange('useProxy', checked)}
            />
          </div>
          
          {apiConfig.useProxy && (
            <div className="grid gap-2">
              <Label htmlFor="proxyUrl">Proxy URL</Label>
              <Input
                id="proxyUrl"
                type="url"
                placeholder="https://proxy.example.com"
                value={apiConfig.proxyUrl || ''}
                onChange={(e) => handleConfigChange('proxyUrl', e.target.value)}
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key (if required)</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter API key"
              value={apiConfig.apiKey || ''}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
            />
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start">
              <Globe className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Data Source Information</h4>
                <p className="text-xs text-amber-700 mt-1">
                  League table data is scraped from <a href="https://www.bbc.com/sport/football/scottish-highland-league/table" className="underline" target="_blank" rel="noopener noreferrer">BBC Sport</a>. 
                  In a production environment, you should implement a server-side solution with a proper CORS proxy to avoid browser limitations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Manual Refresh */}
      <Card>
        <CardHeader>
          <CardTitle>Refresh Data</CardTitle>
          <CardDescription>
            Manually refresh Highland League data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Data is automatically refreshed based on your settings, but you can manually trigger 
            an update using the buttons below.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => refreshData('table')}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh Table
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => refreshData('fixtures')}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh Fixtures
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => refreshData('results')}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh Results
            </Button>
            <Button
              className="w-full"
              disabled={loading}
              onClick={() => refreshData('all')}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh All Data
            </Button>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 bg-gray-50">
          <p className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DataScraperControl;
