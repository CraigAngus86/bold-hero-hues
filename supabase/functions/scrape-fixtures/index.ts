
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
  
  console.log('Starting to extract fixtures from HTML')
  
  // Target all tables on the page that might contain fixtures
  $('table').each((tableIndex, table) => {
    console.log(`Examining table ${tableIndex}`)
    
    const $table = $(table)
    const rows = $table.find('tr')
    
    // Skip tables with fewer than 2 rows (no data or headers only)
    if (rows.length < 2) {
      console.log(`Skipping table ${tableIndex}: insufficient rows (${rows.length})`)
      return
    }
    
    // Get header text to check if this looks like a fixtures table
    const headerRow = rows.first()
    const headerCells = headerRow.find('th, td') // Some tables might use td for headers
    const headerTexts = headerCells.map((_, cell) => $(cell).text().trim().toLowerCase()).get()
    
    console.log(`Table ${tableIndex} headers:`, headerTexts.join(', '))
    
    // Check if this has the structure of a fixtures table
    // Look for columns that might indicate date, teams, etc.
    const hasDateColumn = headerTexts.some(text => text.includes('date') || text.includes('day'))
    const hasTeamColumns = headerTexts.some(text => text.includes('home') || text.includes('away') || text.includes('team'))
    
    if (!hasDateColumn && !hasTeamColumns) {
      console.log(`Skipping table ${tableIndex}: doesn't appear to be a fixtures table`)
      return
    }
    
    console.log(`Processing fixtures from table ${tableIndex}`)
    
    // Determine column indices based on headers
    let dateIndex = -1
    let homeTeamIndex = -1
    let awayTeamIndex = -1
    let scoreIndex = -1
    
    headerTexts.forEach((text, index) => {
      if (text.includes('date') || text.includes('day')) dateIndex = index
      if (text.includes('home')) homeTeamIndex = index
      if (text.includes('away')) awayTeamIndex = index
      if (text.includes('score') || text.includes('result')) scoreIndex = index
    })
    
    // If we couldn't identify the key columns, but it looks like a fixtures table,
    // make a best guess based on common formats
    if (dateIndex === -1 && headerCells.length >= 1) dateIndex = 0
    if (homeTeamIndex === -1 && headerCells.length >= 2) homeTeamIndex = 1
    if (awayTeamIndex === -1 && headerCells.length >= 3) awayTeamIndex = 2
    
    console.log(`Column indices - Date: ${dateIndex}, Home: ${homeTeamIndex}, Away: ${awayTeamIndex}, Score: ${scoreIndex}`)
    
    // Process each row (skip header)
    $(rows).each((rowIndex, row) => {
      if (rowIndex === 0) return // Skip header row
      
      const cells = $(row).find('td')
      if (cells.length < Math.max(dateIndex, homeTeamIndex, awayTeamIndex) + 1) {
        console.log(`Skipping row ${rowIndex}: insufficient cells (${cells.length})`)
        return
      }
      
      try {
        // Extract date
        let dateText = dateIndex >= 0 ? $(cells[dateIndex]).text().trim() : ''
        if (!dateText) {
          console.log(`Skipping row ${rowIndex}: no date text`)
          return
        }
        
        // Extract teams
        let homeTeam = homeTeamIndex >= 0 ? $(cells[homeTeamIndex]).text().trim() : ''
        let awayTeam = awayTeamIndex >= 0 ? $(cells[awayTeamIndex]).text().trim() : ''
        
        // Skip if we couldn't get both teams
        if (!homeTeam || !awayTeam) {
          console.log(`Skipping row ${rowIndex}: missing team name(s)`)
          return
        }
        
        console.log(`Found fixture: ${dateText} - ${homeTeam} vs ${awayTeam}`)
        
        // Default values
        let time = "15:00" // Default time if not provided
        let competition = "Highland League"
        let venue = "TBD"
        let isCompleted = false
        let homeScore = null
        let awayScore = null
        
        // Extract time if embedded in the date string
        const timeMatch = dateText.match(/(\d{1,2}[:.]\d{2})/)
        if (timeMatch) {
          time = timeMatch[1].replace('.', ':')
          // Remove time from date string
          dateText = dateText.replace(timeMatch[0], '').trim()
        }
        
        // Look for scores in the team names or in a separate score column
        const extractScore = (text) => {
          const scoreMatch = text.match(/(\d+)[-:](\d+)/) || text.match(/(\d+)\s*[-:]\s*(\d+)/)
          if (scoreMatch) {
            return [parseInt(scoreMatch[1], 10), parseInt(scoreMatch[2], 10)]
          }
          return null
        }
        
        // Try to extract scores from team names (may be embedded)
        let scoreFromHomeTeam = extractScore(homeTeam)
        let scoreFromAwayTeam = extractScore(awayTeam)
        
        // Try to extract scores from a dedicated score column
        let scoreFromScoreColumn = scoreIndex >= 0 ? extractScore($(cells[scoreIndex]).text().trim()) : null
        
        // Use the first valid score we find
        let score = scoreFromScoreColumn || scoreFromHomeTeam || scoreFromAwayTeam
        
        if (score) {
          isCompleted = true
          homeScore = score[0]
          awayScore = score[1]
          
          // Clean up team names if score was embedded
          if (scoreFromHomeTeam) {
            homeTeam = homeTeam.replace(/\s*\d+\s*[-:]\s*\d+\s*/, '').trim()
          }
          if (scoreFromAwayTeam) {
            awayTeam = awayTeam.replace(/\s*\d+\s*[-:]\s*\d+\s*/, '').trim()
          }
        }
        
        // Check for brackets which sometimes contain scores
        const homeScoreInBrackets = homeTeam.match(/\((\d+)\)/)
        const awayScoreInBrackets = awayTeam.match(/\((\d+)\)/)
        
        if (homeScoreInBrackets && awayScoreInBrackets) {
          isCompleted = true
          homeScore = parseInt(homeScoreInBrackets[1], 10)
          awayScore = parseInt(awayScoreInBrackets[1], 10)
          
          // Clean up team names
          homeTeam = homeTeam.replace(/\s*\(\d+\)\s*/, '').trim()
          awayTeam = awayTeam.replace(/\s*\(\d+\)\s*/, '').trim()
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
        console.error(`Error parsing row ${rowIndex}:`, error)
      }
    })
  })
  
  console.log(`Total fixtures extracted: ${fixtures.length}`)
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
    console.log(`Fetched HTML length: ${html.length} characters`)
    
    // Extract fixtures
    const fixtures = extractFixtures(html)
    
    if (fixtures.length === 0) {
      console.log("No fixtures were found in the HTML. Here's a sample of the HTML:")
      console.log(html.substring(0, 500) + "...")
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No fixtures found on the page',
        htmlSample: html.substring(0, 1000) + "..." // Include a sample of the HTML for debugging
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
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
