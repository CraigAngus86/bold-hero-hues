
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

// CORS headers to ensure the function can be called from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Constants
const SCRAPE_URL = 'https://www.bbc.com/sport/football/scottish-highland-league/table'
const CACHE_TIMEOUT = 6 * 60 * 60 * 1000 // 6 hours in milliseconds
const FETCH_TIMEOUT = 10000 // 10 seconds

/**
 * Returns CORS headers for preflight requests
 */
function handleCorsPreflightRequest() {
  return new Response('ok', { headers: corsHeaders })
}

/**
 * Creates a Supabase client with the Admin key
 * @returns Supabase client instance
 */
function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  return createClient(supabaseUrl, supabaseKey)
}

/**
 * Checks if we should perform a fresh scrape
 * @param supabase Supabase client
 * @param forceRefresh Whether to force a refresh regardless of last scrape time
 * @returns Boolean indicating if we should scrape, and the last scrape timestamp
 */
async function shouldPerformScrape(supabase, forceRefresh) {
  console.log(`Edge Function: Force refresh requested: ${forceRefresh}`)

  // Check last scrape time from Supabase
  const { data: settingsData, error: settingsError } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'last_scrape_time')
    .single()

  if (settingsError && settingsError.code !== 'PGRST116') {
    console.error('Edge Function: Error fetching settings:', settingsError)
  }

  const lastScrapeTime = settingsData?.value ? new Date(settingsData.value) : null
  const currentTime = new Date()
  
  // Only scrape if forced or if last scrape was more than cache timeout
  const shouldScrape = forceRefresh || 
    !lastScrapeTime || 
    (currentTime.getTime() - lastScrapeTime.getTime() > CACHE_TIMEOUT)

  console.log(`Edge Function: Should scrape: ${shouldScrape}, Last scrape: ${lastScrapeTime?.toISOString() || 'never'}`)
  
  return { shouldScrape, lastScrapeTime }
}

/**
 * Fetches cached data from Supabase
 * @param supabase Supabase client
 * @param lastScrapeTime The timestamp of the last scrape
 * @returns The cached data response
 */
async function fetchCachedData(supabase, lastScrapeTime) {
  console.log('Edge Function: Using cached data')
  // Return the cached data from Supabase
  const { data: cachedData, error: fetchError } = await supabase
    .from('highland_league_table')
    .select('*')
    .order('position', { ascending: true })

  if (fetchError) {
    console.error('Edge Function: Failed to fetch cached data:', fetchError)
    throw new Error(`Failed to fetch cached data: ${fetchError.message}`)
  }

  return {
    success: true,
    message: 'Returning cached data',
    data: cachedData,
    lastUpdated: lastScrapeTime
  }
}

/**
 * Configures the request headers for scraping
 * @returns Headers object for the fetch request
 */
function getScrapingHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Cache-Control': 'max-age=0'
  }
}

/**
 * Safely parses an integer, returning 0 for invalid values
 * @param text The text to parse
 * @returns The parsed integer or 0 if invalid
 */
function safeParseInt(text) {
  if (!text || typeof text !== 'string') return 0;
  const value = parseInt(text.trim() || '0', 10)
  return isNaN(value) ? 0 : value
}

/**
 * Extract form data from a table cell
 * @param $ Cheerio instance
 * @param formCell The form cell to extract data from
 * @returns Array of form results (W/D/L)
 */
function extractFormData($, formCell) {
  const form = []
  
  // Debug the form cell structure
  console.log('Edge Function: Form cell HTML:', $(formCell).html()?.substring(0, 200))
  
  // First try to find form icons by class names or specific elements
  formCell.find('[class*="gs-o-status-icon"], [class*="gel-icon"], [class*="form"]').each((i, el) => {
    const className = $(el).attr('class') || ''
    const text = $(el).text().trim()
    
    // Try to determine result from class name
    if (className.includes('win')) form.push('W')
    else if (className.includes('draw')) form.push('D')
    else if (className.includes('loss') || className.includes('defeat')) form.push('L')
    // If class name doesn't work, try the text content
    else if (text === 'W') form.push('W')
    else if (text === 'D') form.push('D')
    else if (text === 'L') form.push('L')
  })
  
  // If no form icons found, try parsing text content directly
  if (form.length === 0) {
    const formText = $(formCell).text().trim()
    if (formText) {
      formText.split('').forEach(char => {
        if (char === 'W' || char === 'w') form.push('W')
        else if (char === 'D' || char === 'd') form.push('D')
        else if (char === 'L' || char === 'l') form.push('L')
      })
    }
  }
  
  console.log(`Edge Function: Extracted form data: ${form.join(', ')}`)
  return form
}

/**
 * Improved team name extraction with additional debugging
 * @param $ Cheerio instance
 * @param cell The cell containing team name
 * @returns The extracted team name or null if invalid
 */
function extractTeamName($, cell) {
  // First, dump the full HTML of the cell for debugging
  const cellHTML = $(cell).html();
  console.log('Edge Function: Raw team cell HTML:', cellHTML?.substring(0, 300));
  
  // Try different strategies to get the team name
  // 1. Look for specific team name classes
  let teamNameElement = $(cell).find('.sp-c-fixture__team-name-trunc, .qa-full-team-name, .sp-c-fixture__team-name');
  let teamName = teamNameElement.text().trim();
  
  // 2. If that fails, try to find any anchor tags which often contain the team name
  if (!teamName || teamName.length <= 2) {
    teamNameElement = $(cell).find('a');
    teamName = teamNameElement.text().trim();
    console.log('Edge Function: Trying to extract from anchor:', teamName);
  }
  
  // 3. Look for a span with the team name
  if (!teamName || teamName.length <= 2) {
    teamNameElement = $(cell).find('span[data-team-name], span.team-name');
    teamName = teamNameElement.text().trim();
    console.log('Edge Function: Trying to extract from span with team name:', teamName);
  }
  
  // 4. If we still don't have a name, get the text content directly
  if (!teamName || teamName.length <= 2) {
    teamName = $(cell).text().trim();
    console.log('Edge Function: Extracting from raw cell text:', teamName);
    
    // Split by common separators that might be in the cell
    if (teamName.includes('|')) {
      // Format might be "Team name | Extra info"
      teamName = teamName.split('|')[0].trim();
      console.log('Edge Function: Split by |:', teamName);
    }
  }
  
  // Clean up the team name - remove common prefixes/suffixes BBC might add
  teamName = teamName
    .replace(/^team /, '')
    .replace(/ FC$/, '')
    .trim();
  
  // Validate the team name - check if it's just a number
  if (!teamName || teamName.length <= 2 || !isNaN(Number(teamName))) {
    console.error('Edge Function: Invalid team name detected:', teamName);
    
    // Return a more descriptive placeholder for debugging
    return `Unknown Team (${teamName || 'empty'})`;
  }
  
  console.log(`Edge Function: Final extracted team name: "${teamName}"`);
  return teamName;
}

/**
 * Improved team name mapping to correct known teams
 * @param teamName The extracted team name
 * @returns The corrected team name
 */
function mapTeamName(teamName) {
  // Map of common misextracted names to correct names
  const teamNameMap = {
    '31': 'Buckie Thistle',
    '32': 'Brechin City',
    '33': "Banks o' Dee",
    // Add more mappings as needed
  };
  
  // If the team name is in our mapping, use the correct name
  if (teamNameMap[teamName]) {
    console.log(`Edge Function: Mapped team name from "${teamName}" to "${teamNameMap[teamName]}"`);
    return teamNameMap[teamName];
  }
  
  // If team name is just a number, use a fallback name
  if (!isNaN(Number(teamName))) {
    return `Team ${teamName}`;
  }
  
  return teamName;
}

/**
 * Process a single table row to extract team data
 * @param $ Cheerio instance
 * @param row The row element to process
 * @param index Row index
 * @returns Team data object or null if invalid
 */
function processTableRow($, row, index) {
  // Skip header rows
  if (index === 0) {
    console.log('Edge Function: Skipping header row');
    return null;
  }
  
  try {
    // Get all cells from the row
    const cells = $(row).find('td');
    
    // Debug info about the row
    console.log(`Edge Function: Processing row ${index} with ${cells.length} cells`);
    
    // BBC Sport sometimes has additional hidden cells or different layouts
    // We need at least 9 cells for position through points
    if (cells.length < 9) {
      console.log(`Edge Function: Not enough cells (${cells.length}) in row ${index}, skipping`);
      return null;
    }
    
    // Extract position - usually the first cell but can vary
    let position = 0;
    let positionText = $(cells[0]).text().trim();
    position = safeParseInt(positionText);
    
    if (isNaN(position) || position === 0) {
      console.log(`Edge Function: Invalid position "${positionText}" in row ${index}, trying to detect position`);
      
      // Try to detect position from row attributes or other sources
      const rowClasses = $(row).attr('class') || '';
      if (rowClasses.includes('position-')) {
        const match = rowClasses.match(/position-(\d+)/);
        if (match && match[1]) {
          position = parseInt(match[1], 10);
          console.log(`Edge Function: Detected position ${position} from class`);
        }
      }
      
      // If still no valid position, use the index (+1)
      if (position === 0) {
        position = index;
        console.log(`Edge Function: Using index ${position} as position`);
      }
    }
    
    // Extract team name - improved extraction
    let teamCell = cells[1];
    let rawTeamName = extractTeamName($, teamCell);
    
    // Apply name mapping to fix known issues
    let teamName = mapTeamName(rawTeamName);
    
    if (!teamName || teamName === 'Unknown Team (empty)') {
      console.log(`Edge Function: No team name found in row ${index}, skipping`);
      return null;
    }
    
    // Map data fields - account for possible variations in column order
    let cellOffset = 0;
    // Some tables have a "promoted/relegated" column which offsets everything
    if (cells.length > 11) {
      const secondCellText = $(cells[2]).text().trim();
      if (secondCellText.match(/^[PD]$/i) || !secondCellText.match(/^\d+$/)) {
        cellOffset = 1;
        console.log(`Edge Function: Detected extra column, using offset ${cellOffset}`);
      }
    }
    
    const played = safeParseInt($(cells[2 + cellOffset]).text());
    const won = safeParseInt($(cells[3 + cellOffset]).text());
    const drawn = safeParseInt($(cells[4 + cellOffset]).text());
    const lost = safeParseInt($(cells[5 + cellOffset]).text());
    const goalsFor = safeParseInt($(cells[6 + cellOffset]).text());
    const goalsAgainst = safeParseInt($(cells[7 + cellOffset]).text());
    
    // Some tables combine GD and Points, others have them separately
    let goalDifference = 0;
    let points = 0;
    
    // Try to parse goal difference from dedicated column
    if (cells.length >= 9 + cellOffset) {
      goalDifference = safeParseInt($(cells[8 + cellOffset]).text());
      
      // If we have another column, it's likely points
      if (cells.length >= 10 + cellOffset) {
        points = safeParseInt($(cells[9 + cellOffset]).text());
      } else {
        // Calculate points if not provided (3 for win, 1 for draw)
        points = (won * 3) + drawn;
      }
    } else {
      // Calculate goal difference if not provided
      goalDifference = goalsFor - goalsAgainst;
      // Calculate points
      points = (won * 3) + drawn;
    }
    
    // Extract form if available (typically last column)
    const form = [];
    if (cells.length > 10 + cellOffset) {
      const formCell = $(cells[cells.length - 1]); // Last cell is usually form
      const extractedForm = extractFormData($, formCell);
      form.push(...extractedForm);
    }
    
    console.log(`Edge Function: Successfully extracted data for ${teamName} (P:${position}, Pts:${points})`);
    
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
      form: form.slice(0, 5), // Last 5 results
      logo: '', // Default logo field (can be updated later)
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Edge Function: Error parsing row ${index}:`, error);
    return null;
  }
}

/**
 * Find and extract the league table from HTML
 * @param $ Cheerio instance
 * @returns Array of team data objects
 */
function extractLeagueTable($) {
  console.log('Edge Function: Extracting league table from HTML');
  
  // Try various selectors that might contain the league table
  const tableSelectors = [
    'table.gs-o-table', // Standard BBC table
    'table.sp-c-table', // Another BBC sports table format
    'table.league-table', // Generic league table
    'table' // Last resort - any table
  ];
  
  let tableRows = null;
  let selectorUsed = '';
  
  // Try each selector until we find a table
  for (const selector of tableSelectors) {
    const table = $(selector);
    if (table.length > 0) {
      tableRows = table.find('tr');
      selectorUsed = selector;
      break;
    }
  }
  
  // If no table found with our selectors, try to find any table-like structure
  if (!tableRows || tableRows.length === 0) {
    console.log('Edge Function: No table found with standard selectors, trying to find any table-like structure');
    
    // Look for elements with table-like class names
    tableRows = $('[class*="table"] tr, [class*="league"] [class*="row"]');
    selectorUsed = 'custom';
  }
  
  if (!tableRows || tableRows.length === 0) {
    throw new Error('Could not find any table rows in the HTML');
  }
  
  console.log(`Edge Function: Found ${tableRows.length} rows using selector "${selectorUsed}"`);
  
  // Extract data from each row
  const leagueData = [];
  let skippedRows = 0;
  
  tableRows.each((index, row) => {
    const teamData = processTableRow($, row, index);
    if (teamData) {
      leagueData.push(teamData);
    } else {
      skippedRows++;
    }
  });
  
  console.log(`Edge Function: Extracted ${leagueData.length} teams, skipped ${skippedRows} rows`);
  
  if (leagueData.length === 0) {
    throw new Error('Failed to extract any team data from the HTML');
  }
  
  // Sort by position to ensure correct order
  return leagueData.sort((a, b) => a.position - b.position);
}

/**
 * Validates the extracted league data for common issues
 * @param leagueData The extracted league table data
 * @returns Boolean indicating if the data is valid
 */
function validateLeagueData(leagueData) {
  if (!leagueData || leagueData.length === 0) {
    console.error('Edge Function: No teams extracted');
    return false;
  }
  
  // Check for numeric team names
  const numericTeamNames = leagueData.filter(team => 
    !team.team || !isNaN(Number(team.team)) || team.team.length <= 2
  );
  
  if (numericTeamNames.length > 0) {
    console.error('Edge Function: Found numeric team names:', 
      numericTeamNames.map(t => `${t.position}: ${t.team}`).join(', ')
    );
    return false;
  }
  
  // Check for other potential issues
  let invalidData = false;
  
  leagueData.forEach(team => {
    // Check if points calculation seems reasonable
    const calculatedPoints = (team.won * 3) + team.drawn;
    if (Math.abs(calculatedPoints - team.points) > 3) {
      console.error(`Edge Function: Unusual points calculation for ${team.team}: ${team.points} vs calculated ${calculatedPoints}`);
      invalidData = true;
    }
    
    // Check for negative values
    if (team.played < 0 || team.won < 0 || team.drawn < 0 || team.lost < 0) {
      console.error(`Edge Function: Negative values for ${team.team}`);
      invalidData = true;
    }
    
    // Check if games played equals sum of results
    if (team.played !== (team.won + team.drawn + team.lost)) {
      console.error(`Edge Function: Game count mismatch for ${team.team}: ${team.played} vs ${team.won + team.drawn + team.lost}`);
      invalidData = true;
    }
  });
  
  // Return true if no validation issues found
  return !invalidData;
}

/**
 * Scrape the BBC Sport Highland League table
 * @returns Array of team data objects
 */
async function scrapeHighlandLeagueTable() {
  console.log(`Edge Function: Scraping data from ${SCRAPE_URL}`);
  
  // Configure proper headers to avoid being blocked
  const headers = getScrapingHeaders();

  // Use a timeout for the fetch operation
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  
  try {
    const response = await fetch(SCRAPE_URL, {
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Edge Function: Failed to fetch data: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Edge Function: Successfully fetched BBC Sport page, length:', html.length);
    
    if (html.length < 1000) {
      console.error('Edge Function: HTML content suspiciously short, might be blocked');
      throw new Error('Received incomplete or blocked response from BBC Sport');
    }
    
    const $ = cheerio.load(html);
    const leagueData = extractLeagueTable($);
    
    // Validate the extracted data
    const isValid = validateLeagueData(leagueData);
    if (!isValid) {
      console.warn('Edge Function: Data validation warnings - proceeding with caution');
    }
    
    return leagueData;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Edge Function: Fetch error:', error);
    throw new Error(`Scraping failed: ${error.message}`);
  }
}

/**
 * Store the scraped data in Supabase
 * @param supabase Supabase client
 * @param leagueData The league data to store
 * @param currentTime The current timestamp
 */
async function storeDataInSupabase(supabase, leagueData, currentTime) {
  // First, clear existing data
  const { error: deleteError } = await supabase
    .from('highland_league_table')
    .delete()
    .neq('id', 0); // Delete all rows

  if (deleteError) {
    console.error('Edge Function: Error clearing existing data:', deleteError);
    throw new Error(`Failed to clear existing data: ${deleteError.message}`);
  }

  // Insert new data
  const { data: insertResult, error: insertError } = await supabase
    .from('highland_league_table')
    .insert(leagueData)
    .select();

  if (insertError) {
    console.error('Edge Function: Error inserting data:', insertError);
    throw new Error(`Failed to store scraped data: ${insertError.message}`);
  }

  // Update last scrape time
  await supabase
    .from('settings')
    .upsert({ key: 'last_scrape_time', value: currentTime.toISOString() });

  console.log(`Edge Function: Successfully stored ${leagueData.length} teams in Supabase`);
  return insertResult;
}

/**
 * Handle the status check action
 * @returns Response object with status information
 */
function handleStatusCheck() {
  console.log('Edge Function: Status check requested');
  return new Response(
    JSON.stringify({
      success: true,
      status: 'deployed',
      message: 'Edge Function is deployed and operational'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * Main edge function handler
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    // Create a Supabase client with the Admin key
    const supabase = createSupabaseClient();

    // Parse request
    const requestData = await req.json().catch(() => ({}));
    const { forceRefresh = false, action = null } = requestData;

    // Handle status check action
    if (action === 'status-check') {
      return handleStatusCheck();
    }

    console.log('Edge Function: Starting scrape operation');
    console.log('Edge Function: Request data:', JSON.stringify(requestData));
    
    // Check if we should perform a fresh scrape
    const { shouldScrape, lastScrapeTime } = await shouldPerformScrape(supabase, forceRefresh);

    if (!shouldScrape) {
      return new Response(
        JSON.stringify(await fetchCachedData(supabase, lastScrapeTime)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Scrape the BBC Sport Highland League table
    console.log('Edge Function: Starting fresh scrape');
    const leagueData = await scrapeHighlandLeagueTable();
    const currentTime = new Date();

    // Store the scraped data in Supabase
    const storedData = await storeDataInSupabase(supabase, leagueData, currentTime);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully scraped and stored Highland League data',
        data: leagueData,
        lastUpdated: currentTime.toISOString(),
        teamsCount: leagueData.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
        error: 'Failed to scrape Highland League data',
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
