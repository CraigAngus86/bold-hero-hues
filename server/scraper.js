
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
    
    // Make the HTTP request to the BBC Sport website
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('Successfully fetched BBC Sport page');
    
    // Parse the HTML to extract the table data
    const $ = cheerio.load(html);
    
    // The table rows are typically in a table with a specific class
    const tableRows = $('.gs-o-table__row');
    if (!tableRows || tableRows.length === 0) {
      console.error('Could not find table rows in BBC Sport page');
      throw new Error('Could not find table rows in BBC Sport page');
    }
    
    // Extract data from each row
    const leagueData = [];
    let position = 1;
    
    tableRows.each((index, row) => {
      // Skip the header row
      if (index === 0) return;
      
      try {
        const cells = $(row).find('td');
        if (cells.length < 10) return;
        
        // Extract team name
        const teamNameElement = $(cells[0]).find('.gs-o-table__cell--left');
        const teamName = teamNameElement.text().trim();
        
        if (!teamName) return;
        
        // Extract other stats
        const played = parseInt($(cells[1]).text().trim() || '0');
        const won = parseInt($(cells[2]).text().trim() || '0');
        const drawn = parseInt($(cells[3]).text().trim() || '0');
        const lost = parseInt($(cells[4]).text().trim() || '0');
        const goalsFor = parseInt($(cells[5]).text().trim() || '0');
        const goalsAgainst = parseInt($(cells[6]).text().trim() || '0');
        const goalDifference = parseInt($(cells[7]).text().trim() || '0');
        const points = parseInt($(cells[8]).text().trim() || '0');
        
        // Extract form
        const formElement = $(cells[9]).find('.gs-o-status-icon');
        const form = [];
        formElement.each((i, el) => {
          const className = $(el).attr('class');
          if (className.includes('gs-o-status-icon--win')) form.push('W');
          else if (className.includes('gs-o-status-icon--draw')) form.push('D');
          else if (className.includes('gs-o-status-icon--loss')) form.push('L');
        });
        
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
    throw error;
  }
}

// Export the scraping functions
module.exports = {
  scrapeLeagueTable
};
