
import { TeamStats } from '@/components/league/types';
import { mockLeagueData } from '@/components/league/types';
import { mockMatches } from '@/components/fixtures/fixturesMockData';
import { getApiConfig } from './config/apiConfig';

// This file provides both real scraping and fallback mock data for Highland League information
console.log('Highland League scraper initialized');

// Utility function to parse the BBC Sport Highland League table
async function scrapeBBCSportTable(): Promise<TeamStats[]> {
  try {
    console.log('Attempting to scrape BBC Sport Highland League table');
    
    const config = getApiConfig();
    const proxyPrefix = config.useProxy && config.proxyUrl ? config.proxyUrl : '';
    const url = `${proxyPrefix}https://www.bbc.com/sport/football/scottish-highland-league/table`;
    
    // Make the HTTP request to the BBC Sport website
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch BBC Sport page:', response.status, response.statusText);
      throw new Error(`Failed to fetch BBC Sport page: ${response.status}`);
    }
    
    const html = await response.text();
    console.log('Successfully fetched BBC Sport page');
    
    // Parse the HTML to extract the table data
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // The table rows are typically in a table with a specific class
    const tableRows = doc.querySelectorAll('.gs-o-table__row');
    if (!tableRows || tableRows.length === 0) {
      console.error('Could not find table rows in BBC Sport page');
      throw new Error('Could not find table rows in BBC Sport page');
    }
    
    // Extract data from each row
    const leagueData: TeamStats[] = [];
    let position = 1;
    
    tableRows.forEach((row, index) => {
      // Skip the header row
      if (index === 0) return;
      
      try {
        const cells = row.querySelectorAll('td');
        if (cells.length < 10) return;
        
        // Extract team name
        const teamNameElement = cells[0].querySelector('.gs-o-table__cell--left');
        const teamName = teamNameElement ? teamNameElement.textContent?.trim() : '';
        
        if (!teamName) return;
        
        // Extract other stats
        const played = parseInt(cells[1].textContent?.trim() || '0');
        const won = parseInt(cells[2].textContent?.trim() || '0');
        const drawn = parseInt(cells[3].textContent?.trim() || '0');
        const lost = parseInt(cells[4].textContent?.trim() || '0');
        const goalsFor = parseInt(cells[5].textContent?.trim() || '0');
        const goalsAgainst = parseInt(cells[6].textContent?.trim() || '0');
        const goalDifference = parseInt(cells[7].textContent?.trim() || '0');
        const points = parseInt(cells[8].textContent?.trim() || '0');
        
        // Extract form
        const formElement = cells[9].querySelectorAll('.gs-o-status-icon');
        const form: string[] = [];
        formElement.forEach(el => {
          const className = el.className;
          if (className.includes('gs-o-status-icon--win')) form.push('W');
          else if (className.includes('gs-o-status-icon--draw')) form.push('D');
          else if (className.includes('gs-o-status-icon--loss')) form.push('L');
        });
        
        // Create a TeamStats object
        leagueData.push({
          position,
          team: teamName,
          played,
          won,
          drawn,
          lost,
          goalsFor,
          goalsAgainst,
          goalDifference,
          points,
          form: form.slice(0, 5) // Last 5 results
        });
        
        position++;
      } catch (error) {
        console.error('Error parsing row:', error);
      }
    });
    
    if (leagueData.length === 0) {
      console.error('Failed to extract any team data from BBC Sport page');
      throw new Error('Failed to extract team data');
    }
    
    console.log(`Successfully extracted data for ${leagueData.length} teams`);
    return leagueData;
    
  } catch (error) {
    console.error('Error scraping BBC Sport table:', error);
    // Fall back to mock data
    console.log('Falling back to mock data due to scraping error');
    return mockLeagueData;
  }
}

export const scrapeHighlandLeagueData = async () => {
  try {
    console.log('Scraping Highland League data');
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
    return await scrapeBBCSportTable();
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
