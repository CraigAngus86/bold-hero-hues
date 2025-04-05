
import React from 'react';
import { toast } from "sonner";
import ServerMonitor from './ServerMonitor';
import CacheSettingsCard from './CacheSettingsCard';
import ProxySettingsCard from './ProxySettingsCard';
import ScrapedDataTable from './ScrapedDataTable';
import DataValidator from './DataValidator';
import { useApiConfig } from './useApiConfig';
import { clearLeagueDataCache } from '@/services/leagueDataService';
import { Button } from "@/components/ui/button";

const DataDashboard = () => {
  const { config, handleConfigChange, handleSwitchChange, saveConfig } = useApiConfig();
  
  const handleClearCache = () => {
    clearLeagueDataCache();
    toast.success('Cache cleared successfully');
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <ServerMonitor config={config} />
        <CacheSettingsCard 
          config={config}
          handleConfigChange={handleConfigChange}
          handleSwitchChange={handleSwitchChange}
          onClearCache={handleClearCache}
        />
      </div>
      
      <div className="mb-6">
        <ProxySettingsCard 
          config={config} 
          handleConfigChange={handleConfigChange}
          handleSwitchChange={handleSwitchChange}
        />
      </div>
      
      <DataValidator />
      
      <ScrapedDataTable />
    </div>
  );
};

export default DataDashboard;
