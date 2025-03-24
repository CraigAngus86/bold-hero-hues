
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getApiConfig, saveApiConfig, DEFAULT_API_CONFIG, ApiConfig } from '@/services/config/apiConfig';
import { toast } from "sonner";
import { clearLeagueDataCache } from '@/services/leagueDataService';

const DataScraperControl = () => {
  // Fix the TypeScript error by making sure config state has the required apiServerUrl
  const [config, setConfig] = useState<ApiConfig>({
    ...DEFAULT_API_CONFIG,
    apiServerUrl: DEFAULT_API_CONFIG.apiServerUrl || 'http://localhost:3001'
  });
  
  const [isStatusChecking, setIsStatusChecking] = useState(false);
  const [serverStatus, setServerStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [autoConnecting, setAutoConnecting] = useState(true);

  // On initial load, set up the server configuration and auto-connect
  useEffect(() => {
    // Load existing config
    const loadedConfig = getApiConfig();
    
    // Merge with default server URL if needed
    const configWithServer = {
      ...loadedConfig,
      apiServerUrl: loadedConfig.apiServerUrl || 'http://localhost:3001'
    };
    
    setConfig(configWithServer);
    
    // Auto-save the configuration
    saveApiConfig(configWithServer);
    
    // Auto-check server status
    setAutoConnecting(true);
    checkServerStatus(configWithServer);
    
    // Try to load data directly from the mock data
    if (!loadedConfig.apiServerUrl) {
      toast.info("Using mock data since no server is configured");
      clearLeagueDataCache(); // Force refresh with mock data
    }
    
    // Set up periodic server checks
    const interval = setInterval(() => {
      if (config.apiServerUrl) { // Only check if a server URL is configured
        checkServerStatus(configWithServer);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setConfig({
      ...config,
      [name]: checked
    });
  };

  const handleSaveConfig = () => {
    saveApiConfig(config);
    clearLeagueDataCache(); // Clear cache to force refresh with new settings
    toast.success("API configuration saved successfully");
    checkServerStatus();
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_API_CONFIG);
    toast.info("Reset to default configuration");
  };

  const checkServerStatus = async (configToUse = config) => {
    try {
      setIsStatusChecking(true);
      
      // If no server URL is configured, don't try to connect
      if (!configToUse.apiServerUrl) {
        setServerStatus('error');
        setIsStatusChecking(false);
        if (autoConnecting) {
          setAutoConnecting(false);
          toast.info("No server configured. Using mock data instead.");
        }
        return;
      }
      
      const serverUrl = configToUse.apiServerUrl;
      
      // Use AbortController to set a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${serverUrl}/api/status`, {
        headers: {
          ...(configToUse.apiKey ? { 'X-API-Key': configToUse.apiKey } : {})
        },
        signal: controller.signal,
        mode: 'cors' // Explicitly enable CORS
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setServerStatus('ok');
      setLastUpdated(data.lastUpdated);
      
      if (autoConnecting) {
        setAutoConnecting(false);
        toast.success("Connected to Highland League data server");
        // Force refresh the league data
        clearLeagueDataCache();
      }
    } catch (error) {
      console.error('Server status check failed:', error);
      setServerStatus('error');
      
      if (autoConnecting) {
        setAutoConnecting(false);
        toast.info("Could not connect to the Highland League server. Using mock data instead.");
      }
    } finally {
      setIsStatusChecking(false);
    }
  };

  // Function to force refresh league data
  const handleForceRefresh = async () => {
    try {
      toast.info("Refreshing Highland League data...");
      
      if (config.apiServerUrl && serverStatus === 'ok') {
        // If server is configured and online, refresh from server
        const serverUrl = config.apiServerUrl;
        
        await fetch(`${serverUrl}/api/league-table?refresh=true`, {
          headers: {
            ...(config.apiKey ? { 'X-API-Key': config.apiKey } : {})
          },
          mode: 'cors'
        });
      }
      
      // Clear local cache in any case
      clearLeagueDataCache();
      
      toast.success("Highland League data refreshed successfully");
      setTimeout(() => {
        window.location.reload(); // Reload the page to show new data
      }, 1500);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error("Failed to refresh Highland League data");
      
      // Clear cache anyway to force reload of mock data
      clearLeagueDataCache();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="server">
        <TabsList>
          <TabsTrigger value="server">Server Settings</TabsTrigger>
          <TabsTrigger value="proxy">Proxy Settings</TabsTrigger>
          <TabsTrigger value="cache">Cache Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="server" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Highland League Data Status</CardTitle>
              <CardDescription>
                Current status of the Highland League data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
                <p className="text-amber-800 font-medium">Important Note</p>
                <p className="text-sm text-amber-700">
                  You don't need to run a server - the app works with mock data by default. 
                  Server settings are only needed if you want to use real scraped data.
                </p>
              </div>
            
              <div className="flex flex-col space-y-4">
                {isStatusChecking ? (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-team-blue mr-3"></div>
                      <p className="text-gray-700">Checking server status...</p>
                    </div>
                  </div>
                ) : serverStatus === 'ok' ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 font-medium">Server is online</p>
                    {lastUpdated && (
                      <p className="text-sm text-green-600">
                        Last data update: {new Date(lastUpdated).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : serverStatus === 'error' ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-amber-700 font-medium">Using mock data</p>
                    <p className="text-sm text-amber-600">
                      The app is using mock data for the league table.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-gray-700">Server status unknown</p>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleForceRefresh} 
                    disabled={isStatusChecking}
                    variant="default"
                  >
                    Refresh League Data
                  </Button>
                  
                  {config.apiServerUrl && (
                    <Button 
                      onClick={() => checkServerStatus()} 
                      disabled={isStatusChecking}
                      variant="outline"
                    >
                      Check Server Status
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="apiServerUrl">Server URL (Optional)</Label>
                <Input
                  id="apiServerUrl"
                  name="apiServerUrl"
                  value={config.apiServerUrl || ''}
                  onChange={handleConfigChange}
                  placeholder="Leave empty to use mock data"
                />
                <p className="text-sm text-gray-500">
                  If you have a Highland League scraper server running, enter its URL here
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key (Optional)</Label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  value={config.apiKey || ''}
                  onChange={handleConfigChange}
                  type="password"
                  placeholder="Enter API key if required"
                />
                <p className="text-sm text-gray-500">
                  Only needed if your server requires authentication
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="proxy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proxy Settings</CardTitle>
              <CardDescription>
                Configure proxy settings for fetching data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="useProxy"
                  checked={config.useProxy}
                  onCheckedChange={(checked) => handleSwitchChange('useProxy', checked)}
                />
                <Label htmlFor="useProxy">Use Proxy</Label>
              </div>
              
              {config.useProxy && (
                <div className="space-y-2">
                  <Label htmlFor="proxyUrl">Proxy URL</Label>
                  <Input
                    id="proxyUrl"
                    name="proxyUrl"
                    value={config.proxyUrl || ''}
                    onChange={handleConfigChange}
                    placeholder="https://your-proxy-url.com/"
                  />
                  <p className="text-sm text-gray-500">
                    Enter the full proxy URL including the protocol (http/https)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cache" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cache Settings</CardTitle>
              <CardDescription>
                Configure caching options for league data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="useLocalStorage"
                  checked={config.useLocalStorage}
                  onCheckedChange={(checked) => handleSwitchChange('useLocalStorage', checked)}
                />
                <Label htmlFor="useLocalStorage">Use Local Storage</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoRefresh"
                  checked={config.autoRefresh}
                  onCheckedChange={(checked) => handleSwitchChange('autoRefresh', checked)}
                />
                <Label htmlFor="autoRefresh">Auto Refresh</Label>
              </div>
              
              {config.autoRefresh && (
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Refresh Interval (minutes)</Label>
                  <Input
                    id="refreshInterval"
                    name="refreshInterval"
                    type="number"
                    min="5"
                    value={config.refreshInterval}
                    onChange={handleConfigChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex space-x-4">
        <Button onClick={handleSaveConfig} className="flex-1">
          Save Configuration
        </Button>
        <Button onClick={handleResetDefaults} variant="outline">
          Reset to Defaults
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700 font-medium">How the data works</p>
            <p className="text-sm text-blue-600 mt-1">
              By default, the app uses mock data for the league table. This data is refreshed when you click the 
              "Refresh League Data" button.
            </p>
            <p className="text-sm text-blue-600 mt-2">
              For technical users: You can set up a server to scrape real-time data from the BBC Sport Highland League 
              page. The server settings are optional and only needed if you want to use real scraped data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataScraperControl;
