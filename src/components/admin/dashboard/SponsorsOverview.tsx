
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calendar } from 'lucide-react';

const SponsorsOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Sponsorship</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Building className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">18</span>
            <span className="ml-2 text-sm text-muted-foreground">Active Sponsors</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Platinum</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Gold</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Silver</span>
              <span className="font-medium">6</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Bronze</span>
              <span className="font-medium">4</span>
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>3 renewals due next month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorsOverview;
