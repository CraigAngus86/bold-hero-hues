
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
  TIMESTAMP: 'highland_league_cache_timestamp',
  API_CONFIG: 'highland_league_api_config'
};

// Cache TTL in milliseconds (6 hours)
const CACHE_TTL = 6 * 60 * 60 * 1000;

// API configuration interface
export interface ApiConfig {
  useProxy: boolean;
  proxyUrl?: string;
  apiKey?: string;
  useLocalStorage: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
}

// Default API configuration
const DEFAULT_API_CONFIG: ApiConfig = {
  useProxy: false,
  proxyUrl: '',
  apiKey: '',
  useLocalStorage: true,
  autoRefresh: true,
  refreshInterval: 360 // 6 hours
};

// Get API configuration from local storage or use defaults
export const getApiConfig = (): ApiConfig => {
  try {
    const storedConfig = localStorage.getItem(CACHE_KEYS.API_CONFIG);
    if (storedConfig) {
      return JSON.parse(storedConfig);
    }
  } catch (error) {
    console.error('Error reading API config from localStorage:', error);
  }
  return DEFAULT_API_CONFIG;
};

// Save API configuration to local storage
export const saveApiConfig = (config: ApiConfig): void => {
  try {
    localStorage.setItem(CACHE_KEYS.API_CONFIG, JSON.stringify(config));
    console.log('API configuration saved');
  } catch (error) {
    console.error('Error saving API config to localStorage:', error);
  }
};

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
      const cachedData = getDataFromCache();
      if (cachedData) {
        console.log('Using cached data...');
        return cachedData;
      }
    }
    
    // If no valid cache or force refresh, fetch fresh data
    console.log('Fetching fresh data...');
    // Try to use the scraper to get real data
    try {
      const config = getApiConfig();
      
      // Use proxy if configured
      if (config.useProxy && config.proxyUrl) {
        console.log(`Using proxy: ${config.proxyUrl}`);
        // Implementation would depend on your proxy setup
      }
      
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
    const config = getApiConfig();
    
    // Only cache if local storage is enabled
    if (config.useLocalStorage) {
      localStorage.setItem(CACHE_KEYS.LEAGUE_TABLE, JSON.stringify(data.leagueTable));
      localStorage.setItem(CACHE_KEYS.FIXTURES, JSON.stringify(data.fixtures));
      localStorage.setItem(CACHE_KEYS.RESULTS, JSON.stringify(data.results));
      localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
      console.log('Data cached to localStorage');
    }
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

// Function to export all data to JSON
export const exportAllData = (): string => {
  try {
    const data = getDataFromCache();
    if (!data) {
      throw new Error('No cached data found');
    }
    
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        source: 'Banks o\' Dee FC Admin Panel'
      },
      data
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};

// Function to import data from JSON
export const importDataFromJson = (jsonString: string): boolean => {
  try {
    const importedData = JSON.parse(jsonString);
    
    if (!importedData.data || 
        !importedData.data.leagueTable || 
        !importedData.data.fixtures || 
        !importedData.data.results) {
      throw new Error('Invalid data format');
    }
    
    cacheData(importedData.data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
