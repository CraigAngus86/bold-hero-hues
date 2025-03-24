
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiConfig } from '@/services/config/apiConfig';

interface ServerStatusCardProps {
  config: ApiConfig;
  serverStatus: 'unknown' | 'ok' | 'error';
  lastUpdated: string | null;
  isStatusChecking: boolean;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checkServerStatus: () => void;
  handleForceRefresh: () => void;
}

const ServerStatusCard: React.FC<ServerStatusCardProps> = ({
  config,
  serverStatus,
  lastUpdated,
  isStatusChecking,
  handleConfigChange,
  checkServerStatus,
  handleForceRefresh
}) => {
  return (
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
                onClick={checkServerStatus} 
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
  );
};

export default ServerStatusCard;
