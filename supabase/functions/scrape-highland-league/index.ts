
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

// Define the CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Structure for a scraped fixture
interface ScrapedFixture {
  id?: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue?: string;
  isCompleted?: boolean;
  homeScore?: number;
  awayScore?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request parameters
    const { action = 'fixtures' } = await req.json();
    const fixtures: ScrapedFixture[] = [];
    
    console.log(`Scraping Highland League ${action}`);
    
    // Scrape from Highland Football League website
    if (action === 'fixtures') {
      const url = 'https://www.highlandfootballleague.com/fixtures-results/';
      const response = await fetch(url);
      const html = await response.text();
      fixtures.push(...await scrapeFixtures(html));
    } else if (action === 'results') {
      const url = 'https://www.highlandfootballleague.com/fixtures-results/results/';
      const response = await fetch(url);
      const html = await response.text();
      fixtures.push(...await scrapeResults(html));
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, fixtures, count: fixtures.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error scraping fixtures:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An error occurred while scraping fixtures',
        fixtures: []
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Function to scrape fixtures from HTML
async function scrapeFixtures(html: string): Promise<ScrapedFixture[]> {
  try {
    const fixtures: ScrapedFixture[] = [];
    const doc = new DOMParser().parseFromString(html, 'text/html');
    if (!doc) return fixtures;

    // Find fixture tables
    const fixtureTables = doc.querySelectorAll('.avia-data-table');
    
    for (const table of fixtureTables) {
      // Get competition from table header
      const caption = table.querySelector('caption')?.textContent.trim();
      const competition = caption || 'Highland League';
      
      // Process each row
      const rows = table.querySelectorAll('tbody tr');
      
      for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) continue;
        
        // Extract data from cells
        const dateParts = cells[0].textContent.trim().split(' ');
        const date = dateParts.slice(0, 3).join(' '); // Date format: "Saturday 6th April"
        const time = dateParts.length > 3 ? dateParts[3] : '15:00';
        
        const teams = cells[1].textContent.trim().split(' v ');
        if (teams.length !== 2) continue;
        
        const homeTeam = teams[0].trim();
        const awayTeam = teams[1].trim();
        const venue = cells[2]?.textContent.trim() || '';
        
        fixtures.push({
          date: formatDate(date),
          time,
          homeTeam,
          awayTeam,
          competition,
          venue,
          isCompleted: false
        });
      }
    }
    
    return fixtures;
  } catch (error) {
    console.error('Error parsing fixtures:', error);
    return [];
  }
}

// Function to scrape results from HTML
async function scrapeResults(html: string): Promise<ScrapedFixture[]> {
  try {
    const results: ScrapedFixture[] = [];
    const doc = new DOMParser().parseFromString(html, 'text/html');
    if (!doc) return results;

    // Find result tables
    const resultTables = doc.querySelectorAll('.avia-data-table');
    
    for (const table of resultTables) {
      // Get competition from table header
      const caption = table.querySelector('caption')?.textContent.trim();
      const competition = caption || 'Highland League';
      
      // Process each row
      const rows = table.querySelectorAll('tbody tr');
      
      for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) continue;
        
        // Extract data from cells
        const dateText = cells[0].textContent.trim();
        const date = formatDate(dateText);
        
        const matchDetails = cells[1].textContent.trim();
        const scoreMatch = matchDetails.match(/(.+?)\s+(\d+)\s*[-:]\s*(\d+)\s+(.+)/);
        
        if (!scoreMatch) continue;
        
        const [, homeTeam, homeScoreStr, awayScoreStr, awayTeam] = scoreMatch;
        const homeScore = parseInt(homeScoreStr, 10);
        const awayScore = parseInt(awayScoreStr, 10);
        
        results.push({
          date,
          time: '15:00', // Default time as it's often not provided for results
          homeTeam: homeTeam.trim(),
          awayTeam: awayTeam.trim(),
          competition,
          isCompleted: true,
          homeScore,
          awayScore
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error parsing results:', error);
    return [];
  }
}

// Helper function to format date strings
function formatDate(dateStr: string): string {
  try {
    // Convert text date like "Saturday 6th April 2023" to ISO format
    const months = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    
    // Extract parts from the date string
    const parts = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1').split(' ');
    if (parts.length < 2) return new Date().toISOString().split('T')[0];
    
    // Handle different date formats
    let day, month, year;
    
    // Check if the format includes a day name (e.g., "Saturday 6th April")
    if (parts.length >= 3 && isNaN(parseInt(parts[0]))) {
      day = parseInt(parts[1], 10);
      month = months[parts[2]] || 0;
    } else {
      day = parseInt(parts[0], 10);
      month = months[parts[1]] || 0;
    }
    
    // Use current year if not specified
    year = parts.find(p => p.length === 4 && !isNaN(parseInt(p)))
      ? parseInt(parts.find(p => p.length === 4 && !isNaN(parseInt(p))), 10)
      : new Date().getFullYear();
    
    // Create and format the date
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', error, dateStr);
    return new Date().toISOString().split('T')[0];
  }
}
