
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ApiConfig } from '@/services/config/apiConfig';

interface CacheSettingsCardProps {
  config: ApiConfig;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const CacheSettingsCard: React.FC<CacheSettingsCardProps> = ({
  config,
  handleConfigChange,
  handleSwitchChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cache Settings</CardTitle>
        <CardDescription>
          Configure caching options for league data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="useLocalStorage"
            checked={config.useLocalStorage}
            onCheckedChange={(checked) => handleSwitchChange('useLocalStorage', checked)}
          />
          <Label htmlFor="useLocalStorage">Use Local Storage</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="autoRefresh"
            checked={config.autoRefresh}
            onCheckedChange={(checked) => handleSwitchChange('autoRefresh', checked)}
          />
          <Label htmlFor="autoRefresh">Auto Refresh</Label>
        </div>
        
        {config.autoRefresh && (
          <div className="space-y-2">
            <Label htmlFor="refreshInterval">Refresh Interval (minutes)</Label>
            <Input
              id="refreshInterval"
              name="refreshInterval"
              type="number"
              min="5"
              value={config.refreshInterval}
              onChange={handleConfigChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CacheSettingsCard;
