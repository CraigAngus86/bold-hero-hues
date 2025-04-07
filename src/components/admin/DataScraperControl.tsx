
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw, AlertTriangle, Server, Info, ExternalLink, Bug, FileDown } from "lucide-react";
import { toast } from "sonner";
import { triggerLeagueDataScrape, getLastUpdateTime } from '@/services/supabase/leagueDataService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from '@/integrations/supabase/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { unwrapPromise } from '@/lib/supabaseHelpers';

const DataScraperControl = () => {
  const [isScrapingData, setIsScrapingData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<'checking' | 'deployed' | 'not-deployed' | 'unknown'>('checking');
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

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

  const checkEdgeFunctionStatus = async () => {
    try {
      setEdgeFunctionStatus('checking');
      
      const response = await unwrapPromise(
        supabase.functions.invoke('scrape-highland-league', {
          body: { action: 'status-check' }
        })
      );
      
      if (response.error) {
        if (response.error.message && response.error.message.includes('404')) {
          console.log('Edge Function not found (404 error)');
          setEdgeFunctionStatus('not-deployed');
          return;
        }
        
        console.warn('Edge Function exists but returned an error:', response.error);
        setEdgeFunctionStatus('deployed');
        return;
      }
      
      console.log('Edge Function status check response:', response.data);
      setEdgeFunctionStatus('deployed');
      
    } catch (error) {
      console.error('Error checking Edge Function status:', error);
      
      setEdgeFunctionStatus('unknown');
    }
  };

  const handleForceRefresh = async () => {
    try {
      setIsScrapingData(true);
      setHasError(false);
      setScrapeError(null);
      toast.info("Refreshing Highland League data...");
      
      try {
        // Fix: Remove the boolean parameter as it seems to be causing the issue
        const result = await triggerLeagueDataScrape();
        
        // Safely check result structure
        if (result && Array.isArray(result) && result.length > 0) {
          toast.success(`Successfully refreshed data for ${result.length} teams`);
        } else {
          toast.warning("Data refresh completed, but no teams were found");
        }
        
        await checkLastUpdated();
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error: any) {
        console.error('Failed to refresh data:', error);
        setHasError(true);
        
        let errorMessage = error?.message || "Unknown error occurred";
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error === 'object' && error.value && error.value.message) {
          errorMessage = error.value.message;
        }
        
        setErrorDetails(errorMessage);
        setScrapeError(errorMessage);
        toast.error("Failed to refresh Highland League data");
      }
    } finally {
      setIsScrapingData(false);
    }
  };

  const handleDownloadData = async () => {
    try {
      const response = await unwrapPromise(
        supabase
          .from('highland_league_table')
          .select('*')
          .order('position', { ascending: true })
      );
      
      if (response.error) {
        throw response.error;
      }
      
      const data = response.data;
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        toast.warning("No data available to download");
        return;
      }
      
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `highland-league-table-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Downloaded league data successfully");
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error("Failed to download league data");
    }
  };

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
                There was an error while scraping the Highland League data. 
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

        <div className="border-t pt-4">
          <div className="font-medium mb-2">Edge Function Status:</div>
          {renderEdgeFunctionStatus()}
        </div>
        
        {scrapeError && (
          <Alert variant="destructive" className="mt-4">
            <Bug className="h-4 w-4" />
            <AlertTitle>Scraping Error</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{scrapeError}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                className="mt-1"
              >
                {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
              </Button>
              
              {showDebugInfo && (
                <Accordion type="single" collapsible className="mt-2">
                  <AccordionItem value="debugging">
                    <AccordionTrigger>Debugging Information</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-xs">
                        <p><strong>Possible Causes:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>BBC Sport may have changed their website structure</li>
                          <li>Network connectivity issues from the Edge Function</li>
                          <li>The BBC Sport website might be blocking requests from Supabase IP addresses</li>
                          <li>Rate limiting or temporary BBC Sport outage</li>
                        </ul>
                        
                        <p className="mt-3"><strong>Troubleshooting Steps:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Check the Edge Function logs for detailed error information</li>
                          <li>Verify if the BBC Sport website structure has changed</li>
                          <li>Try running the scraper again later</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </AlertDescription>
          </Alert>
        )}
        
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
          
          <Button 
            variant="outline" 
            onClick={handleDownloadData}
            className="w-full"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Download Current League Data
          </Button>
          
          {edgeFunctionStatus === 'deployed' && (
            <Button 
              variant="outline" 
              onClick={() => window.open('https://supabase.com/dashboard/project/bbbxhwaixjjxgboeiktq/functions/scrape-highland-league/logs', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Edge Function Logs
            </Button>
          )}
          
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
