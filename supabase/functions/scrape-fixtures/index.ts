
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Interface for scraped fixture data
interface ScrapedFixture {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  competition: string;
  venue?: string;
  isCompleted?: boolean;
  homeScore?: number;
  awayScore?: number;
  source: string;
}

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
}

// Create Supabase client with service role key
function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  return createClient(supabaseUrl, supabaseKey)
}

// Format date string to ISO format
function formatDate(dateStr: string): string {
  try {
    if (!dateStr) return '';
    
    // Remove day of week if present
    let cleanDateStr = dateStr.includes(',') ? dateStr.split(',')[1].trim() : dateStr.trim();
    
    // Extract month, day and year
    const parts = cleanDateStr.split(' ');
    if (parts.length < 3) return '';
    
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1].toLowerCase();
    let year = new Date().getFullYear();
    
    // Check if year is provided
    if (parts.length > 2 && !isNaN(parseInt(parts[2], 10))) {
      year = parseInt(parts[2], 10);
    }
    
    const months = {
      'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
      'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };
    
    const month = months[monthStr as keyof typeof months];
    
    if (!isNaN(day) && month !== undefined) {
      const date = new Date(year, month, day);
      return date.toISOString().split('T')[0];
    }
    
    return '';
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return '';
  }
}

// Extract fixtures from Highland Football League website
async function scrapeHighlandLeagueFixtures(url: string): Promise<ScrapedFixture[]> {
  console.log(`Scraping fixtures from ${url}`);
  
  try {
    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    console.log(`Successfully fetched HTML content, length: ${html.length}`);
    
    const $ = cheerio.load(html);
    const fixtures: ScrapedFixture[] = [];
    const competition = 'Scottish Highland League';
    const source = 'highland-football-league';
    
    // Find the fixtures table
    $('table').each((_, table) => {
      // Process each row in the table
      $(table).find('tr').each((_, row) => {
        const cells = $(row).find('td');
        
        // Skip header rows or invalid rows
        if (cells.length < 3) return;
        
        try {
          // Extract date, which should be in first cell
          const dateText = $(cells[0]).text().trim();
          if (!dateText) return;
          
          const date = formatDate(dateText);
          if (!date) {
            console.log(`Could not parse date: ${dateText}`);
            return;
          }
          
          // Extract fixture info (home team vs away team)
          const fixtureText = $(cells[1]).text().trim();
          if (!fixtureText || !fixtureText.includes('v')) {
            console.log(`Invalid fixture format: ${fixtureText}`);
            return;
          }
          
          // Split by 'v' to get home and away teams
          const teams = fixtureText.split('v').map(team => team.trim());
          if (teams.length !== 2) {
            console.log(`Could not extract teams from: ${fixtureText}`);
            return;
          }
          
          const homeTeam = teams[0].trim();
          const awayTeam = teams[1].trim();
          
          // Extract venue or score if available
          const venueOrScore = $(cells[2]).text().trim();
          
          // Check if this fixture is for Banks o' Dee
          const isBanksODee = 
            homeTeam.toLowerCase().includes("banks o' dee") || 
            homeTeam.toLowerCase().includes("banks o dee") || 
            awayTeam.toLowerCase().includes("banks o' dee") || 
            awayTeam.toLowerCase().includes("banks o dee");
          
          // If filtering for Banks o' Dee and this isn't a match, skip
          if (!isBanksODee) return;
          
          // Default time for fixtures
          const time = '15:00';
          
          // Create fixture object
          const fixture: ScrapedFixture = {
            homeTeam,
            awayTeam,
            date,
            time,
            competition,
            venue: venueOrScore,
            isCompleted: false,
            source
          };
          
          fixtures.push(fixture);
          console.log(`Found fixture: ${homeTeam} v ${awayTeam} on ${date}`);
        } catch (error) {
          console.error('Error parsing row:', error);
        }
      });
    });
    
    console.log(`Extracted ${fixtures.length} fixtures`);
    return fixtures;
  } catch (error) {
    console.error('Error scraping fixtures:', error);
    throw error;
  }
}

// Store fixtures in the database
async function storeFixtures(supabase: any, fixtures: ScrapedFixture[]): Promise<{added: number, updated: number}> {
  let added = 0;
  let updated = 0;

  try {
    // Process fixtures one by one
    for (const fixture of fixtures) {
      // Check if fixture already exists
      const { data: existingFixtures } = await supabase
        .from('fixtures')
        .select('id')
        .eq('home_team', fixture.homeTeam)
        .eq('away_team', fixture.awayTeam)
        .eq('date', fixture.date);
      
      if (existingFixtures && existingFixtures.length > 0) {
        // Update existing fixture
        const { error: updateError } = await supabase
          .from('fixtures')
          .update({
            competition: fixture.competition,
            venue: fixture.venue,
            time: fixture.time,
            source: fixture.source
          })
          .eq('id', existingFixtures[0].id);
        
        if (updateError) {
          console.error('Error updating fixture:', updateError);
          continue;
        }
        updated++;
      } else {
        // Insert new fixture
        const { error: insertError } = await supabase
          .from('fixtures')
          .insert([{
            home_team: fixture.homeTeam,
            away_team: fixture.awayTeam,
            date: fixture.date,
            time: fixture.time,
            competition: fixture.competition,
            venue: fixture.venue,
            is_completed: fixture.isCompleted,
            source: fixture.source
          }]);
        
        if (insertError) {
          console.error('Error inserting fixture:', insertError);
          continue;
        }
        added++;
      }
    }
    
    return { added, updated };
  } catch (error) {
    console.error('Error storing fixtures:', error);
    throw error;
  }
}

// Log scraping operation to database
async function logScrapeOperation(
  supabase: any, 
  source: string, 
  status: string, 
  itemsFound: number, 
  itemsAdded: number, 
  itemsUpdated: number,
  errorMessage?: string
) {
  try {
    await supabase.from('scrape_logs').insert({
      source,
      status,
      items_found: itemsFound,
      items_added: itemsAdded,
      items_updated: itemsUpdated,
      error_message: errorMessage
    });
  } catch (error) {
    console.error('Error logging scrape operation:', error);
  }
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const { url } = await req.json();
    const scrapeUrl = url || 'http://www.highlandfootballleague.com/Fixtures/';
    
    console.log(`Starting to scrape fixtures from ${scrapeUrl}`);
    
    // Initialize Supabase client
    const supabase = createSupabaseClient();
    
    // Scrape fixtures
    const fixtures = await scrapeHighlandLeagueFixtures(scrapeUrl);
    
    if (fixtures.length === 0) {
      console.log('No fixtures found');
      await logScrapeOperation(supabase, 'highland-league', 'warning', 0, 0, 0, 'No fixtures found');
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No fixtures found',
          data: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Store fixtures in database
    const { added, updated } = await storeFixtures(supabase, fixtures);
    console.log(`Stored ${fixtures.length} fixtures: added ${added}, updated ${updated}`);
    
    // Log success
    await logScrapeOperation(
      supabase, 
      'highland-league', 
      'success', 
      fixtures.length, 
      added, 
      updated
    );
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped and stored ${fixtures.length} fixtures`,
        data: fixtures
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Log error
    try {
      const supabase = createSupabaseClient();
      await logScrapeOperation(
        supabase,
        'highland-league',
        'error', 
        0,
        0,
        0,
        error instanceof Error ? error.message : 'Unknown error'
      );
    } catch (logError) {
      console.error('Error logging failure:', logError);
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error scraping fixtures',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
