
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes the BBC Sport Highland League table
 * @returns {Promise<Array>} The league table data
 */
async function scrapeLeagueTable() {
  try {
    console.log('Scraping BBC Sport Highland League table');
    
    const url = 'https://www.bbc.com/sport/football/scottish-highland-league/table';
    
    // Make the HTTP request to the BBC Sport website with proper headers
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('Successfully fetched BBC Sport page');
    
    // Parse the HTML to extract the table data
    const $ = cheerio.load(html);
    
    // Target the correct table selector - BBC Sport specific
    const tableRows = $('.gs-o-table__row');
    if (!tableRows || tableRows.length === 0) {
      console.error('Could not find table rows in BBC Sport page');
      throw new Error('Could not find table rows in BBC Sport page');
    }
    
    // Extract data from each row
    const leagueData = [];
    
    tableRows.each((index, row) => {
      // Skip the header row
      if (index === 0) return;
      
      try {
        const cells = $(row).find('td');
        if (cells.length < 9) return; // Must have at least position through points
        
        // Position - first cell
        const position = parseInt($(cells[0]).text().trim(), 10);
        if (isNaN(position)) return; // Skip if not a valid team row
        
        // Extract team name - typically in first cell with team name class
        const teamNameElement = $(cells[0]).find('.gs-o-table__cell--left .qa-full-team-name');
        let teamName = teamNameElement.text().trim();
        
        if (!teamName) {
          // Alternative selector if the first one doesn't work
          teamName = $(cells[0]).find('.gs-o-table__cell--left').text().trim();
        }
        
        if (!teamName) return; // Skip if no team name found
        
        // Extract other stats - adjust indices based on BBC's table structure
        const played = parseInt($(cells[1]).text().trim() || '0', 10);
        const won = parseInt($(cells[2]).text().trim() || '0', 10);
        const drawn = parseInt($(cells[3]).text().trim() || '0', 10);
        const lost = parseInt($(cells[4]).text().trim() || '0', 10);
        const goalsFor = parseInt($(cells[5]).text().trim() || '0', 10);
        const goalsAgainst = parseInt($(cells[6]).text().trim() || '0', 10);
        const goalDifference = parseInt($(cells[7]).text().trim() || '0', 10);
        const points = parseInt($(cells[8]).text().trim() || '0', 10);
        
        // Extract form if available (may be in the last cell)
        const form = [];
        if (cells.length > 9) {
          const formCell = $(cells[9]);
          
          // Look for form icons
          formCell.find('.gs-o-status-icon, .gel-icon').each((i, el) => {
            const className = $(el).attr('class') || '';
            if (className.includes('win')) form.push('W');
            else if (className.includes('draw')) form.push('D');
            else if (className.includes('loss')) form.push('L');
          });
        }
        
        // Create a team stats object
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
    throw error;
  }
}

// Export the scraping functions
module.exports = {
  scrapeLeagueTable
};
