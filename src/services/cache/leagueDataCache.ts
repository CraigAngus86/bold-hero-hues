
import { TeamStats } from '@/components/league/types';
import { Match } from '@/components/fixtures/types';
import { CACHE_KEYS, CACHE_TTL } from '../config/apiConfig';

// Function to get cached data if it's still valid
export function getCachedLeagueData(): { 
  leagueTable: TeamStats[]; 
  fixtures: Match[]; 
  results: Match[]; 
} | null {
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
export function cacheLeagueData(data: { 
  leagueTable: TeamStats[]; 
  fixtures: Match[]; 
  results: Match[];
}): void {
  try {
    localStorage.setItem(CACHE_KEYS.LEAGUE_TABLE, JSON.stringify(data.leagueTable));
    localStorage.setItem(CACHE_KEYS.FIXTURES, JSON.stringify(data.fixtures));
    localStorage.setItem(CACHE_KEYS.RESULTS, JSON.stringify(data.results));
    localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
    console.log('Data cached to localStorage');
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}

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
export const exportLeagueData = (): string => {
  try {
    const data = getCachedLeagueData();
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
export const importLeagueData = (jsonString: string): boolean => {
  try {
    const importedData = JSON.parse(jsonString);
    
    if (!importedData.data || 
        !importedData.data.leagueTable || 
        !importedData.data.fixtures || 
        !importedData.data.results) {
      throw new Error('Invalid data format');
    }
    
    cacheLeagueData(importedData.data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
