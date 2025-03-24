
import { mockLeagueData } from '@/components/league/types';
import { mockMatches } from '@/components/fixtures/fixturesMockData';

// This file now only provides mock data
console.log('Using mock data for Highland League information');

export const scrapeHighlandLeagueData = async () => {
  console.log('Returning mock Highland League data');
  return {
    leagueTable: mockLeagueData,
    fixtures: mockMatches.filter(match => !match.isCompleted),
    results: mockMatches.filter(match => match.isCompleted)
  };
};

export const scrapeLeagueTable = async () => {
  console.log('Returning mock league table data');
  return mockLeagueData;
};

export const scrapeFixtures = async () => {
  console.log('Returning mock fixtures');
  return mockMatches.filter(match => !match.isCompleted);
};

export const scrapeResults = async () => {
  console.log('Returning mock results');
  return mockMatches.filter(match => match.isCompleted);
};
