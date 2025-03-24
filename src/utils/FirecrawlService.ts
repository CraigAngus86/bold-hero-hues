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

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';

  // Save API key to local storage
  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('Firecrawl API key saved successfully');
  }

  // Get API key from local storage
  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  // Fetch RSS feed from the Highland Football League website
  static async fetchHighlandLeagueRSS(): Promise<{ success: boolean; data?: ScrapedFixture[]; error?: string }> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        return { success: false, error: 'API key not found. Please set your Firecrawl API key first.' };
      }

      // Call our Supabase Edge Function to handle the RSS feed fetch
      const { data, error } = await fetch('/api/fetch-rss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          url: 'http://www.highlandfootballleague.com/rss/'
        })
      }).then(res => res.json());

      if (error) {
        console.error('Error fetching RSS feed:', error);
        return { success: false, error: error };
      }

      return { success: true, data: data };
    } catch (error) {
      console.error('Error in fetchHighlandLeagueRSS:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch RSS feed'
      };
    }
  }

  // Keep the scrapeHighlandLeagueFixtures method for backward compatibility
  static async scrapeHighlandLeagueFixtures(): Promise<{ success: boolean; data?: ScrapedFixture[]; error?: string }> {
    // Just call our new RSS method since it's more reliable
    return this.fetchHighlandLeagueRSS();
  }
}
