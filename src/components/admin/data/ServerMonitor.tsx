
import React, { useState } from 'react';
import { AlertCircle, Server, CheckCircle2, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useServerStatus } from './useServerStatus';
import { ApiConfig } from '@/services/config/apiConfig';
import { toast } from "sonner";

interface ServerMonitorProps {
  config: ApiConfig;
}

const ServerMonitor: React.FC<ServerMonitorProps> = ({ config }) => {
  const { serverStatus, isStatusChecking, lastUpdated, checkServerStatus } = useServerStatus(config);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [expandedTroubleshooting, setExpandedTroubleshooting] = useState(false);

  const handleCheckStatus = async () => {
    try {
      setLastError(null);
      await checkServerStatus();
      toast.success("Server status check complete");
    } catch (error) {
      console.error("Error checking server status:", error);
      setLastError(error instanceof Error ? error : new Error('Unknown error'));
      toast.error("Failed to check server status");
    }
  };

  const renderServerStatus = () => {
    switch (serverStatus) {
      case 'ok':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>Connected</span>
            {lastUpdated && (
              <Badge variant="outline" className="ml-2">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </Badge>
            )}
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>Error connecting to server</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-yellow-500">
            <Server className="h-5 w-5" />
            <span>Status unknown</span>
          </div>
        );
    }
  };

  const troubleshootingSteps = [
    {
      title: "Using Public API Services",
      description: "For real-time data in Lovable, try using a public Highland League API service such as a sports data provider. Enter their URL in the Server URL field below."
    },
    {
      title: "Try these public sports APIs",
      description: "The following sites offer football data APIs that may include Highland League: football-data.org, api-football.com, or sportmonks.com"
    },
    {
      title: "Using mock data",
      description: "If you can't connect to a real API, the application will automatically use built-in mock data which still provides a great demonstration experience."
    },
    {
      title: "Check API key",
      description: config.apiKey ? "API key is configured." : "Most sports APIs require an API key. After signing up with a service, enter your API key in the field below."
    },
    {
      title: "CORS issues",
      description: "If you're trying to use a public API but seeing errors, the API may have CORS restrictions. Consider using a CORS proxy service or contact the API provider."
    }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Server className="h-5 w-5" />
          Data Source Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="text-blue-800">Using Lovable's Website Builder</AlertTitle>
            <AlertDescription className="text-blue-700">
              Since you're using Lovable, you have two options for data:
              <ul className="mt-2 list-disc list-inside">
                <li>Connect to a public Highland League API service (enter URL below)</li>
                <li>Continue using the built-in mock data (no configuration needed)</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div className="font-medium">Status:</div>
            {renderServerStatus()}
          </div>

          <div className="flex items-center justify-between">
            <div className="font-medium">Server URL:</div>
            <div className="font-mono text-sm">
              {config.apiServerUrl || 'Not configured'}
            </div>
          </div>

          {serverStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Failed</AlertTitle>
              <AlertDescription>
                Could not connect to the data source. Using mock data instead. See the options below.
              </AlertDescription>
            </Alert>
          )}

          <Accordion
            type="single" 
            collapsible
            value={expandedTroubleshooting ? "troubleshooting" : ""}
            onValueChange={(val) => setExpandedTroubleshooting(val === "troubleshooting")}
          >
            <AccordionItem value="troubleshooting">
              <AccordionTrigger>Data Source Options</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  {troubleshootingSteps.map((step, index) => (
                    <div key={index} className="border-b pb-2 last:border-0">
                      <div className="font-medium">{index + 1}. {step.title}</div>
                      <div className="text-muted-foreground mt-1">{step.description}</div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://rapidapi.com/search/football', '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Find Football APIs on RapidAPI
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 flex justify-end gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCheckStatus}
              disabled={isStatusChecking}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isStatusChecking ? 'animate-spin' : ''}`} />
              {isStatusChecking ? 'Checking...' : 'Check Connection'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Check data source connection</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default ServerMonitor;
