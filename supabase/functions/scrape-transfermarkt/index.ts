
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
          status: 500 
        }
      );
    }

    const html = await response.text();
    console.log(`Raw HTML length: ${html.length} characters`);
    
    // Sample of HTML for debugging
    const htmlSample = html.substring(0, 1000);
    console.log(`HTML Sample: ${htmlSample.substring(0, 200)}...`);
    
    // Parse HTML
    const $ = cheerio.load(html);
    const fixtures: any[] = [];

    // Log selectors we're trying
    console.log("Looking for fixture tables...");
    
    // Try different table selectors that might be used on Transfermarkt
    // Approach 1: Look for box with id="yw1" containing fixtures
    console.log("Trying approach 1: box with id='yw1'");
    const fixtureBox = $('#yw1');
    
    if (fixtureBox.length) {
      console.log("Found fixture box with id='yw1'");
      const rows = fixtureBox.find('table.items tbody tr');
      console.log(`Found ${rows.length} rows in fixture box`);
      
      if (rows.length > 0) {
        extractFixturesFromRows(rows, $, fixtures);
      }
    }
    
    // Approach 2: Try looking for the standard table.items
    if (fixtures.length === 0) {
      console.log("Trying approach 2: standard table.items selector");
      const tableRows = $('table.items tbody tr');
      console.log(`Found ${tableRows.length} rows with table.items selector`);
      
      if (tableRows.length > 0) {
        extractFixturesFromRows(tableRows, $, fixtures);
      }
    }
    
    // Approach 3: Try looking for div.responsive-table and then find tables
    if (fixtures.length === 0) {
      console.log("Trying approach 3: div.responsive-table selector");
      const responsiveTables = $('div.responsive-table');
      console.log(`Found ${responsiveTables.length} responsive tables`);
      
      if (responsiveTables.length > 0) {
        responsiveTables.each((i, element) => {
          const tableRows = $(element).find('table tbody tr');
          console.log(`Found ${tableRows.length} rows in responsive table ${i+1}`);
          
          if (tableRows.length > 0) {
            extractFixturesFromRows(tableRows, $, fixtures);
          }
        });
      }
    }
    
    // Approach 4: Try a very generic approach to find any tables with date/match information
    if (fixtures.length === 0) {
      console.log("Trying approach 4: generic table approach");
      $('table').each((i, table) => {
        const tableElement = $(table);
        // Check if this table has enough rows and columns to potentially be a fixture table
        const rows = tableElement.find('tbody tr');
        
        if (rows.length > 0) {
          console.log(`Checking table ${i+1} with ${rows.length} rows`);
          // Sample a row to see if it might contain fixture data
          const sampleRow = $(rows[0]);
          const cells = sampleRow.find('td');
          
          if (cells.length >= 3) {
            console.log(`Table ${i+1} has ${cells.length} cells in first row, might be a fixture table`);
            extractFixturesFromRows(rows, $, fixtures);
          }
        }
      });
    }
    
    // If we still don't have fixtures, try one last generic approach
    if (fixtures.length === 0) {
      console.log("Trying approach 5: looking for any match elements");
      
      // Look for divs that might contain match information
      $('div').each((i, div) => {
        const divElement = $(div);
        const text = divElement.text();
        
        // If the div text contains common fixture patterns
        if (text.includes('vs') || text.includes(' - ') || text.includes(':')) {
          console.log(`Found potential match text: ${text}`);
          
          // Try to extract date information
          const dateElement = divElement.prev().find('time');
          const dateText = dateElement.length ? dateElement.attr('datetime') || dateElement.text() : '';
          
          if (dateText) {
            console.log(`With potential date: ${dateText}`);
            
            // Extract teams
            let homeTeam = '', awayTeam = '';
            
            if (text.includes('vs')) {
              [homeTeam, awayTeam] = text.split('vs').map(t => t.trim());
            } else if (text.includes(' - ')) {
              [homeTeam, awayTeam] = text.split(' - ').map(t => t.trim());
            }
            
            if (homeTeam && awayTeam) {
              fixtures.push({
                id: `transfermarkt-${dateText}-${homeTeam}-${awayTeam}`.replace(/\s+/g, '-').toLowerCase(),
                date: formatDate(dateText),
                time: '15:00', // Default time
                competition: 'Highland League',
                homeTeam,
                awayTeam,
                venue: homeTeam.includes("Banks O'") ? "Spain Park" : "Away",
                isCompleted: false
              });
            }
          }
        }
      });
    }
    
    // Log the HTML structure for debugging if no fixtures found
    if (fixtures.length === 0) {
      console.error('No fixtures found after trying multiple approaches');
      
      // Grab some key structural elements to help debug
      const pageStructure = {
        tables: $('table').length,
        responsiveTables: $('div.responsive-table').length,
        boxes: $('#yw1').length,
        title: $('title').text(),
        headings: $('h1, h2').map((i, el) => $(el).text()).get()
      };
      
      console.log('Page structure for debugging:', JSON.stringify(pageStructure));
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "No fixtures found in the HTML content",
          htmlSample,
          pageStructure
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

// Helper function to extract fixtures from table rows
function extractFixturesFromRows(rows: cheerio.Cheerio, $: cheerio.CheerioAPI, fixtures: any[]) {
  rows.each((i, row) => {
    try {
      const rowElement = $(row);
      
      // Skip header rows or rows that don't look like fixtures
      if (rowElement.find('th').length > 0 || rowElement.hasClass('bg_blau_20')) {
        return;
      }
      
      // Log the HTML of this row for debugging
      console.log(`Processing row ${i}:`, rowElement.html()?.substring(0, 100));
      
      // Extract cells
      const cells = rowElement.find('td');
      
      // Need at least 3 cells for a valid fixture
      if (cells.length < 3) {
        console.log(`Row ${i} has insufficient cells (${cells.length}), skipping`);
        return;
      }
      
      // Extract date - could be in different cells depending on the table structure
      let dateText = '';
      cells.each((j, cell) => {
        const cellText = $(cell).text().trim();
        if (cellText.match(/\d{2}[./-]\d{2}[./-]\d{2,4}/) || cellText.match(/\d{4}-\d{2}-\d{2}/)) {
          dateText = cellText;
          console.log(`Found date in cell ${j}: ${dateText}`);
        }
      });
      
      // If no date found in a specific cell, try to look for it in the row's parent or previous siblings
      if (!dateText) {
        const parentRow = rowElement.prev();
        if (parentRow.length) {
          const parentText = parentRow.text().trim();
          const dateMatch = parentText.match(/\d{2}[./-]\d{2}[./-]\d{2,4}/) || parentText.match(/\d{4}-\d{2}-\d{2}/);
          if (dateMatch) {
            dateText = dateMatch[0];
            console.log(`Found date in parent row: ${dateText}`);
          }
        }
      }
      
      if (!dateText) {
        // Use today's date as fallback
        const today = new Date();
        dateText = today.toISOString().split('T')[0];
        console.log(`No date found, using today: ${dateText}`);
      }
      
      // Format the date correctly
      const date = formatDate(dateText);
      
      // Extract time
      let time = '15:00'; // Default time
      cells.each((j, cell) => {
        const cellText = $(cell).text().trim();
        if (cellText.match(/\d{1,2}:\d{2}/)) {
          time = cellText;
          console.log(`Found time in cell ${j}: ${time}`);
        }
      });
      
      // Extract competition
      let competition = 'Highland League'; // Default
      
      // Try to find competition info in this row or parent rows
      const competitionCell = rowElement.find('td.wettbewerb');
      if (competitionCell.length) {
        competition = competitionCell.text().trim() || competition;
        console.log(`Found competition: ${competition}`);
      }
      
      // Extract teams and score
      let homeTeam = '', awayTeam = '';
      let homeScore = null, awayScore = null;
      let isCompleted = false;
      
      // Look for cells that might contain team names and scores
      cells.each((j, cell) => {
        const cellElement = $(cell);
        const cellHtml = cellElement.html() || '';
        const cellText = cellElement.text().trim();
        
        // Check if this cell contains team info
        if (cellHtml.includes('vereinprofil_tooltip') || cellText.includes('Banks O') || 
            cellText.includes('vs') || cellText.includes(' - ')) {
          console.log(`Found potential team info in cell ${j}: ${cellText}`);
          
          // Different patterns for team extraction
          if (cellText.includes('vs')) {
            [homeTeam, awayTeam] = cellText.split('vs').map(t => t.trim());
          } else if (cellText.includes(' - ')) {
            [homeTeam, awayTeam] = cellText.split(' - ').map(t => t.trim());
          } else {
            // Try to extract from HTML structure
            const teamElements = cellElement.find('a.vereinprofil_tooltip');
            if (teamElements.length >= 2) {
              homeTeam = $(teamElements[0]).text().trim();
              awayTeam = $(teamElements[1]).text().trim();
            } else if (teamElements.length === 1) {
              // If only one team found, check which one it is
              const teamText = $(teamElements[0]).text().trim();
              if (cellHtml.indexOf(teamText) < cellHtml.length / 2) {
                homeTeam = teamText;
                // Try to extract away team from text after home team
                const remaining = cellHtml.substring(cellHtml.indexOf(teamText) + teamText.length);
                const awayMatch = remaining.match(/>([^<]+)</);
                if (awayMatch) awayTeam = awayMatch[1].trim();
              } else {
                awayTeam = teamText;
                // Try to extract home team from text before away team
                const before = cellHtml.substring(0, cellHtml.indexOf(teamText));
                const homeMatch = before.match(/>([^<]+)</);
                if (homeMatch) homeTeam = homeMatch[1].trim();
              }
            }
          }
        }
        
        // Check for score (typically contains ':' between two numbers)
        const scoreMatch = cellText.match(/(\d+)\s*:\s*(\d+)/);
        if (scoreMatch) {
          console.log(`Found score in cell ${j}: ${cellText}`);
          homeScore = parseInt(scoreMatch[1]);
          awayScore = parseInt(scoreMatch[2]);
          isCompleted = true;
        }
      });
      
      // Skip if we couldn't extract both teams
      if (!homeTeam || !awayTeam) {
        console.log(`Could not extract both teams from row ${i}, skipping`);
        return;
      }
      
      // Generate a unique ID for this fixture
      const id = `transfermarkt-${date}-${homeTeam}-${awayTeam}`.replace(/\s+/g, '-').toLowerCase();
      
      // Determine venue based on home team
      const venue = homeTeam.includes("Banks O'") ? "Spain Park" : "Away";
      
      // Add fixture to array
      fixtures.push({
        id,
        date,
        time,
        competition,
        homeTeam,
        awayTeam,
        venue,
        isCompleted,
        homeScore,
        awayScore
      });
      
      console.log(`Successfully added fixture: ${homeTeam} vs ${awayTeam} on ${date}`);
      
    } catch (err) {
      console.error(`Error parsing row ${i}:`, err);
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
