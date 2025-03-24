
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
 * This service helps with fetching RSS feed data from the Highland Football League website.
 * To use this service, you need to get a Firecrawl API key:
 * 
 * 1. Sign up at https://firecrawl.dev or https://app.firecrawl.dev
 * 2. Once logged in, go to the API Keys section in your dashboard
 * 3. Create a new API key and use it in the API Key input field in the admin dashboard
 */
export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static DEFAULT_API_KEY = 'fc-83bcbd73547640f0a7b2be29068dadad';

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

  // Fetch RSS feed from the Highland Football League website
  static async fetchHighlandLeagueRSS(): Promise<{ success: boolean; data?: ScrapedFixture[]; error?: string }> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        const msg = 'API key not found. Please set your Firecrawl API key first.';
        console.error(msg);
        return { success: false, error: msg };
      }

      console.log('Fetching Highland League RSS with API key:', apiKey.substring(0, 5) + '...');

      // Use direct API call to Firecrawl instead of going through our edge function
      const response = await fetch('https://api.firecrawl.dev/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          url: 'http://www.highlandfootballleague.com/rss/',
          wait_for_selector: 'item'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from Firecrawl API:', errorText);
        return { 
          success: false, 
          error: `HTTP error ${response.status}: ${errorText}` 
        };
      }

      const result = await response.json();
      
      if (!result.success) {
        console.error('Error in Firecrawl API:', result.error);
        return { success: false, error: result.error };
      }

      // Parse the HTML content from the RSS feed
      const rssItems = this.parseRSSContent(result.html);
      
      // Log the successful result
      console.log('Successfully fetched RSS data:', rssItems.length, 'fixtures');
      
      return { success: true, data: rssItems };
    } catch (error) {
      console.error('Error in fetchHighlandLeagueRSS:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch RSS feed'
      };
    }
  }

  // Parse RSS content from HTML
  private static parseRSSContent(html: string): ScrapedFixture[] {
    try {
      console.log('Parsing RSS content...');
      
      // Create a DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const fixtures: ScrapedFixture[] = [];
      
      // Find all item elements in the RSS feed
      const items = doc.querySelectorAll('item');
      
      console.log(`Found ${items.length} items in RSS feed`);
      
      items.forEach((item, index) => {
        try {
          // Extract title and description from item
          const title = item.querySelector('title')?.textContent || '';
          const description = item.querySelector('description')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          
          console.log(`Processing item ${index + 1}: ${title}`);
          
          // Parse the title to extract team names and scores
          let homeTeam = '', awayTeam = '', homeScore = null, awayScore = null, isCompleted = false;
          
          // Typical format: "Team A v Team B" or "Team A (2) v Team B (1)"
          if (title.includes(' v ')) {
            const parts = title.split(' v ');
            
            // Parse home team and possible score
            if (parts[0].includes('(') && parts[0].includes(')')) {
              const homeMatch = parts[0].match(/(.*)\s*\((\d+)\)/);
              if (homeMatch) {
                homeTeam = homeMatch[1].trim();
                homeScore = parseInt(homeMatch[2], 10);
                isCompleted = true;
              } else {
                homeTeam = parts[0].trim();
              }
            } else {
              homeTeam = parts[0].trim();
            }
            
            // Parse away team and possible score
            if (parts[1].includes('(') && parts[1].includes(')')) {
              const awayMatch = parts[1].match(/(.*)\s*\((\d+)\)/);
              if (awayMatch) {
                awayTeam = awayMatch[1].trim();
                awayScore = parseInt(awayMatch[2], 10);
                isCompleted = true;
              } else {
                awayTeam = parts[1].trim();
              }
            } else {
              awayTeam = parts[1].trim();
            }
          } else if (title.includes(' vs ')) {
            // Alternative format
            const parts = title.split(' vs ');
            homeTeam = parts[0].trim();
            awayTeam = parts[1].trim();
          }
          
          // Parse date from pubDate
          const dateObj = new Date(pubDate);
          const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
          const time = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
          
          // Extract competition and venue information from description
          let competition = "Highland League";
          let venue = "TBD";
          
          if (description) {
            // Look for competition info
            const competitionMatch = description.match(/Competition:\s*([^,\n]+)/i);
            if (competitionMatch) {
              competition = competitionMatch[1].trim();
            }
            
            // Look for venue info
            const venueMatch = description.match(/Venue:\s*([^,\n]+)/i);
            if (venueMatch) {
              venue = venueMatch[1].trim();
            }
          }
          
          // Only add the fixture if we have both team names
          if (homeTeam && awayTeam) {
            fixtures.push({
              homeTeam,
              awayTeam,
              date,
              time,
              competition,
              venue,
              isCompleted,
              homeScore,
              awayScore
            });
          }
        } catch (err) {
          console.error('Error parsing RSS item:', err);
        }
      });
      
      return fixtures;
    } catch (error) {
      console.error('Error parsing RSS content:', error);
      return [];
    }
  }

  // Keep the scrapeHighlandLeagueFixtures method for backward compatibility
  static async scrapeHighlandLeagueFixtures(): Promise<{ success: boolean; data?: ScrapedFixture[]; error?: string }> {
    // Just call our new RSS method since it's more reliable
    return this.fetchHighlandLeagueRSS();
  }
}
