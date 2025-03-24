
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ApiConfig } from '@/services/config/apiConfig';

interface ProxySettingsCardProps {
  config: ApiConfig;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const ProxySettingsCard: React.FC<ProxySettingsCardProps> = ({
  config,
  handleConfigChange,
  handleSwitchChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proxy Settings</CardTitle>
        <CardDescription>
          Configure proxy settings for fetching data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="useProxy"
            checked={config.useProxy}
            onCheckedChange={(checked) => handleSwitchChange('useProxy', checked)}
          />
          <Label htmlFor="useProxy">Use Proxy</Label>
        </div>
        
        {config.useProxy && (
          <div className="space-y-2">
            <Label htmlFor="proxyUrl">Proxy URL</Label>
            <Input
              id="proxyUrl"
              name="proxyUrl"
              value={config.proxyUrl || ''}
              onChange={handleConfigChange}
              placeholder="https://your-proxy-url.com/"
            />
            <p className="text-sm text-gray-500">
              Enter the full proxy URL including the protocol (http/https)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProxySettingsCard;
