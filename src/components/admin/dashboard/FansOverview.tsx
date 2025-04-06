
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare } from 'lucide-react';

const FansOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Fan Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">843</span>
            <span className="ml-2 text-sm text-muted-foreground">Community</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Subscribers</span>
              <span className="font-medium">682</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Messages</span>
              <div className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1 text-blue-400" />
                <span className="font-medium">347</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FansOverview;
