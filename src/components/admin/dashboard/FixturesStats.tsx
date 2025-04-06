
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { useFixturesStats } from '@/hooks/useFixturesStats';
import { format, parseISO } from 'date-fns';

const FixturesStats: React.FC = () => {
  const { data, isLoading } = useFixturesStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Fixtures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { upcoming, nextMatch } = data || { upcoming: 0, nextMatch: null };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Fixtures</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{upcoming}</span>
            <span className="ml-2 text-sm text-muted-foreground">Scheduled</span>
          </div>
          {nextMatch ? (
            <div className="bg-muted/50 p-2 rounded-md">
              <div className="text-xs font-medium">Next Match</div>
              <div className="text-sm mt-1">{nextMatch.opponent}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {format(parseISO(nextMatch.date), 'PPP')}
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 p-2 rounded-md">
              <div className="text-xs text-muted-foreground">No upcoming matches scheduled</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FixturesStats;
