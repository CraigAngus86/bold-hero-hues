
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
}

// Serve request
Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Get the request data
    const { url } = await req.json()
    
    // Default URL if none provided
    const targetUrl = url || 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures'
    
    console.log('Scraping BBC Sport fixtures from:', targetUrl)

    // Request the BBC Sport page
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    })

    if (!response.ok) {
      console.error(`Failed to fetch BBC Sport page: ${response.status} ${response.statusText}`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to fetch BBC Sport page: ${response.status}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const html = await response.text()
    console.log(`Successfully fetched HTML (${html.length} bytes)`)
    
    // Sample of the HTML for debugging (first 500 chars)
    const htmlSample = html.substring(0, 500)
    
    // Parse the HTML with Cheerio
    const $ = cheerio.load(html)
    const fixtures = []
    
    // Find fixtures grouped by date
    $('.qa-match-block').each((_, matchBlock) => {
      try {
        // Extract the date
        const dateElement = $(matchBlock).find('.gel-minion')
        const rawDate = dateElement.text().trim()
        
        // Format date as YYYY-MM-DD
        let date = new Date().toISOString().split('T')[0] // Default to today
        if (rawDate) {
          try {
            // BBC typically uses format like "Saturday, 23rd March 2024"
            // Extract and parse it
            const dateMatches = rawDate.match(/(\d{1,2})[a-z]{2}\s+([A-Za-z]+)\s+(\d{4})/)
            if (dateMatches) {
              const day = dateMatches[1].padStart(2, '0')
              
              // Map month name to number
              const monthMap: Record<string, string> = {
                'january': '01', 'february': '02', 'march': '03', 'april': '04',
                'may': '05', 'june': '06', 'july': '07', 'august': '08',
                'september': '09', 'october': '10', 'november': '11', 'december': '12'
              }
              
              const month = monthMap[dateMatches[2].toLowerCase()]
              const year = dateMatches[3]
              
              if (month) {
                date = `${year}-${month}-${day}`
              }
            }
          } catch (e) {
            console.warn(`Could not parse date: ${rawDate}`)
          }
        }
        
        // Find all match containers within this date block
        $(matchBlock).find('.gs-o-list-ui__item').each((_, matchContainer) => {
          try {
            // Extract time
            const timeElement = $(matchContainer).find('.sp-c-fixture__number--time')
            const time = timeElement.text().trim() || '15:00'
            
            // Extract teams
            const homeTeamElement = $(matchContainer).find('.sp-c-fixture__team--home .sp-c-fixture__team-name')
            const awayTeamElement = $(matchContainer).find('.sp-c-fixture__team--away .sp-c-fixture__team-name')
            
            const homeTeam = homeTeamElement.text().trim()
            const awayTeam = awayTeamElement.text().trim()
            
            // Check if the match is completed and extract scores
            const scoreElement = $(matchContainer).find('.sp-c-fixture__number--score')
            let isCompleted = false
            let homeScore = null
            let awayScore = null
            
            if (scoreElement.length > 0) {
              isCompleted = true
              const scoreText = scoreElement.text().trim()
              const scores = scoreText.split('-').map(s => parseInt(s.trim(), 10))
              if (scores.length === 2 && !isNaN(scores[0]) && !isNaN(scores[1])) {
                homeScore = scores[0]
                awayScore = scores[1]
              }
            }
            
            // Extract competition (Highland League is default)
            const competition = 'Highland League'
            
            // Extract venue (if available, otherwise TBD)
            const venueElement = $(matchContainer).find('.sp-c-fixture__venue')
            const venue = venueElement.length > 0 ? venueElement.text().trim() : 'TBD'
            
            // Only add if we have both team names
            if (homeTeam && awayTeam) {
              fixtures.push({
                homeTeam,
                awayTeam,
                date,
                time,
                competition,
                venue,
                isCompleted,
                homeScore,
                awayScore
              })
            }
          } catch (err) {
            console.warn('Error parsing match container:', err)
          }
        })
      } catch (err) {
        console.warn('Error processing match block:', err)
      }
    })
    
    // If no fixtures were found using the standard selectors, try alternative selectors
    if (fixtures.length === 0) {
      console.log('No fixtures found with standard selectors, trying alternative selectors')
      
      // Alternative selector for fixtures (BBC sometimes changes their markup)
      $('.sp-c-fixture').each((_, fixtureElement) => {
        try {
          // Try to find the date from a parent or nearby element
          let dateText = ''
          $(fixtureElement).parents().each((_, parent) => {
            const potentialDate = $(parent).find('.gel-minion').text().trim()
            if (potentialDate && potentialDate.match(/\d{1,2}[a-z]{2}\s+[A-Za-z]+\s+\d{4}/)) {
              dateText = potentialDate
              return false // Break the loop
            }
          })
          
          // Format date as YYYY-MM-DD
          let date = new Date().toISOString().split('T')[0] // Default to today
          if (dateText) {
            try {
              const dateMatches = dateText.match(/(\d{1,2})[a-z]{2}\s+([A-Za-z]+)\s+(\d{4})/)
              if (dateMatches) {
                const day = dateMatches[1].padStart(2, '0')
                const monthMap: Record<string, string> = {
                  'january': '01', 'february': '02', 'march': '03', 'april': '04',
                  'may': '05', 'june': '06', 'july': '07', 'august': '08',
                  'september': '09', 'october': '10', 'november': '11', 'december': '12'
                }
                const month = monthMap[dateMatches[2].toLowerCase()]
                const year = dateMatches[3]
                
                if (month) {
                  date = `${year}-${month}-${day}`
                }
              }
            } catch (e) {
              console.warn(`Could not parse date: ${dateText}`)
            }
          }
          
          // Extract time
          const timeElement = $(fixtureElement).find('.sp-c-fixture__time')
          const time = timeElement.text().trim() || '15:00'
          
          // Extract teams
          const homeTeamElement = $(fixtureElement).find('.sp-c-fixture__team--home .sp-c-fixture__team-name')
          const awayTeamElement = $(fixtureElement).find('.sp-c-fixture__team--away .sp-c-fixture__team-name')
          
          const homeTeam = homeTeamElement.text().trim()
          const awayTeam = awayTeamElement.text().trim()
          
          // Check if the match is completed and extract scores
          const scoreElement = $(fixtureElement).find('.sp-c-fixture__score')
          let isCompleted = false
          let homeScore = null
          let awayScore = null
          
          if (scoreElement.length > 0) {
            isCompleted = true
            const scoreText = scoreElement.text().trim()
            const scores = scoreText.split('-').map(s => parseInt(s.trim(), 10))
            if (scores.length === 2 && !isNaN(scores[0]) && !isNaN(scores[1])) {
              homeScore = scores[0]
              awayScore = scores[1]
            }
          }
          
          // Extract competition (Highland League is default)
          const competition = 'Highland League'
          
          // Extract venue (if available, otherwise TBD)
          const venueElement = $(fixtureElement).find('.sp-c-fixture__venue')
          const venue = venueElement.length > 0 ? venueElement.text().trim() : 'TBD'
          
          // Only add if we have both team names
          if (homeTeam && awayTeam) {
            fixtures.push({
              homeTeam,
              awayTeam,
              date,
              time,
              competition,
              venue,
              isCompleted,
              homeScore,
              awayScore
            })
          }
        } catch (err) {
          console.warn('Error processing fixture element:', err)
        }
      })
    }
    
    console.log(`Successfully extracted ${fixtures.length} fixtures`)
    
    // Return the results
    return new Response(
      JSON.stringify({
        success: true,
        data: fixtures,
        source: 'BBC Sport',
        url: targetUrl,
        count: fixtures.length,
        htmlSample: fixtures.length === 0 ? htmlSample : null // Only include HTML sample if no fixtures found
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error scraping BBC Sport:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
