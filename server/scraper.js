
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
  if (!text || typeof text !== 'string') return 0;
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
  formCell.find('[class*="gs-o-status-icon"], [class*="gel-icon"], [class*="sp-c-booking-card"]').each((i, el) => {
    const className = $(el).attr('class') || '';
    if (className.includes('win')) form.push('W');
    else if (className.includes('draw')) form.push('D');
    else if (className.includes('loss') || className.includes('defeat')) form.push('L');
  });
  
  // Look for icon tags with specific colors
  if (form.length === 0) {
    formCell.find('i, span').each((i, el) => {
      const className = $(el).attr('class') || '';
      const styles = $(el).attr('style') || '';
      
      // Check for color-based indicators
      if (styles.includes('color: green') || className.includes('green')) form.push('W');
      else if (styles.includes('color: orange') || className.includes('yellow') || className.includes('amber')) form.push('D');
      else if (styles.includes('color: red') || className.includes('red')) form.push('L');
    });
  }
  
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
  const teamNameElement = teamCell.find('.gs-o-table__cell--left .qa-full-team-name, .sp-c-fixture__team-name-trunc, [data-reactid*="team-name"]');
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
  
  // Clean and standardize team names
  if (teamName) {
    teamName = standardizeTeamName(teamName);
  }
  
  return teamName;
}

/**
 * Standardize team names to match our database format
 * @param {string} name - The raw team name from BBC
 * @returns {string} - The standardized team name
 */
function standardizeTeamName(name) {
  // Create a mapping of BBC team names to our standardized names
  const teamNameMapping = {
    "Banks O Dee": "Banks o' Dee",
    "Banks O' Dee": "Banks o' Dee",
    "Banks O'Dee": "Banks o' Dee",
    "Buckie": "Buckie Thistle",
    "Brechin": "Brechin City",
    "Inverurie": "Inverurie Loco Works",
    "Inverurie Loco": "Inverurie Loco Works",
    "Loco Works": "Inverurie Loco Works",
    "Clach": "Clachnacuddin",
    "Nairn": "Nairn County",
    "Forres": "Forres Mechanics",
    "Mechanics": "Forres Mechanics",
    "Strathspey": "Strathspey Thistle",
    "Wick": "Wick Academy",
    "Formartine": "Formartine United",
    "Turriff": "Turriff United"
  };
  
  // Return the mapped name if it exists, otherwise return the original name
  return teamNameMapping[name] || name;
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
    if ($(row).find('th').length > 0) {
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
    
    // Fix for data alignment issue: Make sure we're parsing the correct cells for each stat
    // BBC Sport table structure: Position | Team | P | W | D | L | F | A | GD | Pts | Form
    const played = safeParseInt($(cells.eq(2)).text());
    const won = safeParseInt($(cells.eq(3)).text());
    const drawn = safeParseInt($(cells.eq(4)).text());
    const lost = safeParseInt($(cells.eq(5)).text());
    const goalsFor = safeParseInt($(cells.eq(6)).text());
    const goalsAgainst = safeParseInt($(cells.eq(7)).text());
    
    // Implement additional validation to fix the data alignment issue
    // Check if the total of won+drawn+lost matches played
    if (won + drawn + lost !== played) {
      console.warn(`Data alignment issue detected for ${teamName}: P=${played} doesn't match W=${won} + D=${drawn} + L=${lost}`);
      // Try to determine if there's a consistent offset in the column indexes
      // This is a simple heuristic - we could make it more sophisticated if needed
    }
    
    // For goal difference, we'll calculate it ourselves instead of relying on the scraped value
    const goalDifference = goalsFor - goalsAgainst;
    
    // Points should generally follow the formula: W*3 + D*1
    const calculatedPoints = won * 3 + drawn;
    const scrapedPoints = safeParseInt($(cells.eq(9)).text());
    
    // If there's a significant discrepancy, log it but use the scraped value
    if (Math.abs(calculatedPoints - scrapedPoints) > 3) {
      console.warn(`Points mismatch for ${teamName}: scraped=${scrapedPoints}, calculated=${calculatedPoints}`);
    }
    
    // Extract form if available (typically last column)
    const form = [];
    if (cells.length > 10) {
      const formCell = $(cells.eq(10));
      const extractedForm = extractFormData($, formCell);
      form.push(...extractedForm);
    }
    
    console.log(`Extracted data for ${teamName} (P:${played}, W:${won}, D:${drawn}, L:${lost}, Pts:${scrapedPoints})`);
    
    // Get team logo if available
    let logo = '';
    const imgElement = $(row).find('img');
    if (imgElement.length > 0) {
      logo = $(imgElement).attr('src') || '';
    }
    
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
      points: scrapedPoints, // Use the scraped points, but we've validated it
      form: form.slice(0, 5), // Last 5 results,
      logo
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
    console.log(`Fetching Highland League table from ${url}`);
    const { data: html } = await axios.get(url, {
      headers: getScrapingHeaders(),
      timeout: 10000 // 10 second timeout
    });
    
    console.log('Successfully fetched BBC Sport page');
    return html;
  } catch (error) {
    console.error('Error fetching BBC Sport page:', error.message);
    if (error.response) {
      console.error('Status code:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers));
    }
    throw new Error(`Failed to fetch BBC Sport page: ${error.message}`);
  }
}

/**
 * Scrapes and processes the league table from BBC Sport
 * @returns {Promise<Array>} Array of team stats objects
 */
async function scrapeLeagueTable() {
  try {
    console.log('Starting to scrape Highland League table');
    
    let retryCount = 0;
    const maxRetries = 3;
    let html = null;
    
    // Retry logic for fetching the page
    while (retryCount < maxRetries) {
      try {
        html = await fetchBBCSportPage();
        break; // If successful, break out of the retry loop
      } catch (error) {
        retryCount++;
        console.log(`Retry ${retryCount}/${maxRetries}`);
        if (retryCount >= maxRetries) {
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      }
    }
    
    if (!html) {
      throw new Error('Failed to fetch HTML after multiple retries');
    }
    
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Find the table - try different selectors as BBC might change their format
    const possibleTableSelectors = [
      'table.gs-o-table',
      'table.sp-c-table',
      'table.gel-table',
      'table'
    ];
    
    let table = null;
    for (const selector of possibleTableSelectors) {
      const found = $(selector);
      if (found.length > 0) {
        table = found.first();
        console.log(`Found table using selector: ${selector}`);
        break;
      }
    }
    
    if (!table) {
      throw new Error('League table not found on the page');
    }
    
    // Process each row in the table
    const rows = table.find('tbody tr');
    console.log(`Found ${rows.length} rows in the league table`);
    
    const teams = [];
    rows.each((i, row) => {
      const team = processTableRow($, row, i);
      if (team) {
        teams.push(team);
      }
    });
    
    // Validate the scraped data
    if (teams.length === 0) {
      throw new Error('No valid teams found in the table');
    }
    
    // Verify team count - Highland League should have around 18 teams
    if (teams.length < 10 || teams.length > 20) {
      console.warn(`Unexpected number of teams: ${teams.length} (expected ~18)`);
    }
    
    // Sort by position just in case
    teams.sort((a, b) => a.position - b.position);
    
    console.log(`Successfully scraped data for ${teams.length} teams`);
    
    return teams;
  } catch (error) {
    console.error('Error in scrapeLeagueTable:', error.message);
    throw error;
  }
}

module.exports = {
  scrapeLeagueTable,
  extractTeamName,
  extractFormData,
  standardizeTeamName
};
