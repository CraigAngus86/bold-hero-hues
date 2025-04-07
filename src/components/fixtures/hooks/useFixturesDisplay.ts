
import { useEffect, useState } from 'react';
import { Fixture, Match, dbFixturesToMatches } from '@/types/fixtures';
import { useFixturesData } from '@/components/home/fixtures/useFixturesData';
import { TeamStats } from '@/types/fixtures';

// Mock league data
const mockLeagueData: TeamStats[] = [
  {
    id: 1,
    position: 1,
    team: 'Brechin City',
    played: 15,
    won: 12,
    drawn: 2,
    lost: 1,
    goalsFor: 38,
    goalsAgainst: 11,
    goalDifference: 27,
    points: 38,
    form: ['W', 'W', 'W', 'D', 'W']
  },
  {
    id: 2,
    position: 2,
    team: 'Buckie Thistle',
    played: 15,
    won: 11,
    drawn: 2,
    lost: 2,
    goalsFor: 32,
    goalsAgainst: 14,
    goalDifference: 18,
    points: 35,
    form: ['W', 'L', 'W', 'W', 'D']
  },
  {
    id: 3,
    position: 3,
    team: 'Banks o\' Dee',
    played: 15,
    won: 10,
    drawn: 3,
    lost: 2,
    goalsFor: 30,
    goalsAgainst: 12,
    goalDifference: 18,
    points: 33,
    form: ['W', 'W', 'D', 'W', 'W']
  },
  {
    id: 4,
    position: 4,
    team: 'Fraserburgh',
    played: 15,
    won: 9,
    drawn: 3,
    lost: 3,
    goalsFor: 28,
    goalsAgainst: 15,
    goalDifference: 13,
    points: 30,
    form: ['W', 'W', 'L', 'D', 'W']
  },
  {
    id: 5,
    position: 5,
    team: 'Formartine United',
    played: 15,
    won: 8,
    drawn: 4,
    lost: 3,
    goalsFor: 25,
    goalsAgainst: 17,
    goalDifference: 8,
    points: 28,
    form: ['W', 'D', 'W', 'D', 'L']
  }
];

export const useFixturesDisplay = () => {
  const { isLoading, upcomingFixtures, recentResults, nextMatch } = useFixturesData();
  
  // Convert fixtures to Match format
  const upcomingMatches: Match[] = upcomingFixtures.map(fixture => ({
    id: fixture.id || '',
    date: fixture.date,
    time: fixture.time,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue || '',
    isCompleted: fixture.is_completed || false,
    homeScore: fixture.home_score,
    awayScore: fixture.away_score,
    ticketLink: fixture.ticket_link,
    season: fixture.season
  }));
  
  const recentMatches: Match[] = recentResults.map(fixture => ({
    id: fixture.id || '',
    date: fixture.date,
    time: fixture.time,
    homeTeam: fixture.home_team,
    awayTeam: fixture.away_team,
    competition: fixture.competition,
    venue: fixture.venue || '',
    isCompleted: true,
    homeScore: fixture.home_score,
    awayScore: fixture.away_score,
    ticketLink: fixture.ticket_link,
    season: fixture.season,
    hasMatchPhotos: Math.random() > 0.5 // Mock data for match photos availability
  }));
  
  // Map to component-specific props
  return {
    isLoading,
    upcomingMatches,
    recentMatches,
    nextMatch,
    leagueData: mockLeagueData
  };
};
