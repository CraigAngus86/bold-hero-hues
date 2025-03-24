
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapedFixture {
  id: string | number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  venue: string;
  isCompleted?: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
}

// Handle CORS preflight requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    console.log(`Scraping fixtures from Transfermarkt URL: ${url}`);

    // Define multiple CORS proxies to try in sequence
    const corsProxies = [
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url=',
      'https://thingproxy.freeboard.io/fetch/'
    ];

    let htmlContent = '';
    let proxySuccess = false;

    // Try each proxy until one works
    for (const proxy of corsProxies) {
      try {
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        console.log(`Trying proxy: ${proxy.split('?')[0]}`);
        
        const response = await fetch(proxyUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://www.google.com/',
            'Cache-Control': 'no-cache'
          },
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        htmlContent = await response.text();
        
        if (htmlContent && htmlContent.length > 0) {
          console.log(`Successfully fetched HTML using proxy: ${proxy.split('?')[0]}`);
          proxySuccess = true;
          break;
        }
      } catch (error) {
        console.error(`Error with proxy ${proxy}:`, error.message);
        // Continue to next proxy
      }
    }

    if (!proxySuccess || !htmlContent) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to fetch HTML from any proxy',
          htmlSample: 'No HTML content could be fetched from any proxy.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the HTML to extract fixture data
    const fixtures = parseTransfermarktFixtures(htmlContent);
    const htmlSample = htmlContent.substring(0, 1000) + '...';

    if (fixtures.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No fixtures found in the HTML content',
          htmlSample
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: fixtures,
        htmlSample
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in edge function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unknown error occurred'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseTransfermarktFixtures(html: string): ScrapedFixture[] {
  console.log('Parsing Transfermarkt fixtures...');
  
  const fixtures: ScrapedFixture[] = [];
  
  try {
    // Use regular expressions to extract the fixture data from the HTML
    // Look for the table rows containing match data
    const tableRegex = /<table class="[^"]*?spielplandatum[^"]*?".*?>([\s\S]*?)<\/table>/i;
    const tableMatch = html.match(tableRegex);
    
    if (!tableMatch || !tableMatch[1]) {
      console.log('No fixture table found in HTML');
      return fixtures;
    }
    
    const tableHtml = tableMatch[1];
    
    // Extract rows from the table
    const rowRegex = /<tr[^>]*?>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    let currentCompetition = 'Highland League';
    
    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      const rowHtml = rowMatch[1];
      
      // Check if this is a competition header row
      const competitionRegex = /<td[^>]*?hauptlink[^>]*?>([\s\S]*?)<\/td>/i;
      const competitionMatch = rowHtml.match(competitionRegex);
      
      if (competitionMatch && competitionMatch[1]) {
        const competition = competitionMatch[1].replace(/<[^>]*>/g, '').trim();
        if (competition) {
          currentCompetition = competition;
          console.log(`Found competition: ${currentCompetition}`);
        }
        continue; // Skip processing this row as a fixture
      }
      
      // Try to extract date
      const dateRegex = /<td class="zentriert"[^>]*?>([\s\S]*?)<\/td>/i;
      const dateMatch = rowHtml.match(dateRegex);
      let date = new Date().toISOString().split('T')[0]; // Default to today
      
      if (dateMatch && dateMatch[1]) {
        const dateStr = dateMatch[1].replace(/<[^>]*>/g, '').trim();
        // Parse date in format DD.MM.YY or DD.MM.YYYY
        const dateParts = dateStr.split(/[\/\.-]/);
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          let year = dateParts[2];
          if (year.length === 2) {
            year = '20' + year;
          }
          date = `${year}-${month}-${day}`;
        }
      }
      
      // Extract time
      const timeRegex = /<td class="zentriert"[^>]*?>([\s\S]*?)<\/td>/i;
      const timeMatch = rowHtml.match(timeRegex);
      const time = timeMatch && timeMatch[1] ? timeMatch[1].replace(/<[^>]*>/g, '').trim() : '15:00';
      
      // Extract home/away indicator
      const homeAwayRegex = /<td class="zentriert"[^>]*?>([\s\S]*?)<\/td>/ig;
      let homeAwayMatches = [];
      while ((homeAwayMatches = homeAwayRegex.exec(rowHtml)) !== null) {
        if (homeAwayMatches.index > 0) break; // Get the second match
      }
      const isHome = homeAwayMatches && homeAwayMatches[1] && homeAwayMatches[1].toLowerCase().includes('h');
      
      // Extract teams and score
      const matchRegex = /<a[^>]*?>([\s\S]*?)<\/a>/i;
      const matchMatch = rowHtml.match(matchRegex);
      let matchText = matchMatch && matchMatch[1] ? matchMatch[1].replace(/<[^>]*>/g, '').trim() : '';
      
      let homeTeam = 'Unknown';
      let awayTeam = 'Unknown';
      let homeScore: number | null = null;
      let awayScore: number | null = null;
      let isCompleted = false;
      
      if (matchText.includes(':')) {
        // This is likely a completed match with score
        const scoreSplit = matchText.split(':');
        
        if (scoreSplit.length >= 2) {
          // Extract home team and score
          const homeScoreParts = scoreSplit[0].trim().split(/\s+/);
          if (homeScoreParts.length > 1) {
            homeScore = parseInt(homeScoreParts.pop() || '0', 10);
            homeTeam = homeScoreParts.join(' ');
          } else {
            homeTeam = homeScoreParts[0];
          }
          
          // Extract away team and score
          const awayScoreParts = scoreSplit[1].trim().split(/\s+/);
          if (awayScoreParts.length > 0) {
            awayScore = parseInt(awayScoreParts[0], 10);
            awayTeam = awayScoreParts.slice(1).join(' ');
          }
          
          isCompleted = true;
        }
      } else if (matchText.includes(' - ')) {
        // This is likely an upcoming match
        const teams = matchText.split(' - ');
        if (teams.length === 2) {
          homeTeam = teams[0].trim();
          awayTeam = teams[1].trim();
        }
      } else if (matchText.includes('vs')) {
        // Alternative format
        const teams = matchText.split('vs');
        if (teams.length === 2) {
          homeTeam = teams[0].trim();
          awayTeam = teams[1].trim();
        }
      }
      
      // If we're the away team, swap home and away
      if (!isHome && homeTeam.toLowerCase().includes('banks o') && !awayTeam.toLowerCase().includes('banks o')) {
        const tempTeam = homeTeam;
        homeTeam = awayTeam;
        awayTeam = tempTeam;
        
        if (isCompleted) {
          const tempScore = homeScore;
          homeScore = awayScore;
          awayScore = tempScore;
        }
      }
      
      // Determine venue (simple assumption)
      const venue = isHome ? "Spain Park" : "Away";
      
      // Only add if we have valid teams
      if (homeTeam !== 'Unknown' && awayTeam !== 'Unknown') {
        // Generate a unique ID for each fixture
        const fixtureId = `${date}-${homeTeam.substring(0, 3)}-${awayTeam.substring(0, 3)}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        fixtures.push({
          id: fixtureId,
          homeTeam,
          awayTeam,
          date,
          time,
          competition: currentCompetition,
          venue,
          isCompleted,
          homeScore,
          awayScore
        });
      }
    }
    
    console.log(`Found ${fixtures.length} fixtures`);
    return fixtures;
  } catch (error) {
    console.error('Error parsing fixtures:', error.message);
    return [];
  }
}
