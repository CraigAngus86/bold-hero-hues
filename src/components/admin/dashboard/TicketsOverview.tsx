
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, CreditCard } from 'lucide-react';

const TicketsOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Ticket Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Ticket className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">235</span>
            <span className="ml-2 text-sm text-muted-foreground">This Month</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Season</span>
              <span className="font-medium">158</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Match</span>
              <span className="font-medium">77</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Revenue</span>
              <div className="flex items-center">
                <CreditCard className="h-3 w-3 mr-1 text-green-500" />
                <span className="font-medium">£4,325</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Online</span>
              <span className="font-medium">72%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketsOverview;
