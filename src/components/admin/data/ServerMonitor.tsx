
import React, { useState, useEffect } from 'react';
import { AlertCircle, Server, CheckCircle2, RefreshCw, ExternalLink, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useServerStatus } from './useServerStatus';
import { ApiConfig } from '@/services/config/apiConfig';
import { toast } from "sonner";
import { triggerLeagueDataScrape, getLastUpdateTime } from '@/services/supabase/leagueDataService';
import { supabase } from '@/services/supabase/supabaseClient';

interface ServerMonitorProps {
  config: ApiConfig;
}

const ServerMonitor: React.FC<ServerMonitorProps> = ({ config }) => {
  const { serverStatus, isStatusChecking, lastUpdated, checkServerStatus } = useServerStatus(config);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [expandedTroubleshooting, setExpandedTroubleshooting] = useState(false);
  const [isScrapingData, setIsScrapingData] = useState(false);
  const [supabaseLastUpdated, setSupabaseLastUpdated] = useState<string | null>(null);
  const [supabaseEnabled, setSupabaseEnabled] = useState<boolean>(!!supabase);

  // Check Supabase last updated time on component mount
  useEffect(() => {
    if (supabaseEnabled) {
      checkSupabaseLastUpdated();
    }
  }, [supabaseEnabled]);

  const checkSupabaseLastUpdated = async () => {
    try {
      const lastUpdate = await getLastUpdateTime();
      if (lastUpdate) {
        setSupabaseLastUpdated(lastUpdate);
      }
    } catch (error) {
      console.error("Error checking Supabase last updated:", error);
    }
  };

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

  const handleTriggerScrape = async () => {
    if (!supabaseEnabled) {
      toast.error("Supabase connection not available");
      return;
    }

    try {
      setIsScrapingData(true);
      toast.info("Scraping Highland League data...");
      await triggerLeagueDataScrape(true);
      toast.success("Highland League data scraped successfully");
      checkSupabaseLastUpdated(); // Update the last updated time
    } catch (error) {
      console.error("Error scraping data:", error);
      toast.error("Failed to scrape data");
    } finally {
      setIsScrapingData(false);
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
          {supabaseEnabled ? (
            <Alert className="bg-green-50 border-green-200">
              <Database className="h-4 w-4 text-green-800" />
              <AlertTitle className="text-green-800">Supabase Integration Active</AlertTitle>
              <AlertDescription className="text-green-700">
                Your app is connected to Supabase for data storage and API functionality. You can scrape the latest Highland League data from BBC Sport.
                {supabaseLastUpdated && (
                  <div className="mt-2 text-sm">
                    <strong>Last Scrape:</strong> {new Date(supabaseLastUpdated).toLocaleString()}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-800" />
              <AlertTitle className="text-amber-800">Supabase Connection Issue</AlertTitle>
              <AlertDescription className="text-amber-700">
                Could not connect to Supabase. Please ensure your Supabase connection is properly configured and environment variables are available.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between">
            <div className="font-medium">Legacy Server Status:</div>
            {renderServerStatus()}
          </div>

          <div className="flex items-center justify-between">
            <div className="font-medium">Server URL:</div>
            <div className="font-mono text-sm">
              {config.apiServerUrl || 'Not configured'}
            </div>
          </div>

          <Alert variant="default" className={supabaseEnabled ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}>
            <AlertCircle className={`h-4 w-4 ${supabaseEnabled ? "text-blue-800" : "text-gray-800"}`} />
            <AlertTitle className={supabaseEnabled ? "text-blue-800" : "text-gray-800"}>Using Supabase for Data</AlertTitle>
            <AlertDescription className={supabaseEnabled ? "text-blue-700" : "text-gray-700"}>
              {supabaseEnabled ? 
                "This application is now using Supabase to store Highland League data. You can manually trigger a data scrape using the button below." :
                "Supabase connection is not available. You need to connect to Supabase to use this feature."}
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <Button 
              onClick={handleTriggerScrape}
              disabled={isScrapingData || !supabaseEnabled}
              className="w-full"
            >
              <Database className={`h-4 w-4 mr-2 ${isScrapingData ? 'animate-pulse' : ''}`} />
              {isScrapingData ? 'Scraping Data...' : 'Scrape Highland League Data Now'}
            </Button>
          </div>

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
            <p>Check legacy data source connection</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default ServerMonitor;
