
import * as cheerio from 'cheerio';
import { Match } from '@/components/fixtures/types';
import { TeamStats } from '@/components/league/types';

// Main function to scrape all Highland League data
export const scrapeHighlandLeagueData = async (): Promise<{
  leagueTable: TeamStats[];
  fixtures: Match[];
  results: Match[];
}> => {
  try {
    // Fetch all data in parallel for efficiency
    const [leagueTable, fixtures, results] = await Promise.all([
      scrapeLeagueTable(),
      scrapeFixtures(),
      scrapeResults()
    ]);

    return {
      leagueTable,
      fixtures,
      results
    };
  } catch (error) {
    console.error('Error scraping Highland League data:', error);
    throw new Error('Failed to scrape Highland League data');
  }
};

// Function to scrape the league table
export const scrapeLeagueTable = async (): Promise<TeamStats[]> => {
  try {
    // Updated URL to the correct endpoint
    const response = await fetch('http://www.highlandfootballleague.com/LeagueTable/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BanksODeeFC/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch league table: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const leagueTable: TeamStats[] = [];
    // Select the current league table - looking for the main table element
    const tableRows = $('table.leaguetable tbody tr, .league-table tbody tr');
    
    // If no rows found with the original selector, try alternative selectors
    if (tableRows.length === 0) {
      console.log('No rows found with primary selector, trying alternatives');
      const alternativeTables = $('table tbody tr');
      if (alternativeTables.length > 0) {
        console.log('Found table with alternative selector, rows:', alternativeTables.length);
      }
    }
    
    console.log('Found table rows:', tableRows.length);
    
    let currentSeason = "2024-2025";
    // Try to extract the current season from the page
    const seasonText = $('h1, h2, h3').text();
    if (seasonText.includes("2024") || seasonText.includes("24-25") || seasonText.includes("2024-25")) {
      currentSeason = "2024-2025";
    }
    console.log('Identified season:', currentSeason);
    
    tableRows.each((index, element) => {
      const cells = $(element).find('td');
      
      if (cells.length < 9) {
        console.log('Skipping row with insufficient cells:', cells.length);
        return; // skip rows that don't have enough cells
      }
      
      // Extract the data from each cell
      const position = parseInt($(cells[0]).text().trim(), 10) || index + 1;
      const team = $(cells[1]).text().trim();
      const played = parseInt($(cells[2]).text().trim(), 10) || 0;
      const won = parseInt($(cells[3]).text().trim(), 10) || 0;
      const drawn = parseInt($(cells[4]).text().trim(), 10) || 0;
      const lost = parseInt($(cells[5]).text().trim(), 10) || 0;
      const goalsFor = parseInt($(cells[6]).text().trim(), 10) || 0;
      const goalsAgainst = parseInt($(cells[7]).text().trim(), 10) || 0;
      const points = parseInt($(cells[9]).text().trim(), 10) || 0;
      const goalDifference = goalsFor - goalsAgainst;
      
      // Extract form if available
      const formStr = $(cells[10]).text().trim();
      const form = formStr.split('').filter(char => ['W', 'D', 'L'].includes(char));
      
      // Look for team logo if available
      const logoElement = $(cells[1]).find('img');
      const logo = logoElement.length > 0 ? logoElement.attr('src') : undefined;
      
      // Create the team stats object
      leagueTable.push({
        position,
        team,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference,
        points,
        form: form.length ? form : ['U', 'U', 'U', 'U', 'U'],
        logo: team === "Banks o' Dee" 
          ? "/lovable-uploads/banks-o-dee-logo.png"
          : logo || `https://placehold.co/40x40/team-white/team-blue?text=${team.substring(0, 2)}`
      });
    });
    
    if (leagueTable.length === 0) {
      console.error('Failed to extract league table data');
      throw new Error('No league table data found');
    }
    
    return leagueTable;
  } catch (error) {
    console.error('Error scraping league table:', error);
    throw error;
  }
};

// Function to scrape fixtures
export const scrapeFixtures = async (): Promise<Match[]> => {
  try {
    // Updated URL to the correct endpoint
    const response = await fetch('http://www.highlandfootballleague.com/Fixtures/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BanksODeeFC/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fixtures: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const fixtures: Match[] = [];
    // Try multiple selectors to find fixtures
    const fixtureRows = $('.fixture, .fixturelist-item, tr.fixture-row');
    
    console.log('Found fixture rows:', fixtureRows.length);
    
    // If no rows found with the original selector, log the HTML to help debug
    if (fixtureRows.length === 0) {
      console.log('No rows found with primary fixture selectors, trying alternatives');
      // Try to find any divs or tables that might contain fixtures
      const possibleContainers = $('div:contains("fixture"), table:contains("fixture")');
      console.log('Possible fixture containers found:', possibleContainers.length);
    }
    
    fixtureRows.each((index, element) => {
      // Try different ways of extracting the data based on the HTML structure
      const date = $(element).find('.date, [data-date], td:nth-child(1)').text().trim();
      const parsedDate = parseDate(date);
      
      const competition = $(element).find('.competition, [data-competition], td:nth-child(2)').text().trim();
      const homeTeam = $(element).find('.home_team, .home-team, td:nth-child(3)').text().trim();
      const awayTeam = $(element).find('.away_team, .away-team, td:nth-child(5)').text().trim();
      const venue = $(element).find('.venue, [data-venue], td:nth-child(6)').text().trim() || 'TBC';
      const time = $(element).find('.time, [data-time], td:nth-child(7)').text().trim() || '15:00';
      
      // Only include fixtures where Banks o' Dee is playing or where we're interested in the fixture
      if (homeTeam === "Banks o' Dee" || awayTeam === "Banks o' Dee" || shouldIncludeFixture(homeTeam, awayTeam)) {
        fixtures.push({
          id: index + 1,
          homeTeam,
          awayTeam,
          date: parsedDate,
          time,
          competition: competition || 'Highland League',
          isCompleted: false,
          venue
        });
      }
    });
    
    return fixtures;
  } catch (error) {
    console.error('Error scraping fixtures:', error);
    throw error;
  }
};

// Function to scrape results
export const scrapeResults = async (): Promise<Match[]> => {
  try {
    // Updated URL to the correct endpoint
    const response = await fetch('http://www.highlandfootballleague.com/Results/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BanksODeeFC/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch results: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const results: Match[] = [];
    // Try multiple selectors to find results
    const resultRows = $('.result, .resultlist-item, tr.result-row');
    
    console.log('Found result rows:', resultRows.length);
    
    // If no rows found with the original selector, try alternative approaches
    if (resultRows.length === 0) {
      console.log('No rows found with primary result selectors, trying alternatives');
      const possibleContainers = $('div:contains("result"), table:contains("result")');
      console.log('Possible result containers found:', possibleContainers.length);
    }
    
    resultRows.each((index, element) => {
      const date = $(element).find('.date, [data-date], td:nth-child(1)').text().trim();
      const parsedDate = parseDate(date);
      
      const competition = $(element).find('.competition, [data-competition], td:nth-child(2)').text().trim();
      const homeTeam = $(element).find('.home_team, .home-team, td:nth-child(3)').text().trim();
      const awayTeam = $(element).find('.away_team, .away-team, td:nth-child(5)').text().trim();
      const scoreText = $(element).find('.score, [data-score], td:nth-child(4)').text().trim();
      const venue = $(element).find('.venue, [data-venue], td:nth-child(6)').text().trim() || 'Unknown';
      
      // Parse score
      const scoreParts = scoreText.split('-');
      let homeScore = 0;
      let awayScore = 0;
      
      if (scoreParts.length >= 2) {
        homeScore = parseInt(scoreParts[0].trim(), 10) || 0;
        awayScore = parseInt(scoreParts[1].trim(), 10) || 0;
      }
      
      // Only include results where Banks o' Dee is playing or where we're interested in the match
      if (homeTeam === "Banks o' Dee" || awayTeam === "Banks o' Dee" || shouldIncludeFixture(homeTeam, awayTeam)) {
        results.push({
          id: index + 1,
          homeTeam,
          awayTeam,
          homeScore,
          awayScore,
          date: parsedDate,
          time: '15:00', // Usually not available for past results
          competition: competition || 'Highland League',
          isCompleted: true,
          venue
        });
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error scraping results:', error);
    throw error;
  }
};

// Function to fetch and parse the RSS feed for the latest news
export const scrapeRSSFeed = async (): Promise<any[]> => {
  try {
    const response = await fetch('http://www.highlandfootballleague.com/feed', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BanksODeeFC/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }
    
    const xml = await response.text();
    // Parsing XML would require a XML parser, but we can use cheerio in a basic way
    const $ = cheerio.load(xml, { xmlMode: true });
    
    const newsItems: any[] = [];
    const items = $('item');
    
    items.each((index, element) => {
      const title = $(element).find('title').text();
      const link = $(element).find('link').text();
      const description = $(element).find('description').text();
      const pubDate = $(element).find('pubDate').text();
      
      // Only include news relevant to Banks o' Dee
      if (title.includes("Banks o' Dee") || description.includes("Banks o' Dee")) {
        newsItems.push({
          id: index + 1,
          title,
          link,
          description,
          pubDate: new Date(pubDate).toISOString()
        });
      }
    });
    
    return newsItems;
  } catch (error) {
    console.error('Error scraping RSS feed:', error);
    throw error;
  }
};

// Helper function to parse dates in various formats
function parseDate(dateStr: string): string {
  try {
    // Handle various date formats
    const dateParts = dateStr.split(/[/\-\s]/);
    
    // If the date is already in YYYY-MM-DD format
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    
    // UK format: DD/MM/YYYY
    if (dateParts.length >= 3) {
      const day = parseInt(dateParts[0], 10).toString().padStart(2, '0');
      const month = parseInt(dateParts[1], 10).toString().padStart(2, '0');
      const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
      
      return `${year}-${month}-${day}`;
    }
    
    // If we can't parse the date, return today's date
    const today = new Date();
    return today.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    // Return today's date if we can't parse
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}

// Helper function to determine if we should include a fixture not involving Banks o' Dee
function shouldIncludeFixture(homeTeam: string, awayTeam: string): boolean {
  // For now, include all fixtures
  // You can customize this logic to only include fixtures that are most relevant
  return true;
}
