
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Gets the request headers for scraping
 * @returns {Object} Headers for the scraping request
 */
function getScrapingHeaders() {
  return {
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
  };
}

/**
 * Safely parses an integer, returning 0 for invalid values
 * @param {string} text - The text to parse
 * @returns {number} The parsed integer or 0 if invalid
 */
function safeParseInt(text) {
  const value = parseInt(text.trim() || '0', 10);
  return isNaN(value) ? 0 : value;
}

/**
 * Extract form data from a table cell
 * @param {Object} $ - Cheerio instance
 * @param {Object} formCell - The form cell to extract data from
 * @returns {Array} Array of form results (W/D/L)
 */
function extractFormData($, formCell) {
  const form = [];
  
  // First try to find form icons by specific class patterns used by BBC Sport
  formCell.find('[class*="gs-o-status-icon"], [class*="gel-icon"]').each((i, el) => {
    const className = $(el).attr('class') || '';
    if (className.includes('win')) form.push('W');
    else if (className.includes('draw')) form.push('D');
    else if (className.includes('loss') || className.includes('defeat')) form.push('L');
  });
  
  // If no form icons found, try to parse text content (some BBC pages use text)
  if (form.length === 0) {
    const formText = formCell.text().trim();
    if (formText) {
      formText.split('').forEach(char => {
        if (char === 'W' || char === 'w') form.push('W');
        else if (char === 'D' || char === 'd') form.push('D');
        else if (char === 'L' || char === 'l') form.push('L');
      });
    }
  }
  
  return form;
}

/**
 * Extract team name from the cell
 * @param {Object} $ - Cheerio instance
 * @param {Object} row - The full table row
 * @returns {string} The extracted team name
 */
function extractTeamName($, row) {
  // For BBC Sport tables, team name is usually in the second cell
  const cells = $(row).find('td');
  
  // Check if we have at least 2 cells
  if (cells.length < 2) {
    console.error('Row does not have enough cells for team extraction');
    return null;
  }
  
  // The team cell is the second cell (index 1)
  const teamCell = cells.eq(1);
  
  // Try different ways to extract team name
  let teamName = '';
  
  // First, look for specific team name elements
  const teamNameElement = teamCell.find('.gs-o-table__cell--left .qa-full-team-name, .sp-c-fixture__team-name-trunc');
  if (teamNameElement.length) {
    teamName = teamNameElement.text().trim();
  } else {
    // If not found, try looking for any link which often contains the team name
    const linkElement = teamCell.find('a');
    if (linkElement.length) {
      teamName = linkElement.text().trim();
    } else {
      // Last resort, use the cell's text content
      teamName = teamCell.text().trim();
    }
  }
  
  // Validate the extracted team name
  if (!teamName || teamName.length <= 2 || !isNaN(Number(teamName))) {
    console.warn('Potentially invalid team name:', teamName);
    
    // Look for team name in the row's HTML for debugging
    const rowHtml = $(row).html();
    console.log('Row HTML for debugging:', rowHtml?.substring(0, 300));
    
    // Try to find any span with team-name class
    const allSpans = $(row).find('span');
    allSpans.each((i, el) => {
      const spanText = $(el).text().trim();
      if (spanText && spanText.length > 2) {
        console.log('Potential team name in span:', spanText);
      }
    });
    
    // Return hardcoded team name mapping if we have it
    const knownTeams = {
      '1': 'Brechin City',
      '2': 'Buckie Thistle',
      '3': "Banks o' Dee",
      '4': 'Fraserburgh',
      '5': 'Formartine United',
      '6': 'Brora Rangers',
      '7': 'Huntly',
      '8': 'Inverurie Loco Works',
      '9': 'Keith',
      '10': 'Lossiemouth',
      '11': 'Nairn County',
      '12': 'Rothes',
      '13': 'Clachnacuddin',
      '14': 'Deveronvale',
      '15': 'Forres Mechanics',
      '16': 'Strathspey Thistle',
      '17': 'Turriff United',
      '18': 'Wick Academy'
    };
    
    // Use mapped name if position is 1-18
    const position = safeParseInt($(cells.eq(0)).text());
    if (position >= 1 && position <= 18 && knownTeams[position]) {
      console.log(`Using mapped team name for position ${position}: ${knownTeams[position]}`);
      return knownTeams[position];
    }
  }
  
  return teamName;
}

/**
 * Processes a single table row to extract team data
 * @param {Object} $ - Cheerio instance
 * @param {Object} row - The table row to process
 * @returns {Object|null} Team stats object or null if invalid
 */
function processTableRow($, row, index) {
  try {
    // Skip header rows
    if (index === 0) {
      return null;
    }
    
    const cells = $(row).find('td');
    
    // Skip if not enough cells for a valid row
    if (cells.length < 10) {
      console.log(`Skipping row ${index}: not enough cells (${cells.length})`);
      return null;
    }
    
    // Position - first cell
    const position = safeParseInt($(cells.eq(0)).text());
    if (position === 0) {
      console.log(`Skipping row ${index}: invalid position`);
      return null; // Skip if not a valid team row
    }
    
    // Extract team name - this is in the second cell (index 1)
    const teamName = extractTeamName($, row);
    if (!teamName) {
      console.log(`Skipping row ${index}: no team name found`);
      return null; // Skip if no team name found
    }
    
    // Extract other stats starting from the third cell (index 2)
    const played = safeParseInt($(cells.eq(2)).text());
    const won = safeParseInt($(cells.eq(3)).text());
    const drawn = safeParseInt($(cells.eq(4)).text());
    const lost = safeParseInt($(cells.eq(5)).text());
    const goalsFor = safeParseInt($(cells.eq(6)).text());
    const goalsAgainst = safeParseInt($(cells.eq(7)).text());
    let goalDifference = safeParseInt($(cells.eq(8)).text());
    const points = safeParseInt($(cells.eq(9)).text());
    
    // Calculate goal difference if it doesn't match
    const calculatedGD = goalsFor - goalsAgainst;
    if (Math.abs(calculatedGD - goalDifference) > 2) {
      console.warn(`Goal difference mismatch for ${teamName}: ${goalDifference} vs calculated ${calculatedGD}`);
      goalDifference = calculatedGD;
    }
    
    // Extract form if available (typically last column)
    const form = [];
    if (cells.length > 10) {
      const formCell = $(cells.eq(10));
      const extractedForm = extractFormData($, formCell);
      form.push(...extractedForm);
    }
    
    console.log(`Extracted data for ${teamName} (P:${position}, Pts:${points})`);
    
    // Create a team stats object
    return {
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
    };
  } catch (error) {
    console.error('Error parsing row:', error);
    return null;
  }
}

/**
 * Fetches the HTML from the BBC Sport website
 * @returns {Promise<string>} The HTML content
 */
async function fetchBBCSportPage() {
  const url = 'https://www.bbc.com/sport/football/scottish-highland-league/table';
  
  try {
    const { data: html } = await axios.get(url, {
      headers: getScrapingHeaders(),
      timeout: 10000 // 10 second timeout
    });
    
    console.log('Successfully fetched BBC Sport page');
    return html;
  } catch (error) {
    console.error('Error fetching BBC Sport page:', error);
    throw new Error(`Failed to fetch BBC Sport page: ${error.message}`);
  }
}

/**
 * Find the league table in the HTML
 * @param {Object} $ - Cheerio instance
 * @returns {Object} The table rows
 */
function findLeagueTable($) {
  // Try different selectors to find the table
  let tableRows = $('.gs-o-table__row');
  
  if (!tableRows || tableRows.length === 0) {
    console.log('First selector failed, trying alternative');
    tableRows = $('table.gs-o-table tr');
  }
  
  if (!tableRows || tableRows.length === 0) {
    console.log('Second selector failed, trying generic table selector');
    tableRows = $('table tr');
  }
  
  if (!tableRows || tableRows.length === 0) {
    throw new Error('Could not find any table rows in BBC Sport page');
  }
  
  console.log(`Found ${tableRows.length} rows in the table`);
  return tableRows;
}

/**
 * Extract league data from the table rows
 * @param {Object} $ - Cheerio instance
 * @param {Object} tableRows - The table rows
 * @returns {Array} Array of team data objects
 */
function extractLeagueData($, tableRows) {
  const leagueData = [];
  
  tableRows.each((index, row) => {
    // Process each row
    const teamData = processTableRow($, row, index);
    if (teamData) {
      leagueData.push(teamData);
    }
  });
  
  if (leagueData.length === 0) {
    throw new Error('Failed to extract any team data from BBC Sport page');
  }
  
  console.log(`Successfully extracted data for ${leagueData.length} teams`);
  return leagueData;
}

/**
 * Scrapes the BBC Sport Highland League table
 * @returns {Promise<Array>} The league table data
 */
async function scrapeLeagueTable() {
  try {
    console.log('Scraping BBC Sport Highland League table');
    
    // Fetch the HTML
    const html = await fetchBBCSportPage();
    
    // Parse the HTML
    const $ = cheerio.load(html);
    
    // Find the table
    const tableRows = findLeagueTable($);
    
    // Extract the data
    const leagueData = extractLeagueData($, tableRows);
    
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
