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
 * This service helps with fetching football fixture data from various sources.
 * It provides multiple methods including direct HTTP requests, CORS proxies, and Firecrawl API.
 */
export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static DEFAULT_API_KEY = 'fc-83bcbd73547640f0a7b2be29068dadad';
  private static RSS_URL = 'http://www.highlandfootballleague.com/rss/';
  private static BBC_FIXTURES_URL = 'https://www.bbc.com/sport/football/scottish-highland-league/scores-fixtures';

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

  // New method: Fetch fixtures directly from BBC Sport
  static async fetchBBCSportFixtures(): Promise<{ success: boolean; data?: ScrapedFixture[]; error?: string }> {
    try {
      console.log('Fetching fixtures from BBC Sport');
      
      // Create a CORS proxy URL to bypass CORS restrictions
      const corsProxy = 'https://corsproxy.io/?';
      const url = `${corsProxy}${encodeURIComponent(this.BBC_FIXTURES_URL)}`;
      
      console.log(`Attempting to fetch from: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error ${response.status} fetching BBC Sport fixtures: ${errorText}`);
        return { 
          success: false, 
          error: `Failed to fetch fixtures from BBC Sport: ${response.status} ${response.statusText}` 
        };
      }
      
      const htmlContent = await response.text();
      
      if (!htmlContent || htmlContent.trim() === '') {
        console.error('Received empty response from BBC Sport');
        return { success: false, error: 'Received empty response from BBC Sport' };
      }
      
      console.log(`Successfully fetched HTML data from BBC Sport, length: ${htmlContent.length} characters`);
      
      // Parse the BBC Sport HTML content to extract fixtures
      const fixtures = this.parseBBCSportFixtures(htmlContent);
      
      console.log(`Extracted ${fixtures.length} fixtures from BBC Sport`);
      
      return { success: true, data: fixtures };
    } catch (error) {
      console.error('Error in fetchBBCSportFixtures:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch fixtures from BBC Sport' 
      };
    }
  }

  // Parse BBC Sport fixtures from HTML content
  private static parseBBCSportFixtures(html: string): ScrapedFixture[] {
    try {
      console.log('Parsing BBC Sport fixtures...');
      
      const fixtures: ScrapedFixture[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Find fixture containers - BBC Sport uses specific classes for fixtures
      const fixtureContainers = doc.querySelectorAll('.sp-c-fixture, .gs-o-list-ui__item');
      
      console.log(`Found ${fixtureContainers.length} potential fixture containers`);
      
      fixtureContainers.forEach((container, index) => {
        try {
          // Extract date information
          const dateElem = container.querySelector('.sp-c-fixture__date, .gel-pica-bold') || 
                          container.closest('[data-fixture-date]');
          
          let dateStr = '';
          if (dateElem) {
            dateStr = dateElem.textContent?.trim() || 
                      dateElem.getAttribute('data-fixture-date') || '';
          }
          
          // Format date as YYYY-MM-DD
          let date = new Date().toISOString().split('T')[0]; // Default to today
          if (dateStr) {
            try {
              const parsedDate = new Date(dateStr);
              if (!isNaN(parsedDate.getTime())) {
                date = parsedDate.toISOString().split('T')[0];
              }
            } catch (e) {
              console.warn(`Could not parse date: ${dateStr}`);
            }
          }
          
          // Extract time
          const timeElem = container.querySelector('.sp-c-fixture__time, .sp-c-fixture__number--time');
          const time = timeElem ? timeElem.textContent?.trim() || '15:00' : '15:00';
          
          // Extract team names
          const homeTeamElem = container.querySelector('.sp-c-fixture__team--home .sp-c-fixture__team-name');
          const awayTeamElem = container.querySelector('.sp-c-fixture__team--away .sp-c-fixture__team-name');
          
          let homeTeam = '';
          let awayTeam = '';
          
          if (homeTeamElem && awayTeamElem) {
            homeTeam = homeTeamElem.textContent?.trim() || '';
            awayTeam = awayTeamElem.textContent?.trim() || '';
          } else {
            // Alternative selectors
            const teamElems = container.querySelectorAll('.qa-team-link, .sp-c-fixture__team-name');
            if (teamElems.length >= 2) {
              homeTeam = teamElems[0].textContent?.trim() || '';
              awayTeam = teamElems[1].textContent?.trim() || '';
            }
          }
          
          // Check if the match is completed and extract scores
          const scoreElem = container.querySelector('.sp-c-fixture__score, .sp-c-fixture__number--score');
          let isCompleted = false;
          let homeScore: number | null = null;
          let awayScore: number | null = null;
          
          if (scoreElem) {
            isCompleted = true;
            const scoreText = scoreElem.textContent?.trim() || '';
            const scores = scoreText.split('-').map(s => parseInt(s.trim(), 10));
            if (scores.length === 2 && !isNaN(scores[0]) && !isNaN(scores[1])) {
              homeScore = scores[0];
              awayScore = scores[1];
            }
          }
          
          // Only add if we have both team names
          if (homeTeam && awayTeam) {
            fixtures.push({
              homeTeam,
              awayTeam,
              date,
              time,
              competition: 'Highland League',
              venue: 'TBD',
              isCompleted,
              homeScore,
              awayScore
            });
          }
        } catch (err) {
          console.warn(`Error parsing fixture container ${index}:`, err);
        }
      });
      
      return fixtures;
    } catch (error) {
      console.error('Error parsing BBC Sport fixtures:', error);
      return [];
    }
  }

  // Direct fetch method for RSS - doesn't require Firecrawl
  static async fetchRSSDirectly(): Promise<{ success: boolean; data?: ScrapedFixture[]; error?: string }> {
    try {
      console.log('Directly fetching Highland League RSS feed');
      
      // Create a CORS proxy URL to bypass CORS restrictions
      const corsProxy = 'https://corsproxy.io/?';
      const rssUrl = `${corsProxy}${encodeURIComponent(this.RSS_URL)}`;
      
      console.log(`Attempting to fetch directly from: ${rssUrl}`);
      
      const response = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error ${response.status} fetching RSS feed: ${errorText}`);
        return { 
          success: false, 
          error: `Failed to fetch from ${this.RSS_URL}: ${response.status} ${response.statusText}` 
        };
      }
      
      const xmlData = await response.text();
      
      if (!xmlData || xmlData.trim() === '') {
        console.error('Received empty response from RSS feed');
        return { success: false, error: 'Received empty response from RSS feed' };
      }
      
      console.log(`Successfully fetched XML data, length: ${xmlData.length} characters`);
      
      const fixtures = this.parseRSSContent(xmlData);
      
      console.log(`Extracted ${fixtures.length} fixtures from direct RSS feed`);
      
      return { success: true, data: fixtures };
    } catch (error) {
      console.error('Error in direct RSS fetch:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch RSS feed directly' 
      };
    }
  }

  // Primary method to fetch fixtures from any available source
  static async fetchHighlandLeagueFixtures(): Promise<{ success: boolean; data?: ScrapedFixture[]; error?: string }> {
    // First try BBC Sport (most reliable)
    try {
      console.log('Attempting BBC Sport fixtures fetch first');
      const bbcResult = await this.fetchBBCSportFixtures();
      
      if (bbcResult.success && bbcResult.data && bbcResult.data.length > 0) {
        console.log('BBC Sport fixtures fetch successful');
        return bbcResult;
      } else {
        console.log('BBC Sport fixtures fetch failed, trying RSS feed');
      }
    } catch (error) {
      console.error('Error in BBC fetch, continuing to RSS:', error);
    }
    
    // Then try direct RSS
    try {
      console.log('Attempting direct RSS fetch');
      const directResult = await this.fetchRSSDirectly();
      
      if (directResult.success && directResult.data && directResult.data.length > 0) {
        console.log('Direct RSS fetch successful');
        return directResult;
      } else {
        console.log('Direct RSS fetch failed, falling back to Firecrawl');
      }
    } catch (error) {
      console.error('Error in direct fetch, continuing to Firecrawl:', error);
    }
    
    // Finally, try Firecrawl
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        const msg = 'API key not found. Please set your Firecrawl API key first.';
        console.error(msg);
        return { success: false, error: msg };
      }

      console.log('Fetching Highland League RSS with API key:', apiKey.substring(0, 5) + '...');

      // Firecrawl endpoint
      const apiUrl = 'https://api.firecrawl.dev/scrape';
      
      console.log(`Attempting to fetch from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          url: this.RSS_URL,
          wait_for_selector: 'item' // Wait for RSS items to load
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from Firecrawl API:', errorText);
        console.error('Response status:', response.status);
        console.error('Response headers:', [...response.headers.entries()]);
        
        return { success: false, error: `Firecrawl API error: ${response.status} ${response.statusText}` };
      }

      const result = await response.json();
      
      if (!result.success) {
        console.error('Error in Firecrawl API response:', result.error);
        return { success: false, error: result.error || 'Unknown error from Firecrawl API' };
      }

      console.log('Firecrawl API response:', result);
      
      // Parse the HTML content from the response
      const htmlContent = result.html || '';
      if (!htmlContent) {
        return { success: false, error: 'No HTML content returned from Firecrawl' };
      }
      
      // Parse the RSS content
      const rssItems = this.parseRSSContent(htmlContent);
      
      // Log the successful result
      console.log('Successfully fetched RSS data:', rssItems.length, 'fixtures');
      
      return { success: true, data: rssItems };
    } catch (error) {
      console.error('Error in Firecrawl fetch:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch fixtures from any source'
      };
    }
  }

  // Parse RSS content from HTML
  private static parseRSSContent(html: string): ScrapedFixture[] {
    try {
      console.log('Parsing RSS content...');
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const fixtures: ScrapedFixture[] = [];
      
      // Find all item elements in the RSS feed
      const items = doc.querySelectorAll('item');
      
      console.log(`Found ${items.length} items in RSS feed`);
      
      // If no items found directly, try to parse from the raw HTML which might be encoded
      if (items.length === 0) {
        console.log('No items found directly, trying to parse from raw HTML');
        
        // Look for XML content that might be encoded in the HTML
        const xmlContent = html.match(/<rss[^>]*>([\s\S]*?)<\/rss>/i);
        if (xmlContent && xmlContent[0]) {
          const rssDoc = parser.parseFromString(xmlContent[0], 'text/xml');
          const rssItems = rssDoc.querySelectorAll('item');
          
          console.log(`Found ${rssItems.length} items in parsed XML content`);
          
          return this.parseRSSItems(rssItems);
        }
        
        // If still not found, try parsing as XML
        try {
          const xmlDoc = parser.parseFromString(html, 'text/xml');
          const xmlItems = xmlDoc.querySelectorAll('item');
          console.log(`Found ${xmlItems.length} items parsing as XML`);
          
          if (xmlItems.length > 0) {
            return this.parseRSSItems(xmlItems);
          }
        } catch (xmlError) {
          console.error('Error parsing as XML:', xmlError);
        }
      }
      
      return this.parseRSSItems(items);
    } catch (error) {
      console.error('Error parsing RSS content:', error);
      return [];
    }
  }
  
  // Parse RSS items into fixtures
  private static parseRSSItems(items: NodeListOf<Element>): ScrapedFixture[] {
    const fixtures: ScrapedFixture[] = [];
    
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
  }

  // Keep the scrapeHighlandLeagueFixtures method for backward compatibility
  static async scrapeHighlandLeagueFixtures(): Promise<{ success: boolean; data?: ScrapedFixture[]; error?: string }> {
    // Just call our new RSS method since it's more reliable
    return this.fetchHighlandLeagueFixtures();
  }
}
