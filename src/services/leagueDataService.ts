
import { Match } from '@/components/fixtures/types';
import { TeamStats } from '@/components/league/types';
import { 
  scrapeHighlandLeagueData, 
  scrapeLeagueTable, 
  scrapeFixtures, 
  scrapeResults 
} from './highlandLeagueScraper';
import { getApiConfig } from './config/apiConfig';
import {
  getCachedLeagueData,
  cacheLeagueData,
  clearLeagueDataCache,
  exportLeagueData as exportData,
  importLeagueData as importData
} from './cache/leagueDataCache';
import { fetchLeagueTableFromSupabase } from './supabase/leagueDataService';

// Re-export for backward compatibility
export { clearLeagueDataCache } from './cache/leagueDataCache';
export { getApiConfig, saveApiConfig } from './config/apiConfig';
export const exportAllData = exportData;
export const importDataFromJson = importData;

// Function to fetch and parse the league data from the Highland Football League website
export const fetchLeagueData = async (forceRefresh = false): Promise<{
  leagueTable: TeamStats[];
  fixtures: Match[];
  results: Match[];
}> => {
  try {
    console.log('Fetching data from Highland Football League website...');
    
    // Check if we have valid cached data and force refresh is not requested
    if (!forceRefresh) {
      const cachedData = getCachedLeagueData();
      if (cachedData) {
        console.log('Using cached data...');
        return cachedData;
      }
    }
    
    // First try to get league table from Supabase
    try {
      console.log('Fetching data from Supabase...');
      
      const leagueTable = await fetchLeagueTableFromSupabase();
      
      if (leagueTable.length > 0) {
        // For now, use scraped data for fixtures and results since we're rebuilding those
        const fixtures = await fetchFixtures();
        const results = await fetchResults();
        
        const data = { leagueTable, fixtures, results };
        cacheLeagueData(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
    }
    
    // If Supabase data is not available, try the scraper
    console.log('Fetching fresh data from scraper...');
    try {
      const config = getApiConfig();
      
      // Use proxy if configured
      if (config.useProxy && config.proxyUrl) {
        console.log(`Using proxy: ${config.proxyUrl}`);
      }
      
      const data = await scrapeHighlandLeagueData();
      // Cache the data we fetched
      cacheLeagueData(data);
      return data;
    } catch (error) {
      console.error('Error scraping data:', error);
      console.log('Falling back to mock data...');
      // Fallback to mock data if scraping fails
      return {
        leagueTable: await fetchLeagueTable(),
        fixtures: await fetchFixtures(),
        results: await fetchResults()
      };
    }
  } catch (error) {
    console.error('Error fetching league data:', error);
    throw new Error('Failed to fetch league data');
  }
};

// Function to fetch and parse the league table data
export const fetchLeagueTable = async (): Promise<TeamStats[]> => {
  try {
    // First try to get data from Supabase
    try {
      const leagueTable = await fetchLeagueTableFromSupabase();
      if (leagueTable.length > 0) {
        return leagueTable;
      }
    } catch (error) {
      console.error('Error fetching league table from Supabase:', error);
    }
    
    // Try to scrape the real league table
    try {
      const leagueTable = await scrapeLeagueTable();
      return leagueTable;
    } catch (error) {
      console.error('Error scraping league table:', error);
      console.log('Falling back to mock league table data...');
      // Fallback to full mock data
      const { fullMockLeagueData } = await import('@/components/league/types');
      return fullMockLeagueData;
    }
  } catch (error) {
    console.error('Error fetching league table:', error);
    throw new Error('Failed to fetch league table');
  }
};

// Function to fetch and parse the fixtures data
export const fetchFixtures = async (): Promise<Match[]> => {
  try {
    // Try to scrape the real fixtures
    try {
      const fixtures = await scrapeFixtures();
      return fixtures;
    } catch (error) {
      console.error('Error scraping fixtures:', error);
      console.log('Falling back to mock fixtures data...');
      // Fallback to mock data
      const { mockMatches } = await import('@/components/fixtures/fixturesMockData');
      return mockMatches.filter(match => !match.isCompleted);
    }
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    throw new Error('Failed to fetch fixtures');
  }
};

// Function to fetch and parse the results data
export const fetchResults = async (): Promise<Match[]> => {
  try {
    // Try to scrape the real results
    try {
      const results = await scrapeResults();
      return results;
    } catch (error) {
      console.error('Error scraping results:', error);
      console.log('Falling back to mock results data...');
      // Fallback to mock data
      const { mockMatches } = await import('@/components/fixtures/fixturesMockData');
      return mockMatches.filter(match => match.isCompleted);
    }
  } catch (error) {
    console.error('Error fetching results:', error);
    throw new Error('Failed to fetch results');
  }
};

// New function to fetch all matches (for admin pages) - temporary implementation
export const fetchAllMatches = async (): Promise<Match[]> => {
  try {
    // Fallback to mock data for now
    const { mockMatches } = await import('@/components/fixtures/fixturesMockData');
    return mockMatches;
  } catch (error) {
    console.error('Error fetching all matches:', error);
    throw new Error('Failed to fetch all matches');
  }
};
