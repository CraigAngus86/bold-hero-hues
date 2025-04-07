
import { useState, useEffect } from 'react';
import { Fixture } from '@/types/fixtures';

// Mock data for fixtures
const mockFixtures = [
  {
    id: 'next-1',
    date: '2025-05-15',
    time: '15:00',
    home_team: 'Banks o\' Dee',
    away_team: 'Formartine United',
    competition: 'Highland League',
    venue: 'Spain Park',
    is_completed: false,
    is_next_match: true,
    ticket_link: '/tickets/next-match'
  },
  {
    id: 'fixture-2',
    date: '2025-05-22',
    time: '19:45',
    home_team: 'Fraserburgh',
    away_team: 'Banks o\' Dee',
    competition: 'Highland League Cup',
    venue: 'Bellslea Park',
    is_completed: false,
    is_next_match: false
  },
  {
    id: 'fixture-3',
    date: '2025-06-05',
    time: '15:00',
    home_team: 'Banks o\' Dee',
    away_team: 'Buckie Thistle',
    competition: 'Highland League',
    venue: 'Spain Park',
    is_completed: false,
    is_next_match: false
  },
  // Recent results
  {
    id: 'result-1',
    date: '2025-05-01',
    time: '15:00',
    home_team: 'Banks o\' Dee',
    away_team: 'Keith FC',
    home_score: 3,
    away_score: 1,
    competition: 'Highland League',
    venue: 'Spain Park',
    is_completed: true,
    is_latest_result: true
  },
  {
    id: 'result-2',
    date: '2025-04-24',
    time: '15:00',
    home_team: 'Rothes',
    away_team: 'Banks o\' Dee',
    home_score: 1,
    away_score: 2,
    competition: 'Highland League Cup',
    venue: 'Mackessack Park',
    is_completed: true
  },
  {
    id: 'result-3',
    date: '2025-04-17',
    time: '15:00',
    home_team: 'Banks o\' Dee',
    away_team: 'Brora Rangers',
    home_score: 0,
    away_score: 2,
    competition: 'Highland League',
    venue: 'Spain Park',
    is_completed: true
  }
];

export const useFixturesData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingFixtures, setUpcomingFixtures] = useState<Fixture[]>([]);
  const [recentResults, setRecentResults] = useState<Fixture[]>([]);
  const [nextMatch, setNextMatch] = useState<Fixture | null>(null);
  
  useEffect(() => {
    // Simulate API request
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network request
        
        const upcoming = mockFixtures.filter(fixture => !fixture.is_completed);
        const results = mockFixtures.filter(fixture => fixture.is_completed);
        
        setUpcomingFixtures(upcoming);
        setRecentResults(results);
        setNextMatch(upcoming.find(fixture => fixture.is_next_match) || upcoming[0] || null);
        
      } catch (error) {
        console.error('Error fetching fixtures data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return {
    isLoading,
    upcomingFixtures,
    recentResults, 
    nextMatch
  };
};
