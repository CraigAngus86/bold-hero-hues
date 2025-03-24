
import { toast } from 'sonner';

// Define the response structure from the Firecrawl API
interface FirecrawlResponse {
  success: boolean;
  error?: string;
  data?: any;
}

// Define the structure for scraped fixtures
export interface ScrapedFixture {
  id?: string | number;  // Add id field to match the Match interface
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
  private static TRANSFERMARKT_URL = 'https://www.transfermarkt.com/banks-o-dee-fc/spielplandatum/verein/25442/saison_id/2024';

  // Available CORS proxies to try in order
  private static CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
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
          console.log(`Attempting to fetch through CORS proxy: ${proxyUrl}`);
          
          const response = await fetch(proxyUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            // Add a timeout to prevent hanging requests
            signal: AbortSignal.timeout(10000) // 10 second timeout
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.warn(`HTTP error ${response.status} with proxy ${proxyBase}: ${errorText}`);
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
      
      // If we get here, all proxies failed
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

  // Generate mock fixtures as a fallback
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
      
      fixtures.push({
        id: `mock-${dateStr}-${homeTeamIndex}-${awayTeamIndex}`,
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
      
      fixtureRows.forEach((row, index) => {
        try {
          // Check if this is a competition header row
          const competitionHeader = row.querySelector('td.hauptlink');
          if (competitionHeader) {
            currentCompetition = competitionHeader.textContent?.trim() || 'Highland League';
            console.log(`Found competition: ${currentCompetition}`);
            return; // Skip processing this row as a fixture
          }
          
          // Extract date
          const dateCell = row.querySelector('td:nth-child(1)');
          let dateStr = dateCell?.textContent?.trim() || '';
          
          // Format date as YYYY-MM-DD
          let date = new Date().toISOString().split('T')[0]; // Default to today
          if (dateStr) {
            try {
              // Transfermarkt format is typically DD/MM/YYYY or DD.MM.YYYY
              const dateParts = dateStr.split(/[\/\.-]/);
              if (dateParts.length === 3) {
                const day = dateParts[0].padStart(2, '0');
                const month = dateParts[1].padStart(2, '0');
                const year = dateParts[2].length === 2 ? '20' + dateParts[2] : dateParts[2];
                date = `${year}-${month}-${day}`;
              }
            } catch (e) {
              console.warn(`Could not parse date: ${dateStr}`);
            }
          }
          
          // Extract time
          const timeCell = row.querySelector('td:nth-child(2)');
          const time = timeCell?.textContent?.trim() || '15:00';
          
          // Extract home/away status
          const homeAwayCell = row.querySelector('td:nth-child(3)');
          const isHome = homeAwayCell?.textContent?.trim().toLowerCase().includes('h');
          
          // Extract teams
          const matchCell = row.querySelector('td:nth-child(5) a');
          let matchText = matchCell?.textContent?.trim() || '';
          
          // Extract teams and scores from match text (e.g. "Banks O'Dee 2:1 Inverurie Loco Works")
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
            const fixtureId = `${homeTeam}-${awayTeam}-${date}-${Math.random().toString(36).substring(2, 9)}`;
            
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
        } catch (err) {
          console.warn(`Error parsing fixture row ${index}:`, err);
        }
      });
      
      // If no fixtures were parsed but HTML was received, there may be an issue with the HTML structure
      if (fixtures.length === 0 && html.length > 0) {
        console.warn('HTML was received but no fixtures could be parsed. The website structure may have changed.');
      }
      
      return fixtures;
    } catch (error) {
      console.error('Error parsing Transfermarkt fixtures:', error);
      return [];
    }
  }
}
