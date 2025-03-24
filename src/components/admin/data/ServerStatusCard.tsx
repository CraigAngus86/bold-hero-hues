
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiConfig } from '@/services/config/apiConfig';
import { Badge } from "@/components/ui/badge";

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
          Configure and manage the Highland League data service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
          <p className="text-amber-800 font-medium">Server Connection Guide</p>
          <p className="text-sm text-amber-700 mb-2">
            For real data, you need to run the Node.js scraper server included in the project:
          </p>
          <ol className="list-decimal list-inside text-sm text-amber-700 space-y-1">
            <li>Open terminal in the 'server' directory</li>
            <li>Run 'npm install' to install dependencies</li>
            <li>Run 'npm start' to start the server</li>
            <li>Server should be available at http://localhost:3001</li>
          </ol>
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
              <div className="flex justify-between items-center">
                <p className="text-green-700 font-medium">Server is online</p>
                <Badge variant="success">Live Data</Badge>
              </div>
              {lastUpdated && (
                <p className="text-sm text-green-600 mt-1">
                  Last data update: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          ) : serverStatus === 'error' ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex justify-between items-center">
                <p className="text-amber-700 font-medium">Server connection failed</p>
                <Badge variant="outline">Mock Data</Badge>
              </div>
              <p className="text-sm text-amber-600 mt-1">
                Unable to connect to the scraper server. Please check if the server is running.
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
            
            <Button 
              onClick={checkServerStatus} 
              disabled={isStatusChecking}
              variant="outline"
            >
              Check Server Status
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 pt-4">
          <Label htmlFor="apiServerUrl">Server URL</Label>
          <Input
            id="apiServerUrl"
            name="apiServerUrl"
            value={config.apiServerUrl || ''}
            onChange={handleConfigChange}
            placeholder="http://localhost:3001"
          />
          <p className="text-sm text-gray-500">
            The URL of your Highland League scraper server (default: http://localhost:3001)
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
