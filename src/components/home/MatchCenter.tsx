
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Mock data - this would typically come from an API
const upcomingFixtures = [
  {
    id: '1',
    date: '2025-05-10',
    time: '15:00',
    homeTeam: 'Banks o\' Dee',
    awayTeam: 'Formartine United',
    venue: 'Spain Park',
    competition: 'Highland League',
    isTicketsAvailable: true
  },
  {
    id: '2',
    date: '2025-05-17',
    time: '15:00',
    homeTeam: 'Fraserburgh',
    awayTeam: 'Banks o\' Dee',
    venue: 'Bellslea Park',
    competition: 'Highland League Cup',
    isTicketsAvailable: true
  },
  {
    id: '3',
    date: '2025-05-24',
    time: '19:45',
    homeTeam: 'Banks o\' Dee',
    awayTeam: 'Buckie Thistle',
    venue: 'Spain Park',
    competition: 'Highland League',
    isTicketsAvailable: false
  }
];

const recentResults = [
  {
    id: '1',
    date: '2025-05-03',
    homeTeam: 'Banks o\' Dee',
    awayTeam: 'Keith',
    homeScore: 3,
    awayScore: 1,
    competition: 'Highland League',
    hasMatchReport: true
  },
  {
    id: '2',
    date: '2025-04-26',
    homeTeam: 'Rothes',
    awayTeam: 'Banks o\' Dee',
    homeScore: 1,
    awayScore: 2,
    competition: 'Highland League Cup',
    hasMatchReport: true
  },
  {
    id: '3',
    date: '2025-04-19',
    homeTeam: 'Banks o\' Dee',
    awayTeam: 'Brora Rangers',
    homeScore: 0,
    awayScore: 2,
    competition: 'Highland League',
    hasMatchReport: true
  }
];

const formatMatchDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
};

const MatchCenter: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upcoming Fixtures */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-team-blue">Upcoming Fixtures</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/fixtures" className="inline-flex items-center">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {upcomingFixtures.map(fixture => (
                <Card key={fixture.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="bg-team-blue/10 text-team-blue">
                        {fixture.competition}
                      </Badge>
                      <span className="text-sm font-medium text-gray-500">
                        {formatMatchDate(fixture.date)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-right flex-1">
                        <p className={cn(
                          "font-semibold",
                          fixture.homeTeam === 'Banks o\' Dee' ? "text-team-blue" : "text-gray-800"
                        )}>
                          {fixture.homeTeam}
                        </p>
                      </div>
                      
                      <div className="px-4 text-center">
                        <span className="bg-gray-100 px-3 py-1 rounded-md font-medium text-gray-600">VS</span>
                      </div>
                      
                      <div className="text-left flex-1">
                        <p className={cn(
                          "font-semibold",
                          fixture.awayTeam === 'Banks o\' Dee' ? "text-team-blue" : "text-gray-800"
                        )}>
                          {fixture.awayTeam}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{fixture.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{fixture.venue}</span>
                      </div>
                      {fixture.isTicketsAvailable && (
                        <Link 
                          to={`/tickets/${fixture.id}`}
                          className="text-team-blue hover:underline font-medium"
                        >
                          Tickets Available
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Recent Results */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-team-blue">Recent Results</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/results" className="inline-flex items-center">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentResults.map(result => {
                const isBanksWin = 
                  (result.homeTeam === 'Banks o\' Dee' && result.homeScore > result.awayScore) || 
                  (result.awayTeam === 'Banks o\' Dee' && result.awayScore > result.homeScore);
                const isDraw = result.homeScore === result.awayScore;
                
                return (
                  <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-team-blue/10 text-team-blue">
                          {result.competition}
                        </Badge>
                        <span className="text-sm font-medium text-gray-500">
                          {formatMatchDate(result.date)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-right flex-1">
                          <p className={cn(
                            "font-semibold",
                            result.homeTeam === 'Banks o\' Dee' ? "text-team-blue" : "text-gray-800"
                          )}>
                            {result.homeTeam}
                          </p>
                        </div>
                        
                        <div className={cn(
                          "px-6 py-1 rounded-md font-bold mx-2",
                          isBanksWin ? "bg-green-100 text-green-800" : 
                          isDraw ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                        )}>
                          {result.homeScore} - {result.awayScore}
                        </div>
                        
                        <div className="text-left flex-1">
                          <p className={cn(
                            "font-semibold",
                            result.awayTeam === 'Banks o\' Dee' ? "text-team-blue" : "text-gray-800"
                          )}>
                            {result.awayTeam}
                          </p>
                        </div>
                      </div>
                      
                      {result.hasMatchReport && (
                        <div className="mt-4 text-right">
                          <Link 
                            to={`/match-report/${result.id}`}
                            className="text-team-blue hover:underline text-sm font-medium inline-flex items-center"
                          >
                            Match Report <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatchCenter;
