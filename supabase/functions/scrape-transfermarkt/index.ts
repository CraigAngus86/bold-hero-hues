
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
    
    // Fetch data from Transfermarkt with improved headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
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
          status: 200 // Return 200 so we can handle the error gracefully on the client
        }
      );
    }

    const html = await response.text();
    console.log(`Raw HTML length: ${html.length} characters`);
    
    // Sample of HTML for debugging
    const htmlSample = html.substring(0, 1000);
    console.log(`HTML Sample: ${htmlSample.substring(0, 200)}...`);
    
    // Generate mock data for debugging or if scraping fails
    const generateMockFixtures = () => {
      console.log("Generating mock fixtures as fallback");
      const fixtures = [];
      const teams = ["Banks O' Dee FC", "Brechin City FC", "Buckie Thistle FC", "Fraserburgh FC", "Formartine United FC"];
      const competitions = ["Highland League", "Scottish Cup", "League Cup"];
      
      // Generate 10 fixtures
      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        const isHome = i % 2 === 0;
        const opponent = teams[Math.floor(Math.random() * (teams.length - 1)) + 1];
        
        fixtures.push({
          id: `mock-${dateString}-${i}`,
          date: dateString,
          time: "15:00",
          competition: competitions[i % competitions.length],
          homeTeam: isHome ? "Banks O' Dee FC" : opponent,
          awayTeam: isHome ? opponent : "Banks O' Dee FC",
          venue: isHome ? "Spain Park" : "Away",
          isCompleted: false
        });
      }
      
      return fixtures;
    };
    
    // Parse HTML
    const $ = cheerio.load(html);
    let fixtures: any[] = [];

    // Log selectors we're trying
    console.log("Looking for fixture tables...");
    
    // New improved approach - directly target the box with fixtures (more reliable)
    console.log("Trying to find the main fixture box");
    
    // First, check if we're viewing a specific competition's fixtures
    const isCompetitionView = url.includes('wettbewerb_id=') && !url.includes('wettbewerb_id=&');
    
    // Find fixtures in different ways depending on page structure
    if (isCompetitionView) {
      console.log("Using competition-specific selectors");
      extractCompetitionFixtures($, fixtures);
    } else {
      // This is likely the all competitions view
      console.log("Using all-competitions selectors");
      extractAllCompetitionsFixtures($, fixtures);
    }
    
    // Additional fallback approach - try to extract from any table on the page
    if (fixtures.length === 0) {
      console.log("Trying generic table extraction approach");
      $('table').each((i, table) => {
        const tableRows = $(table).find('tr');
        console.log(`Found table #${i+1} with ${tableRows.length} rows`);
        
        if (tableRows.length > 1) {
          extractFixturesFromTable($, tableRows, fixtures);
        }
      });
    }
    
    // If we still don't have fixtures, try a very aggressive approach looking for any potential match data
    if (fixtures.length === 0) {
      console.log("Using aggressive pattern matching for fixtures");
      extractFixturesByPatternMatching($, fixtures);
    }
    
    // Clean up and deduplicate fixtures
    if (fixtures.length > 0) {
      fixtures = deduplicateFixtures(fixtures);
      fixtures = cleanupFixtures(fixtures);
      
      console.log(`Final fixtures after cleanup: ${fixtures.length}`);
    }
    
    // If we still don't have fixtures, generate mock data
    if (fixtures.length === 0) {
      console.log('No fixtures found in HTML, generating mock fixtures as fallback');
      const mockFixtures = generateMockFixtures();
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: mockFixtures, 
          count: mockFixtures.length,
          source: "Mock Data (Transfermarkt scraping failed)",
          htmlSample,
          message: "Used mock fixtures as no real fixtures could be extracted from Transfermarkt"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    }
    
    console.log(`Successfully extracted ${fixtures.length} fixtures`);
    
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

// Handle competition-specific fixture page
function extractCompetitionFixtures($: cheerio.CheerioAPI, fixtures: any[]) {
  // Competition pages typically have fixtures in a table with specific structure
  const fixtureRows = $('table.spielplandatum tr');
  console.log(`Found ${fixtureRows.length} rows in competition view`);
  
  // Get competition name
  const competitionName = $('.spieltaguberschrift, .table-header').first().text().trim() || 'Highland League';
  console.log(`Competition name: ${competitionName}`);
  
  fixtureRows.each((i, row) => {
    try {
      const cells = $(row).find('td');
      
      // Skip header rows or rows with insufficient cells
      if (cells.length < 3) return;
      
      // Extract date - could be in a separate row or in first column
      let dateText = $(cells[0]).text().trim();
      const datePattern = /\d{2}[./-]\d{2}[./-]\d{2,4}/;
      
      // If first cell doesn't have a date, check if this is actually a competition header row
      if (!datePattern.test(dateText)) {
        // This might be a competition header or not a fixture row, skip it
        return;
      }
      
      // Format date properly
      const date = formatDate(dateText);
      
      // Extract time (typically in second column)
      const timeText = $(cells[1]).text().trim();
      const time = timeText.match(/\d{1,2}:\d{2}/) ? timeText : '15:00';
      
      // Extract teams - typically in one of the later columns with specific format
      const matchCell = cells.find((idx, cell) => {
        const cellText = $(cell).text().trim();
        return cellText.includes(' - ') || cellText.includes(' : ') || cellText.includes(' vs ');
      });
      
      if (matchCell) {
        const matchText = $(matchCell).text().trim();
        let homeTeam = '', awayTeam = '';
        let homeScore = null, awayScore = null;
        let isCompleted = false;
        
        // Try different separators
        if (matchText.includes(' - ')) {
          [homeTeam, awayTeam] = matchText.split(' - ').map(t => t.trim());
        } else if (matchText.includes(' : ')) {
          const parts = matchText.split(' : ');
          homeTeam = parts[0].trim();
          awayTeam = parts[1].trim();
        } else if (matchText.includes(' vs ')) {
          [homeTeam, awayTeam] = matchText.split(' vs ').map(t => t.trim());
        }
        
        // Check for scores (indicating completed match)
        const scoreMatch = matchText.match(/(\d+)\s*[:]\s*(\d+)/);
        if (scoreMatch) {
          homeScore = parseInt(scoreMatch[1]);
          awayScore = parseInt(scoreMatch[2]);
          isCompleted = true;
          
          // If match has score, separate the team names from scores
          homeTeam = homeTeam.replace(/\d+$/, '').trim();
          awayTeam = awayTeam.replace(/^\d+/, '').trim();
        }
        
        // If we have valid teams, add the fixture
        if (homeTeam && awayTeam) {
          const fixtureId = `transfermarkt-${date}-${homeTeam}-${awayTeam}`.replace(/\s+/g, '-').toLowerCase();
          
          fixtures.push({
            id: fixtureId,
            date,
            time,
            competition: competitionName,
            homeTeam,
            awayTeam,
            venue: homeTeam.includes("Banks O") ? "Spain Park" : "Away",
            isCompleted,
            homeScore,
            awayScore
          });
        }
      }
    } catch (err) {
      console.error(`Error parsing competition fixture row:`, err);
    }
  });
}

// Handle all-competitions fixtures page
function extractAllCompetitionsFixtures($: cheerio.CheerioAPI, fixtures: any[]) {
  // This view typically has sections for each competition
  $('.box').each((boxIndex, box) => {
    // Try to find competition name
    const competitionName = $(box).find('.spieltaguberschrift, .table-header').first().text().trim() || 'Highland League';
    
    if (competitionName) {
      console.log(`Processing competition: ${competitionName}`);
      
      // Find fixture table in this box
      const fixtureRows = $(box).find('table tr');
      console.log(`Found ${fixtureRows.length} rows for ${competitionName}`);
      
      let currentDate = '';
      
      fixtureRows.each((i, row) => {
        try {
          // Check if this is a date row (typically has fewer cells and contains a date)
          const dateCell = $(row).find('td.spieltagsansetzung');
          if (dateCell.length) {
            const dateText = dateCell.text().trim();
            const dateMatch = dateText.match(/\d{2}[./-]\d{2}[./-]\d{2,4}/);
            if (dateMatch) {
              currentDate = formatDate(dateMatch[0]);
              console.log(`Found date: ${currentDate}`);
            }
            return; // Skip this row, it's just a date header
          }
          
          // Regular fixture row
          const cells = $(row).find('td');
          
          // Skip rows with too few cells
          if (cells.length < 3) return;
          
          // Extract time
          const timeCell = cells.filter((idx, cell) => {
            const cellText = $(cell).text().trim();
            return cellText.match(/\d{1,2}:\d{2}/);
          });
          
          const time = timeCell.length ? timeCell.first().text().trim() : '15:00';
          
          // Extract teams
          let homeTeam = '', awayTeam = '';
          let homeScore = null, awayScore = null;
          let isCompleted = false;
          
          // Look for cells with team names
          cells.each((cellIdx, cell) => {
            const cellText = $(cell).text().trim();
            
            // Check various patterns for team vs team
            if (cellText.includes(' - ') || cellText.includes(' : ') || cellText.includes(' vs ')) {
              let matchText = cellText;
              
              // Extract teams based on separator
              if (matchText.includes(' - ')) {
                [homeTeam, awayTeam] = matchText.split(' - ').map(t => t.trim());
              } else if (matchText.includes(' : ')) {
                const parts = matchText.split(' : ');
                homeTeam = parts[0].trim();
                awayTeam = parts[1].trim();
              } else if (matchText.includes(' vs ')) {
                [homeTeam, awayTeam] = matchText.split(' vs ').map(t => t.trim());
              }
              
              // Check for scores
              const scoreMatch = matchText.match(/(\d+)\s*[:]\s*(\d+)/);
              if (scoreMatch) {
                homeScore = parseInt(scoreMatch[1]);
                awayScore = parseInt(scoreMatch[2]);
                isCompleted = true;
                
                // Clean up team names
                homeTeam = homeTeam.replace(/\d+$/, '').trim();
                awayTeam = awayTeam.replace(/^\d+/, '').trim();
              }
            }
          });
          
          // If we found teams and have a date, add the fixture
          if (homeTeam && awayTeam && currentDate) {
            const fixtureId = `transfermarkt-${currentDate}-${homeTeam}-${awayTeam}`.replace(/\s+/g, '-').toLowerCase();
            
            fixtures.push({
              id: fixtureId,
              date: currentDate,
              time,
              competition: competitionName,
              homeTeam,
              awayTeam,
              venue: homeTeam.includes("Banks O") ? "Spain Park" : "Away",
              isCompleted,
              homeScore,
              awayScore
            });
          }
        } catch (err) {
          console.error(`Error parsing all-competitions fixture row:`, err);
        }
      });
    }
  });
}

// Extract fixtures from a generic table
function extractFixturesFromTable($: cheerio.CheerioAPI, rows: cheerio.Cheerio, fixtures: any[]) {
  let currentDate = '';
  let currentCompetition = 'Highland League';
  
  rows.each((i, row) => {
    try {
      const rowText = $(row).text().trim();
      
      // Check if this is a date row
      const dateMatch = rowText.match(/\d{2}[./-]\d{2}[./-]\d{2,4}/);
      if (dateMatch && $(row).find('td').length <= 2) {
        currentDate = formatDate(dateMatch[0]);
        console.log(`Found date row: ${currentDate}`);
        return;
      }
      
      // Check if this is a competition header
      const headerCells = $(row).find('th');
      if (headerCells.length > 0) {
        const headerText = $(headerCells[0]).text().trim();
        if (headerText && !headerText.match(/^\d+$/)) {
          currentCompetition = headerText;
          console.log(`Found competition header: ${currentCompetition}`);
        }
        return;
      }
      
      // Process regular fixture row
      const cells = $(row).find('td');
      
      // Need at least 3 cells for a valid fixture
      if (cells.length < 3) return;
      
      // Try to extract time
      let time = '15:00';
      cells.each((idx, cell) => {
        const cellText = $(cell).text().trim();
        const timeMatch = cellText.match(/^(\d{1,2}:\d{2})$/);
        if (timeMatch) {
          time = timeMatch[0];
        }
      });
      
      // Try to extract teams and score
      let homeTeam = '', awayTeam = '';
      let homeScore = null, awayScore = null;
      let isCompleted = false;
      
      // Look for team names in cells
      cells.each((idx, cell) => {
        const cellText = $(cell).text().trim();
        
        // Check for "Team vs Team" or "Team - Team" patterns
        if (cellText.includes(' vs ') || cellText.includes(' - ') || cellText.includes(' : ')) {
          let separator = ' vs ';
          if (cellText.includes(' - ')) separator = ' - ';
          if (cellText.includes(' : ')) separator = ' : ';
          
          const parts = cellText.split(separator);
          if (parts.length >= 2) {
            homeTeam = parts[0].trim();
            awayTeam = parts[1].trim();
            
            // Check for score (typical format: Team 2:1 Team)
            const scoreMatch = cellText.match(/(\d+)\s*[:]\s*(\d+)/);
            if (scoreMatch) {
              homeScore = parseInt(scoreMatch[1]);
              awayScore = parseInt(scoreMatch[2]);
              isCompleted = true;
              
              // Clean up team names if they contain scores
              homeTeam = homeTeam.replace(/\d+$/, '').trim();
              awayTeam = awayTeam.replace(/^\d+/, '').trim();
            }
          }
        }
      });
      
      // Use date from the row if available
      if (!currentDate) {
        cells.each((idx, cell) => {
          const cellText = $(cell).text().trim();
          const dateMatch = cellText.match(/\d{2}[./-]\d{2}[./-]\d{2,4}/);
          if (dateMatch) {
            currentDate = formatDate(dateMatch[0]);
          }
        });
      }
      
      // If we have no date yet, use today's date
      if (!currentDate) {
        const today = new Date();
        currentDate = today.toISOString().split('T')[0];
      }
      
      // If we have valid teams, add the fixture
      if (homeTeam && awayTeam) {
        const fixtureId = `transfermarkt-${currentDate}-${homeTeam}-${awayTeam}`.replace(/\s+/g, '-').toLowerCase();
        
        fixtures.push({
          id: fixtureId,
          date: currentDate,
          time,
          competition: currentCompetition,
          homeTeam,
          awayTeam,
          venue: homeTeam.includes("Banks O") ? "Spain Park" : "Away",
          isCompleted,
          homeScore,
          awayScore
        });
      }
    } catch (err) {
      console.error(`Error parsing table row:`, err);
    }
  });
}

// Extract fixtures by pattern matching (last resort approach)
function extractFixturesByPatternMatching($: cheerio.CheerioAPI, fixtures: any[]) {
  const banksRegex = /Banks\s*O['\s]*Dee/i;
  
  // Function to scan text for date
  const findDate = (text: string): string | null => {
    const dateMatches = text.match(/\d{2}[./-]\d{2}[./-]\d{2,4}/);
    if (dateMatches) {
      return formatDate(dateMatches[0]);
    }
    return null;
  };
  
  // First find dates on the page
  const dates: string[] = [];
  $('*').each((i, el) => {
    const text = $(el).text().trim();
    const date = findDate(text);
    if (date && !dates.includes(date)) {
      dates.push(date);
    }
  });
  
  console.log(`Found ${dates.length} potential dates on page`);
  
  // If no dates found, use current date
  if (dates.length === 0) {
    dates.push(new Date().toISOString().split('T')[0]);
  }
  
  // Look for text that mentions Banks O' Dee and might be a fixture
  $('*').each((i, el) => {
    const text = $(el).text().trim();
    
    // Skip elements with very short text
    if (text.length < 5) return;
    
    // Check if this element mentions Banks O' Dee
    if (banksRegex.test(text)) {
      // This might be a fixture, look for patterns
      const vsMatch = text.match(/(.+?)\s+(?:vs|v\.|-|:)\s+(.+)/i);
      
      if (vsMatch) {
        let homeTeam = vsMatch[1].trim();
        let awayTeam = vsMatch[2].trim();
        
        // Clean up team names
        homeTeam = homeTeam.replace(/\d+\s*[:]\s*\d+\s*$/, '').trim();
        awayTeam = awayTeam.replace(/^\s*\d+\s*[:]\s*\d+/, '').trim();
        
        // Skip if either team name is too short
        if (homeTeam.length < 3 || awayTeam.length < 3) return;
        
        // Check for score
        const scoreMatch = text.match(/(\d+)\s*[:]\s*(\d+)/);
        let homeScore = null, awayScore = null;
        let isCompleted = false;
        
        if (scoreMatch) {
          homeScore = parseInt(scoreMatch[1]);
          awayScore = parseInt(scoreMatch[2]);
          isCompleted = true;
        }
        
        // Use the closest date we've found
        const date = dates[0];
        
        // Generate ID
        const fixtureId = `transfermarkt-${date}-${homeTeam}-${awayTeam}`.replace(/\s+/g, '-').toLowerCase();
        
        // Add to fixtures
        fixtures.push({
          id: fixtureId,
          date,
          time: '15:00', // Default time
          competition: 'Highland League',
          homeTeam,
          awayTeam,
          venue: homeTeam.match(banksRegex) ? "Spain Park" : "Away",
          isCompleted,
          homeScore,
          awayScore
        });
      }
    }
  });
}

// Helper function to format date consistently
function formatDate(dateText: string): string {
  try {
    if (!dateText) {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    
    // Try to handle various date formats
    let year, month, day;
    
    // Format: YYYY-MM-DD
    if (dateText.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateText;
    }
    
    // Format: DD.MM.YYYY or DD/MM/YYYY
    const dateMatch = dateText.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
    if (dateMatch) {
      day = dateMatch[1].padStart(2, '0');
      month = dateMatch[2].padStart(2, '0');
      year = dateMatch[3];
      
      // Handle 2-digit years
      if (year.length === 2) {
        year = '20' + year;
      }
      
      return `${year}-${month}-${day}`;
    }
    
    // If we can't parse it, return today's date
    const today = new Date();
    return today.toISOString().split('T')[0];
  } catch (e) {
    console.error("Error formatting date:", e);
    // Fallback to today's date
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}

// Remove duplicate fixtures
function deduplicateFixtures(fixtures: any[]): any[] {
  const seen = new Set();
  return fixtures.filter(fixture => {
    const key = `${fixture.date}-${fixture.homeTeam}-${fixture.awayTeam}`.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Clean up fixture data
function cleanupFixtures(fixtures: any[]): any[] {
  return fixtures.map(fixture => {
    // Ensure Banks O' Dee appears in either home or away team
    const hasBanks = fixture.homeTeam.toLowerCase().includes('banks') || 
                      fixture.awayTeam.toLowerCase().includes('banks');
    
    // Skip fixtures not involving Banks O' Dee
    if (!hasBanks) {
      // Try to set one of the teams to Banks O' Dee based on venue
      if (fixture.venue === "Spain Park") {
        fixture.homeTeam = "Banks O' Dee FC";
      } else {
        fixture.awayTeam = "Banks O' Dee FC";
      }
    }
    
    // Clean up team names
    fixture.homeTeam = cleanTeamName(fixture.homeTeam);
    fixture.awayTeam = cleanTeamName(fixture.awayTeam);
    
    // Ensure proper date format
    if (fixture.date && typeof fixture.date === 'string') {
      // Check if date is in the strange format seen in logs
      if (fixture.date.match(/\d{4}-\d{1,2}-\d{1,2}/)) {
        fixture.date = fixture.date;
      } else {
        // Try to fix invalid date format
        const parts = fixture.date.split('-');
        if (parts.length === 3) {
          fixture.date = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        }
      }
    }
    
    return fixture;
  });
}

// Helper to clean team names
function cleanTeamName(name: string): string {
  if (!name) return "Unknown Team";
  
  // Fix Banks O' Dee spelling variations
  if (name.toLowerCase().includes('banks') && name.toLowerCase().includes('dee')) {
    return "Banks O' Dee FC";
  }
  
  // If the name is just a number, it's invalid
  if (/^\d+$/.test(name)) {
    return "Unknown Team";
  }
  
  // Remove any trailing numbers that might be scores
  name = name.replace(/\s+\d+$/, '');
  
  // Make sure first letter is capitalized
  return name.charAt(0).toUpperCase() + name.slice(1);
}
