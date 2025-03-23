
import { mockLeagueData } from '@/components/league/types';
import { mockMatches } from '@/components/fixtures/fixturesMockData';

// This file provides mock data when real scraping is disabled
console.log('Scraper functionality has been temporarily disabled');

export const scrapeHighlandLeagueData = async () => {
  console.log('Scraper functionality disabled, returning mock data');
  return {
    leagueTable: mockLeagueData,
    fixtures: mockMatches.filter(match => !match.isCompleted),
    results: mockMatches.filter(match => match.isCompleted)
  };
};

export const scrapeLeagueTable = async (useProxy = false) => {
  console.log('Scraper functionality disabled, returning mock league data');
  return mockLeagueData;
};

export const scrapeFixtures = async () => {
  console.log('Scraper functionality disabled, returning mock fixtures');
  return mockMatches.filter(match => !match.isCompleted);
};

export const scrapeResults = async () => {
  console.log('Scraper functionality disabled, returning mock results');
  return mockMatches.filter(match => match.isCompleted);
};
