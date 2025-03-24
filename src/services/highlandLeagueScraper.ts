
import { TeamStats } from '@/components/league/types';
import { mockLeagueData } from '@/components/league/types';
import { mockMatches } from '@/components/fixtures/fixturesMockData';
import { getApiConfig } from './config/apiConfig';
import { convertToMatches } from '@/types/fixtures';
import { Match } from '@/components/fixtures/types';
import { supabase } from '@/services/supabase/supabaseClient';
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

// Function to fetch fixtures and results from Supabase edge function
async function fetchFixturesFromEdgeFunction(): Promise<{
  fixtures: Match[],
  results: Match[]
}> {
  try {
    console.log('Attempting to fetch fixtures from Supabase edge function');
    
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    // Call the Supabase edge function to scrape fixture data
    const { data, error } = await supabase.functions.invoke('scrape-bbc-fixtures', {
      body: { 
        url: 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures'
      }
    });
    
    if (error) {
      console.error('Error from edge function:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    if (!data || !data.success || !data.data || data.data.length === 0) {
      console.error('No fixtures returned from edge function:', data);
      throw new Error('No fixtures found from BBC Sport');
    }
    
    console.log(`Successfully fetched ${data.data.length} fixtures from BBC Sport via edge function`);
    
    // Convert to Match objects and separate fixtures and results
    const allMatches = convertToMatches(data.data);
    const fixtures = allMatches.filter(match => !match.isCompleted);
    const results = allMatches.filter(match => match.isCompleted);
    
    return { fixtures, results };
  } catch (error) {
    console.error('Error fetching from edge function:', error);
    throw error; // Let the caller handle the fallback
  }
}

export const scrapeHighlandLeagueData = async () => {
  try {
    console.log('Fetching Highland League data');
    const leagueTable = await scrapeLeagueTable();
    
    // Try to use real fixture data from the edge function
    try {
      console.log('Attempting to fetch fixtures from BBC Sport');
      const { fixtures, results } = await fetchFixturesFromEdgeFunction();
      
      if (fixtures.length > 0 || results.length > 0) {
        console.log(`Successfully fetched ${fixtures.length} fixtures and ${results.length} results from BBC Sport`);
        return { leagueTable, fixtures, results };
      } else {
        console.log('No fixtures found from BBC Sport, trying mock data');
        throw new Error('No fixtures found from BBC Sport');
      }
    } catch (error) {
      console.error('Error getting fixtures from BBC Sport:', error);
      
      // Last resort fallback to hardcoded mock data
      console.log('Using hardcoded mock fixture data as a last resort');
      toast.warning('Using mock fixture data - could not fetch real data');
      return {
        leagueTable,
        fixtures: mockMatches.filter(match => !match.isCompleted),
        results: mockMatches.filter(match => match.isCompleted)
      };
    }
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
    // Try to get real fixture data from the edge function
    const { fixtures } = await fetchFixturesFromEdgeFunction();
    return fixtures;
  } catch (error) {
    console.error('Error scraping fixtures:', error);
    console.log('Using mock fixtures data due to error');
    return mockMatches.filter(match => !match.isCompleted);
  }
};

export const scrapeResults = async (): Promise<Match[]> => {
  try {
    // Try to get real results data from the edge function
    const { results } = await fetchFixturesFromEdgeFunction();
    return results;
  } catch (error) {
    console.error('Error scraping results:', error);
    console.log('Using mock results data due to error');
    return mockMatches.filter(match => match.isCompleted);
  }
};
