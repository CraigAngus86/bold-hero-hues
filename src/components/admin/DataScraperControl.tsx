
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw, AlertTriangle, Server, Info, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { triggerLeagueDataScrape, getLastUpdateTime } from '@/services/supabase/leagueDataService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from '@/integrations/supabase/client';

const DataScraperControl = () => {
  const [isScrapingData, setIsScrapingData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<'checking' | 'deployed' | 'not-deployed' | 'unknown'>('checking');

  // Load last update time on component mount and check Edge Function status
  useEffect(() => {
    checkLastUpdated();
    checkEdgeFunctionStatus();
  }, []);

  const checkLastUpdated = async () => {
    try {
      const lastUpdate = await getLastUpdateTime();
      if (lastUpdate) {
        setLastUpdated(lastUpdate);
        setHasError(false);
        setErrorDetails(null);
      }
    } catch (error) {
      console.error("Error checking last updated:", error);
      setHasError(true);
      setErrorDetails("Failed to fetch last update time");
    }
  };

  // Check if the Edge Function exists by attempting to invoke it with a status check
  const checkEdgeFunctionStatus = async () => {
    try {
      setEdgeFunctionStatus('checking');
      
      // Try to invoke the function with a status check parameter
      // This approach avoids using the listFunctions method which isn't available
      const { data, error } = await supabase.functions.invoke('scrape-highland-league', {
        body: { action: 'status-check' }
      });
      
      if (error) {
        // If we get a 404 error, the function doesn't exist
        if (error.message && error.message.includes('404')) {
          console.log('Edge Function not found (404 error)');
          setEdgeFunctionStatus('not-deployed');
          return;
        }
        
        // For other errors, the function might exist but has an issue
        console.warn('Edge Function exists but returned an error:', error);
        setEdgeFunctionStatus('deployed');
        return;
      }
      
      // If we get a response, the function exists
      console.log('Edge Function status check response:', data);
      setEdgeFunctionStatus('deployed');
      
    } catch (error) {
      console.error('Error checking Edge Function status:', error);
      
      // If we can't connect, we can't determine the status
      setEdgeFunctionStatus('unknown');
    }
  };

  // Force refresh league data
  const handleForceRefresh = async () => {
    try {
      setIsScrapingData(true);
      setHasError(false);
      toast.info("Refreshing Highland League data...");
      
      try {
        // Trigger a fresh scrape
        await triggerLeagueDataScrape(true);
        
        // Check for the updated time
        await checkLastUpdated();
        
        // Reload the page after a short delay to show new data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error: any) {
        console.error('Failed to refresh data:', error);
        setHasError(true);
        setErrorDetails(error?.message || "Unknown error occurred");
        toast.error("Failed to refresh Highland League data");
      }
    } finally {
      setIsScrapingData(false);
    }
  };

  // Render function deployment status
  const renderEdgeFunctionStatus = () => {
    switch (edgeFunctionStatus) {
      case 'deployed':
        return (
          <div className="flex items-center gap-2 text-green-700">
            <Badge variant="outline" className="bg-green-100">Deployed</Badge>
            <span className="text-sm">Edge Function is deployed and ready</span>
          </div>
        );
      case 'not-deployed':
        return (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Edge Function Not Deployed</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                The scrape-highland-league Edge Function is not deployed to your Supabase project. 
                Please visit your Supabase Dashboard to deploy the function.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2"
                onClick={() => window.open('https://supabase.com/dashboard/project/bbbxhwaixjjxgboeiktq/functions', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Supabase Functions
              </Button>
            </AlertDescription>
          </Alert>
        );
      case 'checking':
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Checking Edge Function status...</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <Badge variant="outline" className="bg-yellow-100">Unknown</Badge>
            <span className="text-sm">Could not determine Edge Function status</span>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Highland League Data Scraper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasError ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Scraper Connection Issue</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                There was an error connecting to the Supabase Edge Function for data scraping. 
                {errorDetails && <span className="font-mono text-xs block mt-1">{errorDetails}</span>}
              </p>
              <p className="mb-2">The system will automatically fall back to:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Try to use data from Supabase if available</li>
                <li>Try the local server if running</li>
                <li>Use mock data as a last resort</li>
              </ol>
              <p className="mt-2">Click the refresh button to try again.</p>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="bg-green-50 border-green-200 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div className="text-green-800 font-medium">Supabase Data Scraper</div>
              <Badge variant="outline" className="bg-green-100">Ready</Badge>
            </div>
            
            {lastUpdated && (
              <p className="text-sm text-green-700 mt-2">
                Last data update: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
            
            <p className="text-sm text-green-700 mt-2">
              This tool automatically scrapes Highland League data from BBC Sport 
              and stores it in your Supabase database.
            </p>
          </div>
        )}

        {/* Edge Function Status */}
        <div className="border-t pt-4">
          <div className="font-medium mb-2">Edge Function Status:</div>
          {renderEdgeFunctionStatus()}
        </div>
        
        <div className="flex flex-col gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleForceRefresh} 
                  disabled={isScrapingData || edgeFunctionStatus === 'not-deployed'}
                  className="w-full"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isScrapingData ? 'animate-spin' : ''}`} />
                  {isScrapingData ? 'Scraping Data...' : 'Scrape Highland League Data Now'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Scrapes fresh data from BBC Sport</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {hasError && (
            <Button 
              variant="outline" 
              onClick={() => window.open('http://localhost:3001/api/status', '_blank')}
              className="w-full"
            >
              <Server className="h-4 w-4 mr-2" />
              Check Local Server Status
            </Button>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground mt-2">
          <p className="flex items-center">
            <Info className="h-4 w-4 mr-1 inline" />
            Data is automatically scraped daily, but you can manually refresh it anytime.
          </p>
          {hasError && (
            <p className="text-amber-600 mt-1">
              Note: If you're running locally, make sure the Node.js server in the server/ folder is running.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataScraperControl;
