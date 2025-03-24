
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clearLeagueDataCache } from '@/services/leagueDataService';
import { toast } from "sonner";
import { useApiConfig } from './data/useApiConfig';
import { useServerStatus } from './data/useServerStatus';
import ServerStatusCard from './data/ServerStatusCard';
import ProxySettingsCard from './data/ProxySettingsCard';
import CacheSettingsCard from './data/CacheSettingsCard';
import DataInfoCard from './data/DataInfoCard';
import { triggerLeagueDataScrape } from '@/services/supabase/leagueDataService';

const DataScraperControl = () => {
  const { 
    config, 
    handleConfigChange, 
    handleSwitchChange, 
    saveConfig, 
    resetToDefaults 
  } = useApiConfig();
  
  const { 
    isStatusChecking, 
    serverStatus, 
    lastUpdated, 
    checkServerStatus 
  } = useServerStatus(config);

  const [refreshing, setRefreshing] = React.useState(false);

  // Function to save configuration
  const handleSaveConfig = () => {
    saveConfig();
    clearLeagueDataCache(); // Clear cache to force refresh with new settings
    toast.success("API configuration saved successfully");
    checkServerStatus();
  };

  // Force refresh league data from Supabase
  const handleForceRefresh = async () => {
    try {
      setRefreshing(true);
      toast.info("Refreshing Highland League data from Supabase...");
      
      // Trigger a fresh scrape from the BBC website
      await triggerLeagueDataScrape(true);
      
      // Clear local cache as well
      clearLeagueDataCache();
      
      toast.success("Highland League data refreshed successfully");
      setTimeout(() => {
        window.location.reload(); // Reload the page to show new data
      }, 1500);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error("Failed to refresh Highland League data");
      
      // Clear cache anyway to force reload of data
      clearLeagueDataCache();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="server">
        <TabsList>
          <TabsTrigger value="server">Data Settings</TabsTrigger>
          <TabsTrigger value="proxy">Advanced Settings</TabsTrigger>
          <TabsTrigger value="cache">Cache Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="server" className="space-y-6">
          <ServerStatusCard 
            config={config}
            serverStatus={serverStatus}
            lastUpdated={lastUpdated}
            isStatusChecking={isStatusChecking}
            handleConfigChange={handleConfigChange}
            checkServerStatus={checkServerStatus}
            handleForceRefresh={handleForceRefresh}
          />
        </TabsContent>
        
        <TabsContent value="proxy" className="space-y-6">
          <ProxySettingsCard 
            config={config}
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>
        
        <TabsContent value="cache" className="space-y-6">
          <CacheSettingsCard 
            config={config}
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex space-x-4">
        <Button 
          onClick={handleForceRefresh} 
          className="flex-1"
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh Highland League Data Now"}
        </Button>
        <Button onClick={handleSaveConfig} variant="outline">
          Save Configuration
        </Button>
        <Button onClick={resetToDefaults} variant="outline">
          Reset to Defaults
        </Button>
      </div>
      
      <DataInfoCard />
    </div>
  );
};

export default DataScraperControl;
