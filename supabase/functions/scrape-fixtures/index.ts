
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
  
  // Target the fixtures table - selector may need adjusting based on actual website structure
  $('table.fixtures-table tr, .fixtures tr, table tr').each((index, row) => {
    // Skip header rows
    if (index === 0) return
    
    const cells = $(row).find('td')
    if (cells.length < 4) return // Skip rows with insufficient data
    
    try {
      // Extract date
      let dateText = $(cells[0]).text().trim()
      
      // Extract time
      let timeText = $(cells[1]).text().trim()
      if (!timeText) timeText = "15:00" // Default time if not provided
      
      // Extract teams - may need adjusting based on the actual format
      let matchText = $(cells[2]).text().trim()
      let homeTeam = '', awayTeam = ''
      
      // Handle different possible formats
      if (matchText.includes(' v ')) {
        [homeTeam, awayTeam] = matchText.split(' v ').map(t => t.trim())
      } else if (matchText.includes(' vs ')) {
        [homeTeam, awayTeam] = matchText.split(' vs ').map(t => t.trim())
      } else if (matchText.includes(' - ')) {
        [homeTeam, awayTeam] = matchText.split(' - ').map(t => t.trim())
      }
      
      // Extract competition/venue
      let competition = $(cells[3]).text().trim()
      let venue = "TBD" // Default venue
      
      // Some sites include venue in a separate column
      if (cells.length > 4) {
        venue = $(cells[4]).text().trim()
      }
      
      // Skip if we couldn't extract the teams
      if (!homeTeam || !awayTeam) return
      
      // Check if the match has a score (indicating it's completed)
      let isCompleted = false
      let homeScore = null
      let awayScore = null
      
      if (homeTeam.includes('(')) {
        // Format might be "TeamName (2)" for scores
        const scoreMatch = homeTeam.match(/\((\d+)\)$/)
        if (scoreMatch) {
          homeScore = parseInt(scoreMatch[1], 10)
          homeTeam = homeTeam.replace(/\s*\(\d+\)$/, '').trim()
          isCompleted = true
        }
      }
      
      if (awayTeam.includes('(')) {
        const scoreMatch = awayTeam.match(/\((\d+)\)$/)
        if (scoreMatch) {
          awayScore = parseInt(scoreMatch[1], 10)
          awayTeam = awayTeam.replace(/\s*\(\d+\)$/, '').trim()
          isCompleted = true
        }
      }
      
      fixtures.push({
        date: dateText,
        time: timeText,
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
  
  return fixtures
}

serve(async (req) => {
  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest()
  }
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
  
  try {
    // Parse request body
    const requestData = await req.json()
    const { url } = requestData
    
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
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
