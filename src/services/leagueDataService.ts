
import { Match } from '@/components/fixtures/types';
import { TeamStats } from '@/components/league/types';
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

// Function to fetch and parse the league data
export const fetchLeagueData = async (): Promise<{
  leagueTable: TeamStats[];
  fixtures: Match[];
  results: Match[];
}> => {
  try {
    console.log('Fetching Highland Football League data...');
    
    // Check if we have valid cached data
    const cachedData = getDataFromCache();
    if (cachedData) {
      console.log('Using cached data...');
      return cachedData;
    }
    
    // If no valid cache, get mock data (real scraping won't work from browser)
    console.log('Getting new data...');
    // In a real implementation, this would call a backend API
    // For now, we'll use mock data
    const data = {
      leagueTable: await fetchLeagueTable(),
      fixtures: await fetchFixtures(),
      results: await fetchResults()
    };
    
    // Cache the data we fetched
    cacheData(data);
    return data;
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

// Functions to fetch specific data types (these will use mock data for now)
export const fetchLeagueTable = async (): Promise<TeamStats[]> => {
  try {
    console.log('Getting league table data...');
    // In a real implementation, this would call a backend API
    const { fullMockLeagueData } = await import('@/components/league/types');
    return fullMockLeagueData;
  } catch (error) {
    console.error('Error fetching league table:', error);
    throw new Error('Failed to fetch league table');
  }
};

// Function to fetch fixtures data
export const fetchFixtures = async (): Promise<Match[]> => {
  try {
    console.log('Getting fixtures data...');
    // In a real implementation, this would call a backend API
    const { mockMatches } = await import('@/components/fixtures/fixturesMockData');
    return mockMatches.filter(match => !match.isCompleted);
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    throw new Error('Failed to fetch fixtures');
  }
};

// Function to fetch results data
export const fetchResults = async (): Promise<Match[]> => {
  try {
    console.log('Getting results data...');
    // In a real implementation, this would call a backend API
    const { mockMatches } = await import('@/components/fixtures/fixturesMockData');
    return mockMatches.filter(match => match.isCompleted);
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
