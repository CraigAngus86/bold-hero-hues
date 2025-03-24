
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

// CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

// For preflight requests
function handleCorsPreflightRequest() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  })
}

// Extract fixtures from the HTML
function extractFixtures(html: string) {
  const $ = cheerio.load(html)
  const fixtures = []
  
  // Target the fixtures table on Highland Football League website
  // The website has multiple tables, so we need to find the right ones
  $('table').each((_, table) => {
    const $table = $(table)
    
    // Skip tables that don't look like fixtures tables
    const headerText = $table.find('th').text().toLowerCase()
    if (!headerText.includes('date') && !headerText.includes('home') && !headerText.includes('away')) {
      return
    }
    
    $table.find('tr').each((index, row) => {
      // Skip header rows
      if (index === 0) return
      
      const cells = $(row).find('td')
      if (cells.length < 3) return // Skip rows with insufficient data
      
      try {
        // Extract date
        let dateText = $(cells[0]).text().trim()
        if (!dateText) return // Skip if no date
        
        // Extract teams and scores
        let homeTeamCell = $(cells[1])
        let awayTeamCell = $(cells[2])
        
        let homeTeam = homeTeamCell.text().trim()
        let awayTeam = awayTeamCell.text().trim()
        
        // Skip if we couldn't extract the teams
        if (!homeTeam || !awayTeam) return
        
        // Default values
        let time = "15:00" // Default time if not provided
        let competition = "Highland League"
        let venue = "TBD"
        let isCompleted = false
        let homeScore = null
        let awayScore = null
        
        // Check if the match has a score (indicated by numbers in parentheses or similar)
        const homeScoreMatch = homeTeam.match(/\((\d+)\)/) || homeTeam.match(/(\d+)-\d+/)
        const awayScoreMatch = awayTeam.match(/\((\d+)\)/) || awayTeam.match(/\d+-(\d+)/)
        
        if (homeScoreMatch && awayScoreMatch) {
          isCompleted = true
          homeScore = parseInt(homeScoreMatch[1], 10)
          awayScore = parseInt(awayScoreMatch[1], 10)
          
          // Clean up team names by removing score information
          homeTeam = homeTeam.replace(/\(\d+\)|\d+-\d+/, '').trim()
          awayTeam = awayTeam.replace(/\(\d+\)|\d+-\d+/, '').trim()
        }
        
        fixtures.push({
          date: dateText,
          time,
          homeTeam,
          awayTeam,
          competition,
          venue,
          isCompleted,
          homeScore,
          awayScore
        })
      } catch (error) {
        console.error('Error parsing fixture row:', error)
      }
    })
  })
  
  return fixtures
}

serve(async (req) => {
  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest()
  }
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
  
  try {
    // Parse request body
    const requestData = await req.json()
    
    // Default to HFL website if no URL provided
    const url = requestData.url || 'http://www.highlandfootballleague.com/Fixtures/'
    
    console.log(`Scraping fixtures from: ${url}`)
    
    // Fetch the HTML from the Highland League website
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`)
    }
    
    const html = await response.text()
    const fixtures = extractFixtures(html)
    
    console.log(`Extracted ${fixtures.length} fixtures`)
    
    return new Response(JSON.stringify({ success: true, data: fixtures }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in scrape-fixtures function:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
