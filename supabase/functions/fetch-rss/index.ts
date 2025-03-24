
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

// Parse the RSS feed data
function parseRSS(xmlData: string) {
  const $ = cheerio.load(xmlData, { xmlMode: true });
  const fixtures = [];
  
  // Process each item in the RSS feed
  $('item').each((index, element) => {
    try {
      const title = $(element).find('title').text().trim();
      const pubDate = $(element).find('pubDate').text().trim();
      const description = $(element).find('description').text().trim();
      const link = $(element).find('link').text().trim();
      
      console.log('Processing RSS item:', title);
      
      // Extract the match info from the title
      // Example formats: "Team A v Team B", "Team A vs Team B", "Team A (2) v Team B (1)"
      let matchInfo = title;
      let homeTeam = '', awayTeam = '', homeScore = null, awayScore = null, isCompleted = false;
      
      // Try to extract teams and possibly scores
      if (matchInfo.includes(' v ')) {
        let parts = matchInfo.split(' v ');
        
        // Process home team (might include score in parentheses)
        if (parts[0].includes('(') && parts[0].includes(')')) {
          const homeMatch = parts[0].match(/(.*)\s*\((\d+)\)/);
          if (homeMatch) {
            homeTeam = homeMatch[1].trim();
            homeScore = parseInt(homeMatch[2], 10);
            isCompleted = true;
          } else {
            homeTeam = parts[0].trim();
          }
        } else {
          homeTeam = parts[0].trim();
        }
        
        // Process away team (might include score in parentheses)
        if (parts[1].includes('(') && parts[1].includes(')')) {
          const awayMatch = parts[1].match(/(.*)\s*\((\d+)\)/);
          if (awayMatch) {
            awayTeam = awayMatch[1].trim();
            awayScore = parseInt(awayMatch[2], 10);
            isCompleted = true;
          } else {
            awayTeam = parts[1].trim();
          }
        } else {
          awayTeam = parts[1].trim();
        }
      } else if (matchInfo.includes(' vs ')) {
        [homeTeam, awayTeam] = matchInfo.split(' vs ').map(t => t.trim());
      }
      
      // Process date and time from pubDate
      // Example: "Sat, 18 Mar 2023 15:00:00 GMT"
      const dateObj = new Date(pubDate);
      const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      const time = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
      
      // Extract competition and venue from description if available
      let competition = "Highland League";
      let venue = "TBD";
      
      // Parse description which might contain additional info
      if (description) {
        // Look for competition info
        const competitionMatch = description.match(/Competition:\s*([^,\n]+)/i);
        if (competitionMatch) {
          competition = competitionMatch[1].trim();
        }
        
        // Look for venue info
        const venueMatch = description.match(/Venue:\s*([^,\n]+)/i);
        if (venueMatch) {
          venue = venueMatch[1].trim();
        }
      }
      
      // Only add if we successfully extracted the teams
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
        });
      }
    } catch (error) {
      console.error('Error parsing RSS item:', error);
    }
  });
  
  return fixtures;
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
    const { url } = requestData
    
    if (!url) {
      return new Response(JSON.stringify({ success: false, error: 'URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    console.log(`Fetching RSS feed from: ${url}`)
    
    // Fetch the RSS feed
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error ${response.status} fetching RSS feed: ${errorText}`);
      throw new Error(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`)
    }
    
    const xmlData = await response.text()
    
    if (!xmlData || xmlData.trim() === '') {
      console.error('Received empty response from RSS feed');
      throw new Error('Received empty response from RSS feed')
    }
    
    console.log(`Successfully fetched XML data, length: ${xmlData.length} characters`);
    
    const fixtures = parseRSS(xmlData)
    
    console.log(`Extracted ${fixtures.length} fixtures from RSS feed`)
    
    return new Response(JSON.stringify({ success: true, data: fixtures }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in fetch-rss function:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
