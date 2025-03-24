
import { TeamStats } from '@/components/league/types';
import { mockLeagueData } from '@/components/league/types';
import { mockMatches } from '@/components/fixtures/fixturesMockData';
import { getApiConfig } from './config/apiConfig';
import { FirecrawlService } from '@/utils/FirecrawlService';
import { convertToMatches } from '@/types/fixtures';
import { Match } from '@/components/fixtures/types';
import { toast } from 'sonner';

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
    
    // Try to use real fixture data from Transfermarkt
    try {
      console.log('Attempting to fetch fixtures from Transfermarkt');
      const { success, data } = await FirecrawlService.fetchTransfermarktFixtures();
      
      if (success && data && data.length > 0) {
        console.log(`Successfully fetched ${data.length} fixtures from Transfermarkt`);
        // Convert ScrapedFixture[] to Match[]
        const fixturesData = convertToMatches(data.filter(match => !match.isCompleted));
        const resultsData = convertToMatches(data.filter(match => match.isCompleted));
        return { leagueTable, fixtures: fixturesData, results: resultsData };
      } else {
        console.log('No fixtures found from Transfermarkt, trying mock data');
        throw new Error('No fixtures found from Transfermarkt');
      }
    } catch (error) {
      console.error('Error getting fixtures from Transfermarkt:', error);
      
      // Try using mock data from the FirecrawlService
      console.log('Generating mock fixtures as fallback');
      const mockData = FirecrawlService.generateMockFixtures();
      if (mockData && mockData.length > 0) {
        console.log(`Generated ${mockData.length} mock fixtures`);
        const fixturesData = convertToMatches(mockData.filter(match => !match.isCompleted));
        const resultsData = convertToMatches(mockData.filter(match => match.isCompleted));
        return { leagueTable, fixtures: fixturesData, results: resultsData };
      }
    }
    
    // Last resort fallback to hardcoded mock data
    console.log('Using hardcoded mock fixture data as a last resort');
    toast.warning('Using mock fixture data - could not fetch real data');
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

export const scrapeFixtures = async (): Promise<Match[]> => {
  try {
    // Try to get real fixture data from Transfermarkt
    const { success, data } = await FirecrawlService.fetchTransfermarktFixtures();
    if (success && data && data.length > 0) {
      return convertToMatches(data.filter(match => !match.isCompleted));
    }
    
    // Try using mock data from the FirecrawlService
    const mockData = FirecrawlService.generateMockFixtures();
    if (mockData && mockData.length > 0) {
      return convertToMatches(mockData.filter(match => !match.isCompleted));
    }
    
    // Fall back to hardcoded mock data
    console.log('Using hardcoded mock fixtures data - all scraping attempts failed');
    return mockMatches.filter(match => !match.isCompleted);
  } catch (error) {
    console.error('Error scraping fixtures:', error);
    console.log('Using mock fixtures data due to error');
    return mockMatches.filter(match => !match.isCompleted);
  }
};

export const scrapeResults = async (): Promise<Match[]> => {
  try {
    // Try to get real results data from Transfermarkt
    const { success, data } = await FirecrawlService.fetchTransfermarktFixtures();
    if (success && data && data.length > 0) {
      return convertToMatches(data.filter(match => match.isCompleted));
    }
    
    // Try using mock data from the FirecrawlService
    const mockData = FirecrawlService.generateMockFixtures();
    if (mockData && mockData.length > 0) {
      return convertToMatches(mockData.filter(match => match.isCompleted));
    }
    
    // Fall back to hardcoded mock data
    console.log('Using hardcoded mock results data - all scraping attempts failed');
    return mockMatches.filter(match => match.isCompleted);
  } catch (error) {
    console.error('Error scraping results:', error);
    console.log('Using mock results data due to error');
    return mockMatches.filter(match => match.isCompleted);
  }
};
