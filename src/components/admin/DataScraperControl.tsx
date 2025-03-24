
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

  // Function to save configuration
  const handleSaveConfig = () => {
    saveConfig();
    clearLeagueDataCache(); // Clear cache to force refresh with new settings
    toast.success("API configuration saved successfully");
    checkServerStatus();
  };

  // Force refresh league data
  const handleForceRefresh = async () => {
    try {
      toast.info("Refreshing Highland League data...");
      
      if (config.apiServerUrl && serverStatus === 'ok') {
        // If server is configured and online, refresh from server
        const serverUrl = config.apiServerUrl;
        
        await fetch(`${serverUrl}/api/league-table?refresh=true`, {
          headers: {
            ...(config.apiKey ? { 'X-API-Key': config.apiKey } : {})
          },
          mode: 'cors'
        });
      }
      
      // Clear local cache in any case
      clearLeagueDataCache();
      
      toast.success("Highland League data refreshed successfully");
      setTimeout(() => {
        window.location.reload(); // Reload the page to show new data
      }, 1500);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error("Failed to refresh Highland League data");
      
      // Clear cache anyway to force reload of mock data
      clearLeagueDataCache();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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
        <Button onClick={handleSaveConfig} className="flex-1">
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
