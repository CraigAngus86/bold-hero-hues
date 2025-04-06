
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface WebsiteStatusProps {
  status?: 'online' | 'issues' | 'maintenance';
  uptime?: string;
  lastDeployment?: string;
}

const WebsiteStatus: React.FC<WebsiteStatusProps> = ({
  status = 'online',
  uptime = '99.9%',
  lastDeployment = '3 hours ago'
}) => {
  const getStatusIndicator = () => {
    switch (status) {
      case 'online':
        return (
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-500 font-medium">Online</span>
          </div>
        );
      case 'issues':
        return (
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-amber-500 font-medium">Minor Issues</span>
          </div>
        );
      case 'maintenance':
        return (
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-blue-500 font-medium">Maintenance</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Website Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            {getStatusIndicator()}
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
            <div>Uptime</div>
            <div className="text-right font-medium text-foreground">{uptime}</div>
            <div>Last Deployment</div>
            <div className="text-right font-medium text-foreground">{lastDeployment}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteStatus;
