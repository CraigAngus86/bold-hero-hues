
import { toast } from 'sonner';

// Define the response structure from the Firecrawl API
interface FirecrawlResponse {
  success: boolean;
  error?: string;
  data?: any;
}

// Define the structure for scraped fixtures
export interface ScrapedFixture {
  id?: string;  // Add id field to match the Match interface
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
      
      // Create a CORS proxy URL to bypass CORS restrictions
      const corsProxy = 'https://corsproxy.io/?';
      const proxyUrl = `${corsProxy}${encodeURIComponent(targetUrl)}`;
      
      console.log(`Attempting to fetch through CORS proxy: ${proxyUrl}`);
      
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error ${response.status} fetching Transfermarkt data: ${errorText}`);
        return { 
          success: false, 
          error: `Failed to fetch fixtures from Transfermarkt: ${response.status} ${response.statusText}` 
        };
      }
      
      const htmlContent = await response.text();
      
      if (!htmlContent || htmlContent.trim() === '') {
        console.error('Received empty response from Transfermarkt');
        return { success: false, error: 'Received empty response from Transfermarkt' };
      }
      
      console.log(`Successfully fetched HTML data from Transfermarkt, length: ${htmlContent.length} characters`);
      
      // Get a sample of the HTML for debugging purposes
      const htmlSample = htmlContent.substring(0, 1000) + '...';
      
      // Parse the Transfermarkt HTML content to extract fixtures
      const fixtures = this.parseTransfermarktFixtures(htmlContent);
      
      console.log(`Extracted ${fixtures.length} fixtures from Transfermarkt`);
      
      return { 
        success: true, 
        data: fixtures,
        htmlSample 
      };
    } catch (error) {
      console.error('Error in fetchTransfermarktFixtures:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch fixtures from Transfermarkt' 
      };
    }
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
            fixtures.push({
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
      
      return fixtures;
    } catch (error) {
      console.error('Error parsing Transfermarkt fixtures:', error);
      return [];
    }
  }
}
