
import { TeamStats } from '@/components/league/types';
import { mockLeagueData } from '@/components/league/types';
import { mockMatches } from '@/components/fixtures/fixturesMockData';
import { getApiConfig } from './config/apiConfig';

// This file provides both real API calls and fallback mock data for Highland League information
console.log('Highland League scraper initialized');

// Function to fetch league table data from our Node.js server (if available)
async function fetchLeagueTableFromServer(): Promise<TeamStats[]> {
  try {
    const config = getApiConfig();
    
    // If no server URL is configured, throw an error to use mock data
    if (!config.apiServerUrl) {
      throw new Error('No server URL configured');
    }
    
    console.log('Attempting to fetch Highland League table from server');
    
    // Use the configured API server
    const serverUrl = config.apiServerUrl;
    const url = `${serverUrl}/api/league-table`;
    
    console.log(`Fetching from: ${url}`);
    
    // Make the HTTP request to our Node.js server with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // Add API key if configured
        ...(config.apiKey ? { 'X-API-Key': config.apiKey } : {})
      },
      signal: controller.signal,
      mode: 'cors' // Explicitly enable CORS
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('Failed to fetch from server:', response.status, response.statusText);
      throw new Error(`Failed to fetch from server: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched league table from server');
    
    return data.leagueTable;
    
  } catch (error) {
    console.error('Error fetching league table from server:', error);
    // Fall back to mock data
    console.log('Falling back to mock data due to server error');
    return mockLeagueData;
  }
}

export const scrapeHighlandLeagueData = async () => {
  try {
    console.log('Fetching Highland League data');
    const leagueTable = await scrapeLeagueTable();
    
    // For now, we'll use mock data for fixtures and results
    return {
      leagueTable,
      fixtures: mockMatches.filter(match => !match.isCompleted),
      results: mockMatches.filter(match => match.isCompleted)
    };
  } catch (error) {
    console.error('Error in scrapeHighlandLeagueData:', error);
    return {
      leagueTable: mockLeagueData,
      fixtures: mockMatches.filter(match => !match.isCompleted),
      results: mockMatches.filter(match => match.isCompleted)
    };
  }
};

export const scrapeLeagueTable = async () => {
  try {
    return await fetchLeagueTableFromServer();
  } catch (error) {
    console.error('Error in scrapeLeagueTable:', error);
    return mockLeagueData;
  }
};

export const scrapeFixtures = async () => {
  console.log('Using mock fixtures data for now');
  return mockMatches.filter(match => !match.isCompleted);
};

export const scrapeResults = async () => {
  console.log('Using mock results data for now');
  return mockMatches.filter(match => match.isCompleted);
};
