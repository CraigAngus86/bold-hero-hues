
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Interface for scraped fixture data
interface ScrapedFixture {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  venue?: string;
  isCompleted?: boolean;
  homeScore?: number;
  awayScore?: number;
  source: string;
}

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
}

// Create Supabase client with service role key
function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  return createClient(supabaseUrl, supabaseKey)
}

// Log scraping operation
async function logScrapeOperation(
  supabase: any, 
  source: string, 
  status: string, 
  itemsFound: number, 
  itemsAdded: number, 
  itemsUpdated: number,
  errorMessage?: string
) {
  await supabase.from('scrape_logs').insert({
    source,
    status,
    items_found: itemsFound,
    items_added: itemsAdded,
    items_updated: itemsUpdated,
    error_message: errorMessage
  })
}

// Format date string to ISO format
function formatDate(dateStr: string): string {
  // Check if we have a date string like "Today, 15:00" or "Yesterday, 15:00"
  if (dateStr.toLowerCase().includes('today')) {
    const today = new Date()
    return today.toISOString().split('T')[0]
  } else if (dateStr.toLowerCase().includes('yesterday')) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  } else if (dateStr.toLowerCase().includes('tomorrow')) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Try to parse dates in formats like "Saturday, 30th March 2024"
  try {
    // Remove ordinal indicators (st, nd, rd, th)
    const cleanedDate = dateStr.replace(/(\d+)(st|nd|rd|th)/i, '$1')
    
    // Try to parse with different formats used by BBC Sport
    const date = new Date(cleanedDate)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    
    // If the above fails, try manual parsing
    const months = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
      'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
    }
    
    // Extract day, month and year
    const parts = cleanedDate.split(' ')
    const day = parseInt(parts[1], 10)
    const monthStr = parts[2].toLowerCase()
    const month = months[monthStr as keyof typeof months]
    const year = parseInt(parts[3], 10)
    
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      const parsedDate = new Date(year, month, day)
      return parsedDate.toISOString().split('T')[0]
    }

    console.error('Could not parse date:', dateStr)
    return ''
  } catch (error) {
    console.error('Error parsing date:', dateStr, error)
    return ''
  }
}

// Extract time from time string
function extractTime(timeStr: string): string {
  // Look for time pattern HH:MM
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/)
  if (timeMatch) {
    return `${timeMatch[0]}`
  }
  return '15:00' // Default time if not found
}

// Parse score from text (e.g., "2-1")
function parseScore(scoreText: string): { homeScore: number | null, awayScore: number | null } {
  if (!scoreText || typeof scoreText !== 'string') {
    return { homeScore: null, awayScore: null }
  }

  // Check if the score has the format X-Y
  const scores = scoreText.trim().split('-')
  if (scores.length === 2) {
    const homeScore = parseInt(scores[0].trim(), 10)
    const awayScore = parseInt(scores[1].trim(), 10)
    if (!isNaN(homeScore) && !isNaN(awayScore)) {
      return { homeScore, awayScore }
    }
  }
  
  return { homeScore: null, awayScore: null }
}

// Check if a fixture is for Banks o' Dee FC
function isBanksODeeFixture(homeTeam: string, awayTeam: string): boolean {
  const banksODeeVariants = ["banks o' dee", "banks o dee", "banks o'dee", "banks o'dee fc", "banks o dee fc"]
  const homeTeamLower = homeTeam.toLowerCase()
  const awayTeamLower = awayTeam.toLowerCase()
  
  return banksODeeVariants.some(variant => 
    homeTeamLower.includes(variant) || awayTeamLower.includes(variant)
  )
}

// Extract all fixtures from BBC Sport page
async function extractFixtures(url: string): Promise<ScrapedFixture[]> {
  console.log(`Extracting fixtures from ${url}`)
  
  try {
    // Make request to BBC Sport
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from BBC Sport: ${response.status} ${response.statusText}`)
    }
    
    const html = await response.text()
    console.log(`Successfully fetched HTML content, length: ${html.length}`)
    
    const $ = cheerio.load(html)
    const fixtures: ScrapedFixture[] = []
    let currentDate = ''
    const currentYear = new Date().getFullYear()
    const competition = 'Scottish Highland League'
    
    // Extract fixtures by date sections
    $('.qa-match-block').each((_, dayBlock) => {
      // Get the date for this block of matches
      const dateText = $(dayBlock).find('.sp-c-fixture__heading').text().trim()
      if (dateText) {
        currentDate = formatDate(dateText)
        console.log(`Processing matches for date: ${dateText} (formatted: ${currentDate})`)
      }
      
      // Process each match in this date block
      $(dayBlock).find('.sp-c-fixture').each((_, fixtureEl) => {
        try {
          // Extract teams
          const homeTeam = $(fixtureEl).find('.sp-c-fixture__team--home .sp-c-fixture__team-name-trunc').text().trim()
          const awayTeam = $(fixtureEl).find('.sp-c-fixture__team--away .sp-c-fixture__team-name-trunc').text().trim()
          
          // Only process if it's a Banks O' Dee match
          if (!isBanksODeeFixture(homeTeam, awayTeam)) {
            return // Skip non-Banks O' Dee matches
          }

          console.log(`Found match: ${homeTeam} vs ${awayTeam}`)
          
          // Extract time or score
          const scoreOrTime = $(fixtureEl).find('.sp-c-fixture__score').text().trim() || 
                             $(fixtureEl).find('.sp-c-fixture__status').text().trim()
          
          // Determine if it's a result (has score) or a fixture (has time)
          const hasScore = scoreOrTime.includes('-')
          const isCompleted = hasScore
          
          let time: string
          let homeScore: number | null = null
          let awayScore: number | null = null
          
          if (isCompleted) {
            // It's a result - parse score
            const scores = parseScore(scoreOrTime)
            homeScore = scores.homeScore
            awayScore = scores.awayScore
            time = '15:00' // Default time for completed matches
          } else {
            // It's an upcoming fixture - get time
            time = extractTime(scoreOrTime)
          }
          
          // Create fixture object
          const fixture: ScrapedFixture = {
            homeTeam,
            awayTeam,
            date: currentDate,
            time,
            competition,
            isCompleted,
            source: 'bbc-sport'
          }
          
          // Add scores if available
          if (homeScore !== null && awayScore !== null) {
            fixture.homeScore = homeScore
            fixture.awayScore = awayScore
          }
          
          fixtures.push(fixture)
        } catch (error) {
          console.error('Error extracting fixture:', error)
        }
      })
    })
    
    console.log(`Extracted ${fixtures.length} Banks O' Dee fixtures`)
    return fixtures
    
  } catch (error) {
    console.error('Error scraping fixtures:', error)
    throw error
  }
}

// Store fixtures in the database
async function storeFixtures(supabase: any, fixtures: ScrapedFixture[]): Promise<{added: number, updated: number}> {
  let added = 0
  let updated = 0

  try {
    // Process fixtures one by one for better error handling
    for (const fixture of fixtures) {
      // First check if the fixture already exists (same teams and date)
      const { data: existingFixtures } = await supabase
        .from('fixtures')
        .select('id')
        .eq('home_team', fixture.homeTeam)
        .eq('away_team', fixture.awayTeam)
        .eq('date', fixture.date)
      
      if (existingFixtures && existingFixtures.length > 0) {
        // Update existing fixture
        const { error: updateError } = await supabase
          .from('fixtures')
          .update({
            competition: fixture.competition,
            time: fixture.time,
            is_completed: fixture.isCompleted,
            home_score: fixture.homeScore,
            away_score: fixture.awayScore,
            source: fixture.source
          })
          .eq('id', existingFixtures[0].id)
        
        if (updateError) {
          console.error('Error updating fixture:', updateError)
          continue // Skip to next fixture
        }
        updated++
      } else {
        // Insert new fixture
        const { error: insertError } = await supabase
          .from('fixtures')
          .insert([{
            home_team: fixture.homeTeam,
            away_team: fixture.awayTeam,
            date: fixture.date,
            time: fixture.time,
            competition: fixture.competition,
            is_completed: fixture.isCompleted,
            home_score: fixture.homeScore,
            away_score: fixture.awayScore,
            source: fixture.source
          }])
        
        if (insertError) {
          console.error('Error inserting fixture:', insertError)
          continue // Skip to next fixture
        }
        added++
      }
    }
    
    return { added, updated }
  } catch (error) {
    console.error('Error storing fixtures:', error)
    throw error
  }
}

// Main handler function
serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Get URL from request body
    const { url } = await req.json()
    const scrapeUrl = url || 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures'
    
    // Initialize Supabase client
    const supabase = createSupabaseClient()
    
    // Extract fixtures
    console.log(`Starting to scrape fixtures from ${scrapeUrl}`)
    const fixtures = await extractFixtures(scrapeUrl)
    
    if (fixtures.length === 0) {
      console.log('No Banks O\' Dee fixtures found')
      await logScrapeOperation(supabase, 'bbc-sport', 'warning', 0, 0, 0, 'No fixtures found')
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No Banks O\' Dee fixtures found',
          data: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Store fixtures in database
    const { added, updated } = await storeFixtures(supabase, fixtures)
    console.log(`Stored ${fixtures.length} fixtures: added ${added}, updated ${updated}`)
    
    // Log success
    await logScrapeOperation(supabase, 'bbc-sport', 'success', fixtures.length, added, updated)
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped and stored ${fixtures.length} fixtures (${added} added, ${updated} updated)`,
        data: fixtures
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    // Log error
    const supabase = createSupabaseClient()
    await logScrapeOperation(
      supabase,
      'bbc-sport',
      'error', 
      0,
      0,
      0,
      error instanceof Error ? error.message : 'Unknown error'
    )
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error scraping fixtures',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
