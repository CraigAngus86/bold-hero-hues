import { toast } from 'sonner';

// Define the response structure from the Firecrawl API
interface FirecrawlResponse {
  success: boolean;
  error?: string;
  data?: any;
}

// Define the structure for scraped fixtures
export interface ScrapedFixture {
  id: string | number;  // Make id required to match Match interface
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

/**
 * FirecrawlService
 * 
 * This service helps with fetching football fixture data from Transfermarkt.
 */
export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static DEFAULT_API_KEY = 'fc-83bcbd73547640f0a7b2be29068dadad';
  private static TRANSFERMARKT_URL = 'https://www.transfermarkt.com/banks-o-dee-fc/spielplan/verein/25442/saison_id/2023';

  // Expanded list of CORS proxies to try in order
  private static CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://cors-proxy.fringe.zone/',
    'https://proxy.cors.sh/',
    'https://cors.eu.org/',
    'https://thingproxy.freeboard.io/fetch/',
  ];

  // Save API key to local storage
  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('Firecrawl API key saved successfully');
    toast.success('API key saved successfully');
  }

  // Get API key from local storage or use the default one
  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY) || this.DEFAULT_API_KEY;
  }
  
  // Primary method to fetch fixtures from Transfermarkt
  static async fetchTransfermarktFixtures(url?: string): Promise<{ success: boolean; data?: ScrapedFixture[]; error?: string; htmlSample?: string }> {
    try {
      // Use the provided URL or default to the predefined one
      const targetUrl = url || this.TRANSFERMARKT_URL;
      
      console.log('Fetching fixtures from Transfermarkt:', targetUrl);
      
      // Try each CORS proxy until one works
      for (const proxyBase of this.CORS_PROXIES) {
        try {
          const proxyUrl = `${proxyBase}${encodeURIComponent(targetUrl)}`;
          console.log(`Attempting to fetch through CORS proxy: ${proxyBase}${targetUrl.substring(0, 30)}...`);
          
          // Use AbortController to set timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            console.warn(`Request to ${proxyBase} timed out after 15 seconds`);
          }, 15000);
          
          const response = await fetch(proxyUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Referer': 'https://www.google.com/',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            signal: controller.signal
          });

          // Clear the timeout
          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorText = await response.text();
            console.warn(`HTTP error ${response.status} with proxy ${proxyBase}: ${errorText.substring(0, 100)}`);
            continue; // Try the next proxy
          }
          
          const htmlContent = await response.text();
          
          if (!htmlContent || htmlContent.trim() === '') {
            console.warn(`Received empty response from proxy ${proxyBase}`);
            continue; // Try the next proxy
          }
          
          console.log(`Successfully fetched HTML data from Transfermarkt via ${proxyBase}, length: ${htmlContent.length} characters`);
          
          // Get a sample of the HTML for debugging purposes
          const htmlSample = htmlContent.substring(0, 1000) + '...';
          
          // Parse the Transfermarkt HTML content to extract fixtures
          const fixtures = this.parseTransfermarktFixtures(htmlContent);
          
          if (fixtures.length === 0) {
            console.warn(`No fixtures found in HTML from proxy ${proxyBase}`);
            // Store the sample for debugging
            localStorage.setItem('lastTransfermarktHtml', htmlContent.substring(0, 10000));
            continue; // Try the next proxy
          }
          
          console.log(`Extracted ${fixtures.length} fixtures from Transfermarkt via ${proxyBase}`);
          
          // Successfully fetched and parsed fixtures
          return { 
            success: true, 
            data: fixtures,
            htmlSample 
          };
        } catch (proxyError) {
          console.warn(`Error with proxy ${proxyBase}:`, proxyError);
          // Continue to the next proxy
        }
      }
      
      // If we get here, all proxies failed, try direct server-side fetching if available
      console.log('All browser-side CORS proxies failed, returning error');
      return { 
        success: false, 
        error: 'All CORS proxies failed to fetch Transfermarkt data. Try using the mock data instead.',
        htmlSample: 'No HTML content could be fetched from any proxy.'
      };
    } catch (error) {
      console.error('Error in fetchTransfermarktFixtures:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch fixtures from Transfermarkt' 
      };
    }
  }

  // Generate mock fixtures as a fallback - ensuring each fixture has a unique ID
  static generateMockFixtures(): ScrapedFixture[] {
    const teams = [
      'Banks O\' Dee FC', 'Brechin City FC', 'Buckie Thistle FC', 'Clachnacuddin FC',
      'Deveronvale FC', 'Formartine Utd FC', 'Forres Mechanics FC', 'Fraserburgh FC',
      'Huntly FC', 'Inverurie Loco Works FC', 'Keith FC', 'Lossiemouth FC',
      'Nairn County FC', 'Rothes FC', 'Strathspey Thistle FC', 'Turriff Utd FC', 'Wick Academy FC'
    ];
    
    const venues = ['Spain Park', 'Glebe Park', 'Victoria Park', 'Grant Street Park', 'Princess Royal Park'];
    
    // Current date
    const startDate = new Date();
    const fixtures: ScrapedFixture[] = [];
    
    // Generate 20 fixtures (10 upcoming, 10 completed)
    for (let i = 0; i < 20; i++) {
      const isCompleted = i < 10;
      const fixtureDate = new Date(startDate);
      
      if (isCompleted) {
        // Completed matches in the past
        fixtureDate.setDate(fixtureDate.getDate() - (i + 1));
      } else {
        // Upcoming matches in the future
        fixtureDate.setDate(fixtureDate.getDate() + (i - 9));
      }
      
      // Format date as YYYY-MM-DD
      const dateStr = fixtureDate.toISOString().split('T')[0];
      
      // Randomly select teams (ensuring they are different)
      let homeTeamIndex = Math.floor(Math.random() * teams.length);
      let awayTeamIndex;
      do {
        awayTeamIndex = Math.floor(Math.random() * teams.length);
      } while (awayTeamIndex === homeTeamIndex);
      
      // Ensure Banks O' Dee is in every fixture
      const isBanksHome = Math.random() > 0.5;
      if (isBanksHome) {
        homeTeamIndex = 0; // Banks O' Dee is the first team in the array
      } else {
        awayTeamIndex = 0;
      }
      
      // Generate random scores for completed matches
      let homeScore = null;
      let awayScore = null;
      if (isCompleted) {
        homeScore = Math.floor(Math.random() * 4);
        awayScore = Math.floor(Math.random() * 4);
      }
      
      // Pick a random venue or use Spain Park for home games
      const venue = isBanksHome ? 'Spain Park' : venues[Math.floor(Math.random() * venues.length)];
      
      // Generate a truly unique ID by combining match details
      const uniqueId = `mock-${dateStr}-${teams[homeTeamIndex].substring(0, 3)}-${teams[awayTeamIndex].substring(0, 3)}-${Date.now()}-${i}`;
      
      fixtures.push({
        id: uniqueId,
        homeTeam: teams[homeTeamIndex],
        awayTeam: teams[awayTeamIndex],
        date: dateStr,
        time: '15:00',
        competition: 'Highland League',
        venue,
        isCompleted,
        homeScore,
        awayScore
      });
    }
    
    return fixtures;
  }

  // Parse Transfermarkt fixtures from HTML content
  private static parseTransfermarktFixtures(html: string): ScrapedFixture[] {
    try {
      console.log('Parsing Transfermarkt fixtures...');
      
      const fixtures: ScrapedFixture[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Find fixture rows - Transfermarkt uses tables with specific classes
      const fixtureRows = doc.querySelectorAll('table.spielplandatum tr:not(.bg_blau_20)');
      
      console.log(`Found ${fixtureRows.length} potential fixture rows`);
      
      let currentCompetition = 'Highland League';
      let currentDate = '';
      
      fixtureRows.forEach((row, index) => {
        try {
          // Check if this is a date row
          const dateCell = row.querySelector('td.spieltagsansetzung');
          if (dateCell) {
            const dateText = dateCell.textContent?.trim() || '';
            const dateMatch = dateText.match(/\d{2}[./-]\d{2}[./-]\d{2,4}/);
            if (dateMatch) {
              currentDate = this.formatDate(dateMatch[0]);
              console.log(`Found date: ${currentDate}`);
            }
            return; // Skip this row, it's just a date header
          }
          
          // Check if this is a competition header row
          const competitionHeader = row.querySelector('td.hauptlink');
          if (competitionHeader) {
            currentCompetition = competitionHeader.textContent?.trim() || 'Highland League';
            console.log(`Found competition: ${currentCompetition}`);
            return; // Skip processing this row as a fixture
          }
          
          // Extract fixture details
          const cells = row.querySelectorAll('td');
          
          // Skip if not enough cells
          if (cells.length < 3) return;
          
          // Try to extract time
          let time = '15:00'; // Default time
          Array.from(cells).some(cell => {
            const cellText = cell.textContent?.trim() || '';
            const timeMatch = cellText.match(/^\d{1,2}:\d{2}$/);
            if (timeMatch) {
              time = cellText;
              return true;
            }
            return false;
          });
          
          // Extract teams and score
          let homeTeam = '', awayTeam = '';
          let homeScore = null, awayScore = null;
          let isCompleted = false;
          
          // Look for the cell with match information
          Array.from(cells).forEach(cell => {
            const cellText = cell.textContent?.trim() || '';
            
            // Try different patterns
            if (cellText.includes(' - ') || cellText.includes(' : ') || cellText.includes(' vs ')) {
              console.log(`Found match text: ${cellText}`);
              
              let separator = ' - ';
              if (cellText.includes(' : ')) separator = ' : ';
              if (cellText.includes(' vs ')) separator = ' vs ';
              
              const parts = cellText.split(separator);
              if (parts.length >= 2) {
                homeTeam = parts[0].trim();
                awayTeam = parts[1].trim();
                
                // Check for scores
                const scoreMatch = cellText.match(/(\d+)\s*[:]\s*(\d+)/);
                if (scoreMatch) {
                  homeScore = parseInt(scoreMatch[1]);
                  awayScore = parseInt(scoreMatch[2]);
                  isCompleted = true;
                  
                  // Clean up team names
                  homeTeam = homeTeam.replace(/\d+$/, '').trim();
                  awayTeam = awayTeam.replace(/^\d+/, '').trim();
                }
              }
            }
          });
          
          // If we don't have a date from a date row, try to extract from the fixture row
          if (!currentDate) {
            Array.from(cells).some(cell => {
              const cellText = cell.textContent?.trim() || '';
              const dateMatch = cellText.match(/\d{2}[./-]\d{2}[./-]\d{2,4}/);
              if (dateMatch) {
                currentDate = this.formatDate(dateMatch[0]);
                return true;
              }
              return false;
            });
          }
          
          // If we still don't have a date, use today's date
          if (!currentDate) {
            currentDate = new Date().toISOString().split('T')[0];
          }
          
          // Only add if we have valid teams
          if (homeTeam && awayTeam) {
            // Generate a unique ID for each fixture
            const fixtureId = `transfermarkt-${currentDate}-${homeTeam}-${awayTeam}`.replace(/\s+/g, '-').toLowerCase();
            
            // If homeTeam is just a number, it's invalid
            if (/^\d+$/.test(homeTeam)) {
              homeTeam = `Unknown Team ${homeTeam}`;
            }
            
            // If awayTeam is just a number, it's invalid
            if (/^\d+$/.test(awayTeam)) {
              awayTeam = `Unknown Team ${awayTeam}`;
            }
            
            // Create the fixture
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
            
            console.log(`Added fixture: ${homeTeam} vs ${awayTeam} on ${currentDate}`);
          }
        } catch (err) {
          console.warn(`Error parsing row ${index}:`, err);
        }
      });
      
      // If no fixtures were found using the primary approach, try a fallback approach
      if (fixtures.length === 0) {
        console.log('No fixtures found with primary approach, trying fallback method...');
        
        // Try to find tables with potential fixtures
        const tables = doc.querySelectorAll('table');
        console.log(`Found ${tables.length} tables to check`);
        
        tables.forEach((table, tableIndex) => {
          const rows = table.querySelectorAll('tr');
          console.log(`Table ${tableIndex + 1} has ${rows.length} rows`);
          
          let localDate = '';
          
          rows.forEach((row, rowIndex) => {
            try {
              const cells = row.querySelectorAll('td');
              
              // Skip rows with too few cells
              if (cells.length < 2) return;
              
              // Check if this might be a date row
              const firstCellText = cells[0].textContent?.trim() || '';
              const dateMatch = firstCellText.match(/\d{2}[./-]\d{2}[./-]\d{2,4}/);
              if (dateMatch && cells.length <= 2) {
                localDate = this.formatDate(dateMatch[0]);
                console.log(`Found date in table ${tableIndex + 1}, row ${rowIndex}: ${localDate}`);
                return;
              }
              
              // Try to find match information
              let matchFound = false;
              Array.from(cells).forEach(cell => {
                const cellText = cell.textContent?.trim() || '';
                
                // Look for text that might be a fixture
                if (cellText.includes(' - ') || cellText.includes(' : ') || cellText.includes(' vs ')) {
                  console.log(`Potential match found in table ${tableIndex + 1}, row ${rowIndex}: ${cellText}`);
                  
                  let separator = ' - ';
                  if (cellText.includes(' : ')) separator = ' : ';
                  if (cellText.includes(' vs ')) separator = ' vs ';
                  
                  const parts = cellText.split(separator);
                  if (parts.length >= 2) {
                    let homeTeam = parts[0].trim();
                    let awayTeam = parts[1].trim();
                    
                    // Check for scores
                    const scoreMatch = cellText.match(/(\d+)\s*[:]\s*(\d+)/);
                    let homeScore = null, awayScore = null;
                    let isCompleted = false;
                    
                    if (scoreMatch) {
                      homeScore = parseInt(scoreMatch[1]);
                      awayScore = parseInt(scoreMatch[2]);
                      isCompleted = true;
                      
                      // Clean up team names
                      homeTeam = homeTeam.replace(/\d+$/, '').trim();
                      awayTeam = awayTeam.replace(/^\d+/, '').trim();
                    }
                    
                    // If we don't have a date, try to find one in nearby cells
                    let matchDate = localDate;
                    if (!matchDate) {
                      Array.from(cells).some(nearbyCell => {
                        const nearbyCellText = nearbyCell.textContent?.trim() || '';
                        const nearbyDateMatch = nearbyCellText.match(/\d{2}[./-]\d{2}[./-]\d{2,4}/);
                        if (nearbyDateMatch) {
                          matchDate = this.formatDate(nearbyDateMatch[0]);
                          return true;
                        }
                        return false;
                      });
                    }
                    
                    // If we still don't have a date, use today's date
                    if (!matchDate) {
                      matchDate = new Date().toISOString().split('T')[0];
                    }
                    
                    // Only add if both teams are valid
                    if (homeTeam && awayTeam) {
                      // Generate a unique ID for each fixture
                      const fixtureId = `transfermarkt-${matchDate}-${homeTeam}-${awayTeam}`.replace(/\s+/g, '-').toLowerCase();
                      
                      // If homeTeam is just a number, it's invalid
                      if (/^\d+$/.test(homeTeam)) {
                        homeTeam = `Unknown Team ${homeTeam}`;
                      }
                      
                      // If awayTeam is just a number, it's invalid
                      if (/^\d+$/.test(awayTeam)) {
                        awayTeam = `Unknown Team ${awayTeam}`;
                      }
                      
                      // Create the fixture
                      fixtures.push({
                        id: fixtureId,
                        date: matchDate,
                        time: '15:00',  // Default time
                        competition: 'Highland League',  // Default competition
                        homeTeam,
                        awayTeam,
                        venue: homeTeam.includes("Banks O") ? "Spain Park" : "Away",
                        isCompleted,
                        homeScore,
                        awayScore
                      });
                      
                      console.log(`Added match from fallback method: ${homeTeam} vs ${awayTeam} on ${matchDate}`);
                      matchFound = true;
                    }
                  }
                }
              });
              
              // Return after adding a match to avoid duplicate processing
              if (matchFound) return;
              
            } catch (err) {
              console.warn(`Error parsing row in fallback method:`, err);
            }
          });
        });
      }
      
      // Deduplicate fixtures
      const uniqueFixtures = this.deduplicateFixtures(fixtures);
      
      // Clean up fixtures
      const cleanedFixtures = this.cleanupFixtures(uniqueFixtures);
      
      console.log(`Final fixtures count after cleanup: ${cleanedFixtures.length}`);
      
      return cleanedFixtures;
    } catch (error) {
      console.error('Error parsing Transfermarkt fixtures:', error);
      return [];
    }
  }
  
  // Format date consistently
  private static formatDate(dateText: string): string {
    try {
      if (!dateText) {
        return new Date().toISOString().split('T')[0];
      }
      
      // If already in YYYY-MM-DD format
      if (dateText.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateText;
      }
      
      // Format DD.MM.YYYY or DD/MM/YYYY to YYYY-MM-DD
      const dateMatch = dateText.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
      if (dateMatch) {
        const day = dateMatch[1].padStart(2, '0');
        const month = dateMatch[2].padStart(2, '0');
        let year = dateMatch[3];
        
        // Handle 2-digit years
        if (year.length === 2) {
          year = '20' + year;
        }
        
        return `${year}-${month}-${day}`;
      }
      
      // Default to today's date if parsing fails
      return new Date().toISOString().split('T')[0];
    } catch (e) {
      console.error("Error formatting date:", e);
      return new Date().toISOString().split('T')[0];
    }
  }
  
  // Remove duplicate fixtures
  private static deduplicateFixtures(fixtures: ScrapedFixture[]): ScrapedFixture[] {
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
  private static cleanupFixtures(fixtures: ScrapedFixture[]): ScrapedFixture[] {
    return fixtures.map(fixture => {
      // Ensure home and away teams are proper team names, not just numbers
      if (/^\d+$/.test(fixture.homeTeam)) {
        fixture.homeTeam = `Unknown Team ${fixture.homeTeam}`;
      }
      
      if (/^\d+$/.test(fixture.awayTeam)) {
        fixture.awayTeam = `Unknown Team ${fixture.awayTeam}`;
      }
      
      // Fix Banks O' Dee variations
      if (fixture.homeTeam.toLowerCase().includes('banks') && fixture.homeTeam.toLowerCase().includes('dee')) {
        fixture.homeTeam = "Banks O' Dee FC";
      }
      
      if (fixture.awayTeam.toLowerCase().includes('banks') && fixture.awayTeam.toLowerCase().includes('dee')) {
        fixture.awayTeam = "Banks O' Dee FC";
      }
      
      // Ensure fixture has Banks O' Dee in either home or away
      const hasBanks = fixture.homeTeam.includes("Banks O' Dee") || fixture.awayTeam.includes("Banks O' Dee");
      if (!hasBanks) {
        // If this is a Spain Park venue, make Banks the home team
        if (fixture.venue === "Spain Park") {
          fixture.homeTeam = "Banks O' Dee FC";
        } else {
          // Otherwise make them the away team
          fixture.awayTeam = "Banks O' Dee FC";
        }
      }
      
      // Ensure fixture has proper venue
      if (fixture.homeTeam.includes("Banks O' Dee")) {
        fixture.venue = "Spain Park";
      } else if (fixture.awayTeam.includes("Banks O' Dee")) {
        fixture.venue = "Away";
      }
      
      return fixture;
    });
  }
}

