
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeagueTableEntry {
  position: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string[]
  logo?: string
}

/**
 * Safely parses an integer, returning 0 for invalid values
 * @param text - The text to parse
 * @returns The parsed integer or 0 if invalid
 */
function safeParseInt(text: string): number {
  if (!text) return 0;
  const value = parseInt(text.trim() || '0', 10);
  return isNaN(value) ? 0 : value;
}

/**
 * Standardize team names to match our database format
 * @param name - The raw team name from BBC
 * @returns - The standardized team name
 */
function standardizeTeamName(name: string): string {
  // Create a mapping of BBC team names to our standardized names
  const teamNameMapping: Record<string, string> = {
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
 * Extract form data from a table cell
 * @param $ - Cheerio instance
 * @param formCell - The form cell to extract data from
 * @returns Array of form results (W/D/L)
 */
function extractFormData($: cheerio.CheerioAPI, formCell: cheerio.Cheerio<cheerio.Element>): string[] {
  const form: string[] = [];
  
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Get authorization header
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'No authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Create a Supabase client with the auth header
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    // Create client with Auth header of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    { global: { headers: { Authorization: authHeader } } }
  )

  // Get request parameters
  let params: { action?: string; forceRefresh?: boolean } = {}
  try {
    params = await req.json()
  } catch (e) {
    // If no JSON body is provided, use default parameters
    params = { action: 'scrape-league-table', forceRefresh: false }
  }
  
  // Create log entry for this scrape operation
  const { data: logData, error: logError } = await supabaseClient
    .from('scrape_logs')
    .insert({
      source: 'highland_league',
      status: 'started'
    })
    .select()
    .single()

  if (logError) {
    console.error('Error creating log entry:', logError)
    return new Response(JSON.stringify({ error: 'Failed to create log entry' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const logId = logData.id

  try {
    // Set the URL based on the action requested
    let url = 'https://www.bbc.com/sport/football/scottish-highland-league/table'
    
    // Check if we should use the cached data
    if (!params.forceRefresh) {
      // Check when the data was last updated
      const { data: settingsData } = await supabaseClient
        .from('settings')
        .select('value')
        .eq('key', 'league_table_last_updated')
        .single()
        
      if (settingsData) {
        const lastUpdated = new Date(settingsData.value)
        const now = new Date()
        const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)
        
        // If the data was updated less than 12 hours ago, return the existing data
        if (hoursSinceUpdate < 12) {
          console.log(`Data was updated ${hoursSinceUpdate.toFixed(2)} hours ago, using cached data`)
          
          // Get the current table data
          const { data: tableData, error: tableError } = await supabaseClient
            .from('highland_league_table')
            .select('*')
            .order('position', { ascending: true })
          
          if (tableError) {
            throw new Error(`Failed to fetch cached data: ${tableError.message}`)
          }
          
          // Update log entry
          await supabaseClient
            .from('scrape_logs')
            .update({
              status: 'completed',
              items_found: tableData.length,
              items_updated: 0,
              error_message: 'Used cached data, no update needed'
            })
            .eq('id', logId)
            
          return new Response(JSON.stringify({
            success: true,
            message: 'Using cached data (updated within last 12 hours)',
            data: tableData,
            count: tableData.length
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      }
    }
    
    console.log(`Scraping data from ${url}`)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
    }
    
    const htmlContent = await response.text()
    const $ = cheerio.load(htmlContent)
    
    // Find the table - try different selectors as BBC might change their format
    const possibleTableSelectors = [
      'table.gs-o-table',
      'table.sp-c-table',
      'table.gel-table',
      'table'
    ]
    
    let tableElement: cheerio.Cheerio<cheerio.Element> | null = null
    for (const selector of possibleTableSelectors) {
      const found = $(selector)
      if (found.length > 0) {
        tableElement = found.first()
        console.log(`Found table using selector: ${selector}`)
        break
      }
    }
    
    if (!tableElement) {
      throw new Error('League table not found on the page')
    }
    
    const tableRows = tableElement.find('tbody tr')
    console.log(`Found ${tableRows.length} rows in the table`)
    
    const leagueTable: LeagueTableEntry[] = []
    
    tableRows.each((index, element) => {
      // Skip header rows or rows with header cells
      if ($(element).find('th').length > 0) {
        return
      }
      
      const cells = $(element).find('td')
      
      // Skip rows with insufficient cells
      if (cells.length < 10) {
        console.log(`Skipping row ${index}: insufficient cells (${cells.length})`)
        return
      }
      
      try {
        // Extract position (first column)
        const position = safeParseInt($(cells[0]).text())
        
        // Extract team name (second column)
        let teamName = $(cells[1]).text().trim()
        
        // Try to find team name in nested elements if the direct text is empty
        if (!teamName || teamName.length <= 1) {
          teamName = $(cells[1]).find('a, span').first().text().trim()
        }
        
        // Standardize team name
        teamName = standardizeTeamName(teamName)
        
        if (!position || !teamName) {
          console.log(`Skipping row ${index}: invalid position or team name`)
          return
        }
        
        // Extract stats
        const played = safeParseInt($(cells[2]).text())
        const won = safeParseInt($(cells[3]).text())
        const drawn = safeParseInt($(cells[4]).text())
        const lost = safeParseInt($(cells[5]).text())
        const goalsFor = safeParseInt($(cells[6]).text())
        const goalsAgainst = safeParseInt($(cells[7]).text())
        
        // Goal difference - either parse from table or calculate
        const goalDifferenceFromTable = safeParseInt($(cells[8]).text()) 
        const calculatedGoalDifference = goalsFor - goalsAgainst
        
        // Use calculated value as fallback
        const goalDifference = isNaN(goalDifferenceFromTable) ? 
          calculatedGoalDifference : goalDifferenceFromTable
        
        // Points - either parse from table or calculate
        const pointsFromTable = safeParseInt($(cells[9]).text())
        const calculatedPoints = won * 3 + drawn
        
        // Validate points
        const points = isNaN(pointsFromTable) ? calculatedPoints : pointsFromTable
        
        // Extract form data if available
        let form: string[] = []
        if (cells.length > 10) {
          form = extractFormData($, $(cells[10]))
        }
        
        // Extract team logo if available
        let logo = ''
        const img = $(element).find('img').first()
        if (img.length > 0) {
          logo = img.attr('src') || ''
        }
        
        // Add the team to our league table
        leagueTable.push({
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
          form,
          logo
        })
        
        console.log(`Processed: ${position}. ${teamName} - P:${played}, W:${won}, D:${drawn}, L:${lost}, Pts:${points}`)
      } catch (cellError) {
        console.error(`Error processing row ${index}:`, cellError)
      }
    })
    
    // Validate the data
    if (leagueTable.length === 0) {
      throw new Error('No teams found in the table')
    }
    
    if (leagueTable.length < 10 || leagueTable.length > 20) {
      console.warn(`Unusual number of teams found: ${leagueTable.length} (expected ~18)`)
    }
    
    // Sort by position
    leagueTable.sort((a, b) => a.position - b.position)
    
    // Clear existing data and insert new data
    const { error: deleteError } = await supabaseClient
      .from('highland_league_table')
      .delete()
      .not('id', 'is', null) // Delete all rows
    
    if (deleteError) {
      throw new Error(`Error clearing table data: ${deleteError.message}`)
    }
    
    // Insert new data
    const { data: insertedData, error: insertError } = await supabaseClient
      .from('highland_league_table')
      .insert(leagueTable)
      .select()
    
    if (insertError) {
      throw new Error(`Error inserting data: ${insertError.message}`)
    }
    
    // Update the last updated timestamp
    const now = new Date().toISOString()
    await supabaseClient
      .from('settings')
      .upsert({
        key: 'league_table_last_updated',
        value: now
      })
    
    // Update log entry with success
    await supabaseClient
      .from('scrape_logs')
      .update({
        status: 'completed',
        items_found: leagueTable.length,
        items_added: insertedData.length
      })
      .eq('id', logId)
    
    // Return the scraped data
    return new Response(JSON.stringify({
      success: true,
      data: leagueTable,
      count: leagueTable.length,
      message: `Successfully scraped and updated Highland League table with ${leagueTable.length} entries`
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Scraping error:', error)
    
    // Update log entry with error
    await supabaseClient
      .from('scrape_logs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : String(error)
      })
      .eq('id', logId)
    
    // Return error response
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/scrape-highland-league' \
//   --header 'Authorization: Bearer <supabase-jwt-token>' \
//   --header 'Content-Type: application/json'
