
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

// Main function to scrape fixtures from Highland League website
async function scrapeFixturesFromHFL(url: string) {
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
    console.log('Successfully fetched Highland League page, extracting fixture data...')

    const $ = cheerio.load(html)
    const fixtures = []

    // Find all fixture tables
    const fixtureTables = $('.fixtable')

    console.log(`Found ${fixtureTables.length} fixture tables`)

    // For each fixture table, extract fixtures
    fixtureTables.each((i, table) => {
      // Get table rows (skipping header row)
      const rows = $(table).find('tr').slice(1)
      
      // Process each row as a fixture
      rows.each((j, row) => {
        const cells = $(row).find('td')
        
        if (cells.length >= 4) {
          // Extract date (cell 0)
          const dateText = $(cells[0]).text().trim()
          const formattedDate = parseHFLDate(dateText)
          
          // Extract time (cell 1)
          const timeText = $(cells[1]).text().trim() || '15:00'
          
          // Extract teams (cell 2)
          const teamsText = $(cells[2]).text().trim()
          const [homeTeam, awayTeam] = parseTeams(teamsText)
          
          // Extract competition/venue (cell 3)
          const venueText = $(cells[3]).text().trim()
          const competition = 'Highland League'
          
          if (homeTeam && awayTeam) {
            fixtures.push({
              homeTeam,
              awayTeam,
              date: formattedDate,
              time: timeText,
              competition,
              venue: venueText,
              isCompleted: false, // All fixtures are considered upcoming on the fixtures page
              homeScore: null,
              awayScore: null
            })
          }
        }
      })
    })

    // If no fixtures found using table structure, try alternative parsing
    if (fixtures.length === 0) {
      console.log('No fixtures found using table structure, trying alternative parsing')
      
      // Try to find fixtures in text format
      const fixtureBlocks = $('.fixtable p')
      
      fixtureBlocks.each((i, block) => {
        const text = $(block).text().trim()
        
        // Example format: "Saturday 14th October, 2023 | Kick Off 3pm | Buckie Thistle v Fraserburgh"
        const dateRegex = /(\w+)\s+(\d+)(?:st|nd|rd|th)\s+(\w+),\s+(\d{4})/i
        const timeRegex = /Kick Off\s+(\d+)(?::(\d+))?\s*(am|pm)?/i
        const teamsRegex = /([a-zA-Z\s]+)\s+v\s+([a-zA-Z\s]+)/i
        
        const dateMatch = text.match(dateRegex)
        const timeMatch = text.match(timeRegex)
        const teamsMatch = text.match(teamsRegex)
        
        if (dateMatch && teamsMatch) {
          const day = parseInt(dateMatch[2])
          const month = parseMonth(dateMatch[3])
          const year = parseInt(dateMatch[4])
          
          // Parse time
          let hour = timeMatch ? parseInt(timeMatch[1]) : 15
          const minute = timeMatch && timeMatch[2] ? parseInt(timeMatch[2]) : 0
          const ampm = timeMatch ? timeMatch[3]?.toLowerCase() : 'pm'
          
          // Adjust hour for PM
          if (ampm === 'pm' && hour < 12) {
            hour += 12
          }
          
          // Format date and time
          const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
          const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          
          // Extract teams
          const homeTeam = teamsMatch[1].trim()
          const awayTeam = teamsMatch[2].trim()
          
          fixtures.push({
            homeTeam,
            awayTeam,
            date: formattedDate,
            time: formattedTime,
            competition: 'Highland League',
            venue: '',
            isCompleted: false,
            homeScore: null,
            awayScore: null
          })
        }
      })
    }

    console.log(`Successfully extracted ${fixtures.length} fixtures`)
    return fixtures
  } catch (error) {
    console.error('Error scraping fixtures:', error)
    throw error
  }
}

// Helper function to parse teams from text like "Team A v Team B"
function parseTeams(teamsText: string): [string, string] {
  // Try "v" separator first
  let separator = ' v '
  if (teamsText.includes(separator)) {
    const parts = teamsText.split(separator)
    return [parts[0].trim(), parts[1].trim()]
  }
  
  // Try "vs" separator
  separator = ' vs '
  if (teamsText.includes(separator)) {
    const parts = teamsText.split(separator)
    return [parts[0].trim(), parts[1].trim()]
  }
  
  // Try "-" separator
  separator = ' - '
  if (teamsText.includes(separator)) {
    const parts = teamsText.split(separator)
    return [parts[0].trim(), parts[1].trim()]
  }
  
  // If no separator found, return empty strings
  return ['', '']
}

// Helper function to parse Highland League date format
function parseHFLDate(dateText: string): string {
  try {
    // Example format: "Saturday 14th October 2023"
    const parts = dateText.split(' ')
    
    if (parts.length >= 4) {
      // Extract day, removing any suffix (st, nd, rd, th)
      const day = parseInt(parts[1].replace(/\D/g, ''))
      const month = parseMonth(parts[2])
      const year = parseInt(parts[3])
      
      // Fallback to current year if not provided
      const currentYear = new Date().getFullYear()
      
      return `${isNaN(year) ? currentYear : year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
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
    const url = requestData.url || 'http://www.highlandfootballleague.com/Fixtures/';
    
    // Scrape the fixtures
    const fixtures = await scrapeFixturesFromHFL(url);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully scraped fixtures from Highland League website',
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
