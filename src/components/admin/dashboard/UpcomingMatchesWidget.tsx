
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data - in a real app, this would be fetched from an API
const upcomingMatches = [
  {
    id: '1',
    homeTeam: 'Banks o\' Dee FC',
    awayTeam: 'Formartine United',
    competition: 'Highland League',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    location: 'Spain Park',
    ticketsSold: 150
  },
  {
    id: '2',
    homeTeam: 'Buckie Thistle',
    awayTeam: 'Banks o\' Dee FC',
    competition: 'Highland League',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    location: 'Victoria Park',
    ticketsSold: 85
  },
  {
    id: '3',
    homeTeam: 'Banks o\' Dee FC',
    awayTeam: 'Keith',
    competition: 'Scottish Cup',
    date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
    location: 'Spain Park',
    ticketsSold: 210
  }
];

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const UpcomingMatchesWidget = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Upcoming Matches</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {upcomingMatches.map((match) => (
            <div key={match.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {match.competition}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {formatDate(match.date)}
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium">{match.homeTeam}</div>
                  <div className="text-sm font-medium">{match.awayTeam}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{match.location}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {match.ticketsSold} tickets sold
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-3 border-t">
          <button className="text-blue-500 font-medium text-sm w-full text-center hover:underline">
            View All Fixtures
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMatchesWidget;
