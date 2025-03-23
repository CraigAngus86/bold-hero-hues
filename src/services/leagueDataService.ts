
import { Match } from '@/components/fixtures/types';
import { TeamStats, fullMockLeagueData } from '@/components/league/types';
import { 
  scrapeHighlandLeagueData, 
  scrapeLeagueTable, 
  scrapeFixtures, 
  scrapeResults 
} from './highlandLeagueScraper';

// Local storage keys for caching data
const CACHE_KEYS = {
  LEAGUE_TABLE: 'highland_league_table_cache',
  FIXTURES: 'highland_league_fixtures_cache',
  RESULTS: 'highland_league_results_cache',
  TIMESTAMP: 'highland_league_cache_timestamp'
};

// Cache TTL in milliseconds (6 hours)
const CACHE_TTL = 6 * 60 * 60 * 1000;

// Function to fetch and parse the league data from the Highland Football League website
export const fetchLeagueData = async (): Promise<{
  leagueTable: TeamStats[];
  fixtures: Match[];
  results: Match[];
}> => {
  try {
    console.log('Fetching data from Highland Football League website...');
    
    // Check if we have valid cached data
    const cachedData = getDataFromCache();
    if (cachedData) {
      console.log('Using cached data...');
      return cachedData;
    }
    
    // If no valid cache, fetch fresh data
    console.log('Fetching fresh data...');
    // Try to use the scraper to get real data
    try {
      const data = await scrapeHighlandLeagueData();
      // Cache the data we fetched
      cacheData(data);
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

// Function to get cached data if it's still valid
function getDataFromCache(): { leagueTable: TeamStats[]; fixtures: Match[]; results: Match[]; } | null {
  try {
    const timestampStr = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
    if (!timestampStr) return null;
    
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    
    // If cache is expired, return null
    if (now - timestamp > CACHE_TTL) return null;
    
    // Try to get cached data
    const leagueTableStr = localStorage.getItem(CACHE_KEYS.LEAGUE_TABLE);
    const fixturesStr = localStorage.getItem(CACHE_KEYS.FIXTURES);
    const resultsStr = localStorage.getItem(CACHE_KEYS.RESULTS);
    
    if (!leagueTableStr || !fixturesStr || !resultsStr) return null;
    
    return {
      leagueTable: JSON.parse(leagueTableStr),
      fixtures: JSON.parse(fixturesStr),
      results: JSON.parse(resultsStr)
    };
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

// Function to cache data
function cacheData(data: { leagueTable: TeamStats[]; fixtures: Match[]; results: Match[]; }): void {
  try {
    localStorage.setItem(CACHE_KEYS.LEAGUE_TABLE, JSON.stringify(data.leagueTable));
    localStorage.setItem(CACHE_KEYS.FIXTURES, JSON.stringify(data.fixtures));
    localStorage.setItem(CACHE_KEYS.RESULTS, JSON.stringify(data.results));
    localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}

// Functions to fetch specific data types (these will try scraping first, then fallback to mock data)

// Function to fetch and parse the league table data
export const fetchLeagueTable = async (): Promise<TeamStats[]> => {
  try {
    // Try to scrape the real league table
    try {
      const leagueTable = await scrapeLeagueTable();
      return leagueTable;
    } catch (error) {
      console.error('Error scraping league table:', error);
      console.log('Falling back to mock league table data...');
      // Fallback to full mock data
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

// Helper function to clear cache
export const clearLeagueDataCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEYS.LEAGUE_TABLE);
    localStorage.removeItem(CACHE_KEYS.FIXTURES);
    localStorage.removeItem(CACHE_KEYS.RESULTS);
    localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
    console.log('League data cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
