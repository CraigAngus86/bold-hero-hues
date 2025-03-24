
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

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

    // Parse request to get force refresh parameter
    const { forceRefresh } = await req.json().catch(() => ({ forceRefresh: false }))

    // Check last scrape time from Supabase
    const { data: settingsData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'last_scrape_time')
      .single()

    const lastScrapeTime = settingsData?.value ? new Date(settingsData.value) : null
    const currentTime = new Date()
    
    // Only scrape if forced or if last scrape was more than 6 hours ago
    const shouldScrape = forceRefresh || 
      !lastScrapeTime || 
      (currentTime.getTime() - lastScrapeTime.getTime() > 6 * 60 * 60 * 1000)

    if (!shouldScrape) {
      // Return the cached data from Supabase
      const { data: cachedData, error: fetchError } = await supabase
        .from('highland_league_table')
        .select('*')
        .order('position', { ascending: true })

      if (fetchError) {
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
    const url = 'https://www.bbc.com/sport/football/scottish-highland-league/table'
    console.log(`Scraping data from ${url}`)

    // Configure proper headers to avoid being blocked
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
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Target the correct table selector - BBC Sport specific
    const tableRows = $('.gs-o-table__row')
    if (!tableRows || tableRows.length === 0) {
      throw new Error('Could not find table rows in BBC Sport page')
    }
    
    // Extract data from each row
    const leagueData = []
    
    tableRows.each((index, row) => {
      // Skip the header row
      if (index === 0) return
      
      try {
        const cells = $(row).find('td')
        if (cells.length < 9) return // Must have at least position through points
        
        // Position - first cell
        const position = parseInt($(cells[0]).text().trim(), 10)
        if (isNaN(position)) return // Skip if not a valid team row
        
        // Extract team name - typically in first cell with team name class
        const teamNameElement = $(cells[1]).find('.gs-o-table__cell--left .qa-full-team-name')
        let teamName = teamNameElement.text().trim()
        
        if (!teamName) {
          // Alternative selector if the first one doesn't work
          teamName = $(cells[1]).find('.gs-o-table__cell--left').text().trim()
        }
        
        if (!teamName) return // Skip if no team name found
        
        // Extract other stats - adjust indices based on BBC's table structure
        const played = parseInt($(cells[2]).text().trim() || '0', 10)
        const won = parseInt($(cells[3]).text().trim() || '0', 10)
        const drawn = parseInt($(cells[4]).text().trim() || '0', 10)
        const lost = parseInt($(cells[5]).text().trim() || '0', 10)
        const goalsFor = parseInt($(cells[6]).text().trim() || '0', 10)
        const goalsAgainst = parseInt($(cells[7]).text().trim() || '0', 10)
        const goalDifference = parseInt($(cells[8]).text().trim() || '0', 10)
        const points = parseInt($(cells[9]).text().trim() || '0', 10)
        
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
        
      } catch (error) {
        console.error('Error parsing row:', error)
      }
    })
    
    if (leagueData.length === 0) {
      throw new Error('Failed to extract any team data from BBC Sport page')
    }
    
    console.log(`Successfully extracted data for ${leagueData.length} teams`)

    // Store the scraped data in Supabase
    // First, clear existing data
    const { error: deleteError } = await supabase
      .from('highland_league_table')
      .delete()
      .neq('id', 0) // Delete all rows

    if (deleteError) {
      console.error('Error clearing existing data:', deleteError)
    }

    // Insert new data
    const { error: insertError } = await supabase
      .from('highland_league_table')
      .insert(leagueData)

    if (insertError) {
      throw new Error(`Failed to store scraped data: ${insertError.message}`)
    }

    // Update last scrape time
    await supabase
      .from('settings')
      .upsert({ key: 'last_scrape_time', value: currentTime.toISOString() })

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
  } catch (error) {
    console.error('Error in Highland League scraper:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
        error: 'Failed to scrape Highland League data'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
