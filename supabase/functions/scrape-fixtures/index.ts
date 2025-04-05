
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { parse } from 'https://esm.sh/node-html-parser@6.1.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedFixture {
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue?: string;
  isCompleted: boolean;
  homeScore?: number;
  awayScore?: number;
  source: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get supabase client
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const { action } = await req.json();
    
    // Handle test action
    if (action === 'test') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Scraper connection test successful',
          fixtures: [
            {
              date: '2025-05-10',
              time: '15:00',
              homeTeam: 'Banks o\' Dee',
              awayTeam: 'Test Opponent FC',
              competition: 'Highland League',
              venue: 'Spain Park',
              isCompleted: false,
              source: 'test'
            }
          ]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Handle BBC fixtures scraping
    if (action === 'bbc') {
      const fixtures = await scrapeBBCFixtures();
      
      if (fixtures.length > 0) {
        // Log the scrape operation
        await supabase
          .from('scrape_logs')
          .insert({
            source: 'bbc',
            status: 'completed',
            items_found: fixtures.length,
            items_added: fixtures.length, // Placeholder, actual counts would be tracked after insertion
            items_updated: 0
          });
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `Scraped ${fixtures.length} fixtures from BBC Sport`,
          fixtures
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Handle Highland League fixtures scraping
    if (action === 'hfl') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Highland League scraper not implemented yet'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Unknown action: ${action}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scraper function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

// BBC Sport scraper function
async function scrapeBBCFixtures(): Promise<ScrapedFixture[]> {
  try {
    const url = 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch BBC Sport page: ${response.statusText}`);
    }
    
    const html = await response.text();
    const root = parse(html);
    
    // Find all fixture elements
    const fixtureElements = root.querySelectorAll('.qa-match-block');
    const fixtures: ScrapedFixture[] = [];
    
    // This is a simplified scraper - in reality you would need more complex logic
    // to handle different fixture formats, dates, etc.
    for (const element of fixtureElements) {
      const dateElement = element.querySelector('.gel-minion');
      const matchElements = element.querySelectorAll('.sp-c-fixture');
      
      if (!dateElement || matchElements.length === 0) continue;
      
      const dateStr = dateElement.textContent.trim();
      const date = parseDate(dateStr);
      
      for (const match of matchElements) {
        const homeTeam = match.querySelector('.sp-c-fixture__team--home .sp-c-fixture__team-name')?.textContent.trim();
        const awayTeam = match.querySelector('.sp-c-fixture__team--away .sp-c-fixture__team-name')?.textContent.trim();
        
        if (!homeTeam || !awayTeam) continue;
        
        // Check if it's a Banks o' Dee match
        if (homeTeam.includes('Banks') || awayTeam.includes('Banks')) {
          const timeElement = match.querySelector('.sp-c-fixture__time');
          const scoreElement = match.querySelector('.sp-c-fixture__score');
          let time = '15:00';
          let isCompleted = false;
          let homeScore: number | undefined;
          let awayScore: number | undefined;
          
          if (timeElement) {
            time = timeElement.textContent.trim();
          }
          
          if (scoreElement) {
            isCompleted = true;
            const scoreText = scoreElement.textContent.trim();
            const scoreParts = scoreText.split('-').map(s => parseInt(s.trim()));
            
            if (scoreParts.length === 2 && !isNaN(scoreParts[0]) && !isNaN(scoreParts[1])) {
              homeScore = scoreParts[0];
              awayScore = scoreParts[1];
            }
          }
          
          fixtures.push({
            date,
            time,
            homeTeam,
            awayTeam,
            competition: 'Highland League', // Default, would need more logic to determine
            isCompleted,
            homeScore,
            awayScore,
            source: 'bbc-sport'
          });
        }
      }
    }
    
    return fixtures;
  } catch (error) {
    console.error('Error scraping BBC fixtures:', error);
    throw new Error(`BBC scraping failed: ${error.message}`);
  }
}

// Helper to parse date string
function parseDate(dateStr: string): string {
  try {
    // This is a simplified example - you would need more complex date parsing in practice
    const months: Record<string, string> = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
      'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    };
    
    // Example: "Saturday, 10th May 2025"
    const parts = dateStr.toLowerCase().replace(',', '').split(' ');
    
    let day = '';
    let month = '';
    let year = '';
    
    for (const part of parts) {
      // Extract day (handle cases like '1st', '2nd', '3rd', '4th')
      if (part.match(/\d+[a-z]{2}/)) {
        day = part.replace(/[a-z]/g, '').padStart(2, '0');
      }
      
      // Extract month
      for (const [monthName, monthNum] of Object.entries(months)) {
        if (part.includes(monthName)) {
          month = monthNum;
          break;
        }
      }
      
      // Extract year (4 digits)
      if (part.match(/^\d{4}$/)) {
        year = part;
      }
    }
    
    if (day && month && year) {
      return `${year}-${month}-${day}`;
    }
    
    // Fallback - use current date
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error parsing date:', error);
    // Fallback to current date
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  }
}
