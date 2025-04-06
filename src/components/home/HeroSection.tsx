
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { TeamStats, Fixture } from '@/types';

// Mock fixture data
const mockFixtures = [
  {
    id: '1',
    date: '2025-04-15',
    time: '15:00',
    homeTeam: 'Banks O\' Dee',
    awayTeam: 'Fraserburgh',
    competition: 'Highland League',
    venue: 'Spain Park',
    isCompleted: false,
  },
  {
    id: '2',
    date: '2025-04-22',
    time: '15:00',
    homeTeam: 'Buckie Thistle',
    awayTeam: 'Banks O\' Dee',
    competition: 'Highland League',
    venue: 'Victoria Park',
    isCompleted: false,
  }
];

// Mock league standings
const mockStandings = [
  {
    id: '1',
    team: 'Buckie Thistle',
    position: 1,
    played: 32,
    won: 25,
    drawn: 5,
    lost: 2,
    goalsFor: 78,
    goalsAgainst: 25,
    goalDifference: 53,
    points: 80,
  },
  {
    id: '2',
    team: 'Brechin City',
    position: 2,
    played: 32,
    won: 24,
    drawn: 4,
    lost: 4,
    goalsFor: 75,
    goalsAgainst: 30,
    goalDifference: 45,
    points: 76,
  },
  {
    id: '3',
    team: 'Banks O\' Dee',
    position: 3,
    played: 32,
    won: 20,
    drawn: 7,
    lost: 5,
    goalsFor: 67,
    goalsAgainst: 32,
    goalDifference: 35,
    points: 67,
  }
];

const HeroSection = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standings, setStandings] = useState<TeamStats[]>([]);
  const [nextFixture, setNextFixture] = useState<Fixture | null>(null);
  const [teamPosition, setTeamPosition] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a delay
    const fetchData = async () => {
      setTimeout(() => {
        setFixtures(mockFixtures);
        setStandings(mockStandings);
        
        // Find next fixture and team position in the standings
        const nextGame = mockFixtures.find(fixture => !fixture.isCompleted);
        setNextFixture(nextGame || null);
        
        const teamStats = mockStandings.find(team => team.team === 'Banks O\' Dee');
        setTeamPosition(teamStats || null);
        
        setLoading(false);
      }, 500);
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[500px] bg-gradient-to-r from-blue-900 to-blue-800 animate-pulse rounded-lg"></div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Banks O' Dee FC</h1>
            <h2 className="text-xl md:text-2xl font-light mb-6">Aberdeen's Premier Football Club</h2>
            
            <div className="space-y-4">
              {teamPosition && (
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                  <h3 className="text-lg font-semibold mb-2">Current League Position</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-3xl font-bold mr-2">{teamPosition.position}</span>
                      <div>
                        <p className="font-medium">{teamPosition.team}</p>
                        <p className="text-sm text-gray-200">Highland League</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{teamPosition.points}</p>
                      <p className="text-sm text-gray-200">Points</p>
                    </div>
                  </div>
                </div>
              )}
              
              {nextFixture && (
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                  <h3 className="text-lg font-semibold mb-2">Next Match</h3>
                  <div>
                    <p className="text-sm text-gray-200 mb-2">
                      {format(new Date(nextFixture.date), 'EEEE, MMMM d, yyyy')} • {nextFixture.time || '15:00'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span>{nextFixture.homeTeam}</span>
                      <span className="mx-2 font-bold">vs</span>
                      <span>{nextFixture.awayTeam}</span>
                    </div>
                    <p className="text-sm text-gray-200 mt-2">{nextFixture.competition} • {nextFixture.venue || 'TBD'}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 mt-8">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link to="/fixtures">View All Fixtures</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                <Link to="/tickets">Get Tickets</Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <Card className="bg-white/5 backdrop-blur border-0">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Fixtures
                </h3>
                <div className="space-y-4">
                  {fixtures.map(fixture => (
                    <div key={fixture.id} className="border-b border-white/20 pb-3 last:border-0">
                      <p className="text-sm text-gray-300">
                        {format(new Date(fixture.date), 'EEE, MMM d')} • {fixture.competition}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span>{fixture.homeTeam}</span>
                        <span className="mx-2">vs</span>
                        <span>{fixture.awayTeam}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button asChild variant="link" className="text-white p-0 h-auto">
                    <Link to="/fixtures" className="flex items-center">
                      View All Fixtures
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
