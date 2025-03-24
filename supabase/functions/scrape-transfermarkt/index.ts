
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Parse request body
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "No URL provided" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    console.log(`Attempting to scrape fixtures from Transfermarkt URL: ${url}`);
    
    // Fetch data from Transfermarkt
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch from Transfermarkt: ${response.status} ${response.statusText}`);
      console.error(`Response: ${errorText.substring(0, 500)}...`);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to fetch from Transfermarkt: ${response.status} ${response.statusText}`,
          htmlSample: errorText.substring(0, 1000) // Include a sample of the response for debugging
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    const html = await response.text();
    
    // Sample of HTML for debugging
    const htmlSample = html.substring(0, 1000);
    console.log(`Successfully fetched HTML from Transfermarkt. Sample: ${htmlSample.substring(0, 200)}...`);
    
    // Parse HTML
    const $ = cheerio.load(html);
    const fixtures: any[] = [];

    // Get the table rows with fixture data
    const rows = $('table.items tbody tr:not(.bg_blau_20)');
    
    if (rows.length === 0) {
      console.error('No fixture rows found in the HTML');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "No fixtures found on Transfermarkt page",
          htmlSample 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    }
    
    console.log(`Found ${rows.length} potential fixture rows`);
    
    // Process each fixture row
    rows.each((i, row) => {
      try {
        // Skip header rows or rows without proper data
        if ($(row).find('td').length < 5) return;
        
        // Extract date
        const dateText = $(row).find('td.zentriert:first-child').text().trim();
        const date = parseTransfermarktDate(dateText);
        
        // Extract competition
        const competition = $(row).find('td:nth-child(3) a').text().trim() || "Highland League";
        
        // Extract teams
        const homeTeam = $(row).find('td.no-border-rechts a.vereinprofil_tooltip').text().trim();
        const awayTeam = $(row).find('td.no-border-links a.vereinprofil_tooltip').text().trim();
        
        // Extract scores if available
        const scoreElement = $(row).find('td:nth-child(5) a');
        const scoreText = scoreElement.text().trim();
        
        // Determine if match is completed
        const isCompleted = scoreText.includes(':');
        let homeScore = null;
        let awayScore = null;
        
        if (isCompleted) {
          const scoreParts = scoreText.split(':');
          if (scoreParts.length === 2) {
            homeScore = parseInt(scoreParts[0].trim());
            awayScore = parseInt(scoreParts[1].trim());
          }
        }
        
        // Generate a unique ID
        const id = `transfermarkt-${date}-${homeTeam}-${awayTeam}`.replace(/\s+/g, '-').toLowerCase();
        
        // Extract time if available
        const timeElement = $(row).find('td.zentriert:nth-child(2)');
        const time = timeElement.text().trim() || '15:00';
        
        // Add fixture to array
        fixtures.push({
          id,
          date,
          time,
          competition,
          homeTeam,
          awayTeam,
          venue: homeTeam.includes("Banks O'") ? "Spain Park" : "Away",
          isCompleted,
          homeScore,
          awayScore
        });
        
        console.log(`Parsed fixture: ${date} - ${homeTeam} vs ${awayTeam}`);
      } catch (error) {
        console.error(`Error parsing row ${i}:`, error);
      }
    });
    
    // Return the parsed fixtures
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: fixtures, 
        count: fixtures.length,
        source: "Transfermarkt",
        url
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error in scrape-transfermarkt function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error occurred"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

// Helper function to parse Transfermarkt date format
function parseTransfermarktDate(dateText: string): string {
  try {
    // Handle various date formats
    // Convert from DD/MM/YY or DD.MM.YY to YYYY-MM-DD
    let dateParts: string[] = [];
    
    if (dateText.includes('/')) {
      dateParts = dateText.split('/');
    } else if (dateText.includes('.')) {
      dateParts = dateText.split('.');
    } else {
      // If we can't parse the date, return today's date
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    
    if (dateParts.length === 3) {
      let [day, month, year] = dateParts;
      
      // Handle 2-digit year
      if (year.length === 2) {
        year = `20${year}`;  // Assuming all dates are in the 21st century
      }
      
      // Ensure month and day are two digits
      if (month.length === 1) month = `0${month}`;
      if (day.length === 1) day = `0${day}`;
      
      return `${year}-${month}-${day}`;
    }
    
    // If we can't parse the date, return today's date
    const today = new Date();
    return today.toISOString().split('T')[0];
  } catch (e) {
    console.error("Error parsing date:", e);
    // Fallback to today's date
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
