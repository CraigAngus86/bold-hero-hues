
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getApiConfig, saveApiConfig, DEFAULT_API_CONFIG } from '@/services/config/apiConfig';
import { toast } from "sonner";

const DataScraperControl = () => {
  const [config, setConfig] = useState(DEFAULT_API_CONFIG);
  const [isStatusChecking, setIsStatusChecking] = useState(false);
  const [serverStatus, setServerStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const loadedConfig = getApiConfig();
    setConfig(loadedConfig);
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
    toast.success("API configuration saved successfully");
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_API_CONFIG);
    toast.info("Reset to default configuration");
  };

  const checkServerStatus = async () => {
    try {
      setIsStatusChecking(true);
      const serverUrl = config.apiServerUrl || 'http://localhost:3001';
      const response = await fetch(`${serverUrl}/api/status`, {
        headers: {
          ...(config.apiKey ? { 'X-API-Key': config.apiKey } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setServerStatus('ok');
      setLastUpdated(data.lastUpdated);
      toast.success("Server connection successful!");
    } catch (error) {
      console.error('Server status check failed:', error);
      setServerStatus('error');
      toast.error("Could not connect to the server");
    } finally {
      setIsStatusChecking(false);
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
              <CardTitle>Node.js Scraper Server</CardTitle>
              <CardDescription>
                Configure the connection to your data scraper server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiServerUrl">Server URL</Label>
                <Input
                  id="apiServerUrl"
                  name="apiServerUrl"
                  value={config.apiServerUrl || ''}
                  onChange={handleConfigChange}
                  placeholder="http://localhost:3001"
                />
                <p className="text-sm text-gray-500">
                  Enter the URL of your Node.js scraper server
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  value={config.apiKey || ''}
                  onChange={handleConfigChange}
                  type="password"
                  placeholder="Enter API key (optional)"
                />
                <p className="text-sm text-gray-500">
                  If your server requires authentication, enter the API key here
                </p>
              </div>
              
              <div className="flex flex-col space-y-4 mt-4">
                <Button 
                  onClick={checkServerStatus} 
                  disabled={isStatusChecking}
                  variant={serverStatus === 'error' ? "destructive" : "outline"}
                >
                  {isStatusChecking ? 'Checking...' : 'Check Server Status'}
                </Button>
                
                {serverStatus === 'ok' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 font-medium">Server is online</p>
                    {lastUpdated && (
                      <p className="text-sm text-green-600">
                        Last data update: {new Date(lastUpdated).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
                
                {serverStatus === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 font-medium">Server is offline</p>
                    <p className="text-sm text-red-600">
                      Unable to connect to the server. Please check the URL and make sure the server is running.
                    </p>
                  </div>
                )}
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
          <CardTitle>Server Installation Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Navigate to the <code className="px-1 py-0.5 bg-gray-100 rounded">server</code> directory in your project.</li>
            <li>Run <code className="px-1 py-0.5 bg-gray-100 rounded">npm install</code> to install dependencies.</li>
            <li>Create a .env file from the example: <code className="px-1 py-0.5 bg-gray-100 rounded">cp .env.example .env</code></li>
            <li>Start the server: <code className="px-1 py-0.5 bg-gray-100 rounded">npm run dev</code> for development or <code className="px-1 py-0.5 bg-gray-100 rounded">npm start</code> for production.</li>
            <li>Enter the server URL above (default: <code className="px-1 py-0.5 bg-gray-100 rounded">http://localhost:3001</code>)</li>
          </ol>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-700 text-sm">
              <strong>Note:</strong> For production, you should deploy this server to a hosting service like 
              Heroku, Vercel, AWS, or Digital Ocean. The server must be running continuously to provide data 
              to your website.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataScraperControl;
