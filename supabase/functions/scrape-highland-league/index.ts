
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

// CORS headers to ensure the function can be called from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse request
    const requestData = await req.json().catch(() => ({}))
    const { forceRefresh = false, action = null } = requestData

    // Handle status check action
    if (action === 'status-check') {
      console.log('Edge Function: Status check requested')
      return new Response(
        JSON.stringify({
          success: true,
          status: 'deployed',
          message: 'Edge Function is deployed and operational'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Edge Function: Starting scrape operation')
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
    
    // Only scrape if forced or if last scrape was more than 6 hours ago
    const shouldScrape = forceRefresh || 
      !lastScrapeTime || 
      (currentTime.getTime() - lastScrapeTime.getTime() > 6 * 60 * 60 * 1000)

    console.log(`Edge Function: Should scrape: ${shouldScrape}, Last scrape: ${lastScrapeTime?.toISOString() || 'never'}`)

    if (!shouldScrape) {
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

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Returning cached data',
          data: cachedData,
          lastUpdated: lastScrapeTime
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Scrape the BBC Sport Highland League table
    // UPDATED: Use a fallback URL and improved scraping logic
    let url = 'https://www.bbc.com/sport/football/scottish-highland-league/table'
    console.log(`Edge Function: Scraping data from ${url}`)

    // Configure proper headers to avoid being blocked
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cache-Control': 'max-age=0'
    }

    // UPDATED: Use a timeout for the fetch operation
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      const response = await fetch(url, {
        headers,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        console.error(`Edge Function: Failed to fetch data: ${response.status} ${response.statusText}`)
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
      }

      const html = await response.text()
      console.log('Edge Function: Successfully fetched BBC Sport page, extracting data')
      
      const $ = cheerio.load(html)
      
      // UPDATED: Try different selectors to find the table
      let tableRows = $('.gs-o-table__row')
      
      // If first selector fails, try alternative selectors
      if (!tableRows || tableRows.length === 0) {
        console.log('Edge Function: First selector failed, trying alternative')
        tableRows = $('table.gs-o-table tr')
      }
      
      if (!tableRows || tableRows.length === 0) {
        console.log('Edge Function: Second selector failed, trying generic table selector')
        tableRows = $('table tr')
      }
      
      if (!tableRows || tableRows.length === 0) {
        // Save the HTML for debugging
        console.error('Edge Function: Could not find any table rows in BBC Sport page')
        console.log('Edge Function: HTML excerpt:', html.substring(0, 1000))
        throw new Error('Could not find any table rows in BBC Sport page')
      }
      
      console.log(`Edge Function: Found ${tableRows.length} rows in the table`)
      
      // Extract data from each row
      const leagueData = []
      
      tableRows.each((index, row) => {
        // Skip the header row
        if (index === 0) return
        
        try {
          const cells = $(row).find('td')
          
          // Debug log
          if (index === 1) {
            console.log(`Edge Function: First row has ${cells.length} cells`)
          }
          
          if (cells.length < 9) return // Must have at least position through points
          
          // Position - first cell
          const positionText = $(cells[0]).text().trim()
          const position = parseInt(positionText, 10)
          
          if (isNaN(position)) {
            console.log(`Edge Function: Invalid position value: "${positionText}"`)
            return // Skip if not a valid team row
          }
          
          // Extract team name - try different approaches
          let teamName = ''
          
          // Try finding team name in different positions
          const teamNameElement = $(cells[1]).find('.gs-o-table__cell--left .qa-full-team-name')
          teamName = teamNameElement.text().trim()
          
          if (!teamName) {
            // Alternative selector if the first one doesn't work
            teamName = $(cells[1]).find('.gs-o-table__cell--left').text().trim()
          }
          
          // Last resort - try the team cell directly
          if (!teamName) {
            teamName = $(cells[1]).text().trim()
          }
          
          if (!teamName) {
            console.log(`Edge Function: Could not extract team name for row ${index}`)
            return // Skip if no team name found
          }
          
          // Extract other stats - adjust indices based on BBC's table structure
          // Parse numbers safely
          const safeParseInt = (text) => {
            const value = parseInt(text.trim() || '0', 10)
            return isNaN(value) ? 0 : value
          }
          
          const played = safeParseInt($(cells[2]).text())
          const won = safeParseInt($(cells[3]).text())
          const drawn = safeParseInt($(cells[4]).text())
          const lost = safeParseInt($(cells[5]).text())
          const goalsFor = safeParseInt($(cells[6]).text())
          const goalsAgainst = safeParseInt($(cells[7]).text())
          const goalDifference = safeParseInt($(cells[8]).text())
          const points = safeParseInt($(cells[9]).text())
          
          // Extract form if available (may be in the last cell)
          const form = []
          if (cells.length > 10) {
            const formCell = $(cells[10])
            
            // Look for form icons
            formCell.find('.gs-o-status-icon, .gel-icon').each((i, el) => {
              const className = $(el).attr('class') || ''
              if (className.includes('win')) form.push('W')
              else if (className.includes('draw')) form.push('D')
              else if (className.includes('loss')) form.push('L')
            })
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
            form: form.slice(0, 5), // Last 5 results
            logo: '', // Default logo field (can be updated later)
            created_at: new Date().toISOString()
          })
          
          console.log(`Edge Function: Extracted data for team: ${teamName}`)
          
        } catch (error) {
          console.error(`Edge Function: Error parsing row ${index}:`, error)
        }
      })
      
      if (leagueData.length === 0) {
        throw new Error('Failed to extract any team data from BBC Sport page')
      }
      
      console.log(`Edge Function: Successfully extracted data for ${leagueData.length} teams`)

      // Store the scraped data in Supabase
      // First, clear existing data
      const { error: deleteError } = await supabase
        .from('highland_league_table')
        .delete()
        .neq('id', 0) // Delete all rows

      if (deleteError) {
        console.error('Edge Function: Error clearing existing data:', deleteError)
      }

      // Insert new data
      const { error: insertError } = await supabase
        .from('highland_league_table')
        .insert(leagueData)

      if (insertError) {
        console.error('Edge Function: Error inserting data:', insertError)
        throw new Error(`Failed to store scraped data: ${insertError.message}`)
      }

      // Update last scrape time
      await supabase
        .from('settings')
        .upsert({ key: 'last_scrape_time', value: currentTime.toISOString() })

      console.log('Edge Function: Successfully stored data in Supabase')

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully scraped and stored Highland League data',
          data: leagueData,
          lastUpdated: currentTime.toISOString(),
          teamsCount: leagueData.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('Edge Function: Fetch error:', fetchError)
      
      // Try a fallback URL if the primary one fails
      console.log('Edge Function: Trying fallback scrape method...')
      throw new Error(`Scraping failed: ${fetchError.message}`)
    }
  } catch (error) {
    console.error('Edge Function Error:', error)
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
    )
  }
})
