
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw, AlertTriangle, Server, Info } from "lucide-react";
import { toast } from "sonner";
import { triggerLeagueDataScrape, getLastUpdateTime } from '@/services/supabase/leagueDataService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DataScraperControl = () => {
  const [isScrapingData, setIsScrapingData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Load last update time on component mount
  useEffect(() => {
    checkLastUpdated();
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
        
        <div className="flex flex-col gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleForceRefresh} 
                  disabled={isScrapingData}
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
