
import cheerio from 'cheerio';
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
    const response = await fetch('http://www.highlandfootballleague.com/table', {
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
    const tableRows = $('table.leaguetable tbody tr');
    
    tableRows.each((index, element) => {
      const cells = $(element).find('td');
      
      // Extract the data from each cell
      const position = parseInt($(cells[0]).text().trim(), 10);
      const team = $(cells[1]).text().trim();
      const played = parseInt($(cells[2]).text().trim(), 10);
      const won = parseInt($(cells[3]).text().trim(), 10);
      const drawn = parseInt($(cells[4]).text().trim(), 10);
      const lost = parseInt($(cells[5]).text().trim(), 10);
      const goalsFor = parseInt($(cells[6]).text().trim(), 10);
      const goalsAgainst = parseInt($(cells[7]).text().trim(), 10);
      const points = parseInt($(cells[9]).text().trim(), 10);
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
    
    return leagueTable;
  } catch (error) {
    console.error('Error scraping league table:', error);
    throw error;
  }
};

// Function to scrape fixtures
export const scrapeFixtures = async (): Promise<Match[]> => {
  try {
    const response = await fetch('http://www.highlandfootballleague.com/fixtures', {
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
    const fixtureRows = $('.fixture');
    
    fixtureRows.each((index, element) => {
      const date = $(element).find('.date').text().trim();
      const parsedDate = parseDate(date);
      
      const competition = $(element).find('.competition').text().trim();
      const homeTeam = $(element).find('.home_team').text().trim();
      const awayTeam = $(element).find('.away_team').text().trim();
      const venue = $(element).find('.venue').text().trim() || 'TBC';
      const time = $(element).find('.time').text().trim() || '15:00';
      
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
    const response = await fetch('http://www.highlandfootballleague.com/results', {
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
    const resultRows = $('.result');
    
    resultRows.each((index, element) => {
      const date = $(element).find('.date').text().trim();
      const parsedDate = parseDate(date);
      
      const competition = $(element).find('.competition').text().trim();
      const homeTeam = $(element).find('.home_team').text().trim();
      const awayTeam = $(element).find('.away_team').text().trim();
      const scoreText = $(element).find('.score').text().trim();
      const venue = $(element).find('.venue').text().trim() || 'Unknown';
      
      // Parse score
      const scoreParts = scoreText.split('-');
      const homeScore = parseInt(scoreParts[0].trim(), 10);
      const awayScore = parseInt(scoreParts[1].trim(), 10);
      
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
