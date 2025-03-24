
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { triggerLeagueDataScrape, getLastUpdateTime } from '@/services/supabase/leagueDataService';

const DataScraperControl = () => {
  const [isScrapingData, setIsScrapingData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load last update time on component mount
  React.useEffect(() => {
    checkLastUpdated();
  }, []);

  const checkLastUpdated = async () => {
    try {
      const lastUpdate = await getLastUpdateTime();
      if (lastUpdate) {
        setLastUpdated(lastUpdate);
      }
    } catch (error) {
      console.error("Error checking last updated:", error);
    }
  };

  // Force refresh league data from Supabase
  const handleForceRefresh = async () => {
    try {
      setIsScrapingData(true);
      toast.info("Refreshing Highland League data from BBC Sport...");
      
      // Trigger a fresh scrape from the BBC website
      await triggerLeagueDataScrape(true);
      
      // Check for the updated time
      await checkLastUpdated();
      
      toast.success("Highland League data refreshed successfully");
      
      // Reload the page after a short delay to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error("Failed to refresh Highland League data");
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
        <div className="bg-green-50 border-green-200 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div className="text-green-800 font-medium">Supabase Data Scraper</div>
            <Badge variant="outline" className="bg-green-100">Active</Badge>
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
        
        <div className="flex justify-center">
          <Button 
            onClick={handleForceRefresh} 
            disabled={isScrapingData}
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScrapingData ? 'animate-spin' : ''}`} />
            {isScrapingData ? 'Scraping Data...' : 'Scrape Highland League Data Now'}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground mt-2">
          <p>The data will be automatically scraped daily, but you can manually refresh it anytime.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataScraperControl;
