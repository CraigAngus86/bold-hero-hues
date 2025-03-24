
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

// CORS headers to ensure the function can be called from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Returns CORS headers for preflight requests
function handleCorsPreflightRequest() {
  return new Response('ok', { headers: corsHeaders })
}

// Configure proper headers for scraping
function getScrapingHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Cache-Control': 'max-age=0'
  }
}

// Main function to scrape fixtures from BBC Sport
async function scrapeFixturesFromBBC(url: string) {
  console.log(`Scraping fixtures from: ${url}`)

  try {
    // Fetch the page with proper headers
    const response = await fetch(url, {
      headers: getScrapingHeaders(),
      redirect: 'follow'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    console.log('Successfully fetched BBC Sport page, extracting fixture data...')

    const $ = cheerio.load(html)
    const fixtures = []

    // Find all match containers on the page
    const matchContainers = $('.qa-match-block')

    console.log(`Found ${matchContainers.length} match containers`)

    // For each date block, process the fixtures
    matchContainers.each((i, container) => {
      // Extract date from the container
      const dateElement = $(container).find('.sp-c-match-list-heading')
      const dateText = dateElement.text().trim()
      
      // Parse the date to a standardized format (YYYY-MM-DD)
      const date = parseDate(dateText)
      
      // Process each match in this container
      $(container).find('.sp-c-fixture').each((j, match) => {
        // Extract teams
        const homeTeam = $(match).find('.sp-c-fixture__team--home .sp-c-fixture__team-name-trunc').text().trim()
        const awayTeam = $(match).find('.sp-c-fixture__team--away .sp-c-fixture__team-name-trunc').text().trim()
        
        // Extract time
        const timeElement = $(match).find('.sp-c-fixture__number--time')
        const time = timeElement.text().trim() || '15:00'
        
        // Extract competition (if available)
        let competition = 'Highland League'
        const competitionElem = $(match).closest('.sp-c-match-list-heading').prev('.qa-match-block .gel-pica').first()
        if (competitionElem.length) {
          competition = competitionElem.text().trim()
        }
        
        // Check if match is completed and has scores
        const isCompletedElem = $(match).find('.sp-c-fixture__block--time abbr')
        const isCompleted = isCompletedElem.text().trim() === 'FT'
        
        // Extract scores if available
        let homeScore = null
        let awayScore = null
        
        if (isCompleted) {
          homeScore = parseInt($(match).find('.sp-c-fixture__number--home').text().trim()) 
          awayScore = parseInt($(match).find('.sp-c-fixture__number--away').text().trim())
        }
        
        // Extract venue if available
        let venue = ''
        const venueElem = $(match).find('.sp-c-fixture__venue')
        if (venueElem.length) {
          venue = venueElem.text().trim()
        }
        
        fixtures.push({
          homeTeam,
          awayTeam,
          date,
          time,
          competition,
          venue,
          isCompleted,
          homeScore: isNaN(homeScore) ? null : homeScore,
          awayScore: isNaN(awayScore) ? null : awayScore
        })
      })
    })

    console.log(`Successfully extracted ${fixtures.length} fixtures`)
    return fixtures
  } catch (error) {
    console.error('Error scraping fixtures:', error)
    throw error
  }
}

// Helper function to parse date text to YYYY-MM-DD format
function parseDate(dateText: string): string {
  try {
    // Handle various date formats from BBC Sport
    if (dateText.toLowerCase().includes('today')) {
      const today = new Date()
      return formatDate(today)
    }
    
    if (dateText.toLowerCase().includes('tomorrow')) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return formatDate(tomorrow)
    }
    
    if (dateText.toLowerCase().includes('yesterday')) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return formatDate(yesterday)
    }
    
    // Handle specific date format like "Saturday, 14th October"
    const ukDateRegex = /\w+,\s+(\d+)\w+\s+(\w+)/
    const match = dateText.match(ukDateRegex)
    
    if (match) {
      const day = parseInt(match[1])
      const month = parseMonth(match[2])
      const year = new Date().getFullYear()
      const date = new Date(year, month, day)
      return formatDate(date)
    }
    
    // Fallback to current date if parsing fails
    console.warn(`Could not parse date: ${dateText}, using current date`)
    return formatDate(new Date())
  } catch (error) {
    console.error(`Error parsing date "${dateText}":`, error)
    return formatDate(new Date())
  }
}

// Helper function to parse month name to month number (0-11)
function parseMonth(monthName: string): number {
  const months: { [key: string]: number } = {
    'january': 0, 'jan': 0,
    'february': 1, 'feb': 1,
    'march': 2, 'mar': 2,
    'april': 3, 'apr': 3,
    'may': 4,
    'june': 5, 'jun': 5,
    'july': 6, 'jul': 6,
    'august': 7, 'aug': 7,
    'september': 8, 'sep': 8, 'sept': 8,
    'october': 9, 'oct': 9,
    'november': 10, 'nov': 10,
    'december': 11, 'dec': 11
  }
  
  return months[monthName.toLowerCase()] || 0
}

// Helper function to format date to YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Main edge function handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest()
  }

  try {
    const requestData = await req.json();
    const url = requestData.url || 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures';
    
    // Scrape the fixtures
    const fixtures = await scrapeFixturesFromBBC(url);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully scraped fixtures from BBC Sport',
        data: fixtures,
        count: fixtures.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        error: 'Failed to scrape fixtures'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
