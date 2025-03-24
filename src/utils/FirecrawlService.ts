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
  private static HFL_FIXTURES_URL = 'http://www.highlandfootballleague.com/Fixtures/';

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

  // New method: Fetch fixtures directly from Highland Football League website
  static async fetchHighlandLeagueWebsite(): Promise<{ success: boolean; data?: ScrapedFixture[]; error?: string }> {
    try {
      console.log('Fetching fixtures directly from Highland Football League website');
      
      // Create a CORS proxy URL to bypass CORS restrictions
      const corsProxy = 'https://corsproxy.io/?';
      const url = `${corsProxy}${encodeURIComponent(this.HFL_FIXTURES_URL)}`;
      
      console.log(`Attempting to fetch from: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error ${response.status} fetching HFL website: ${errorText}`);
        return { 
          success: false, 
          error: `Failed to fetch fixtures from HFL website: ${response.status} ${response.statusText}` 
        };
      }
      
      const htmlContent = await response.text();
      
      if (!htmlContent || htmlContent.trim() === '') {
        console.error('Received empty response from HFL website');
        return { success: false, error: 'Received empty response from HFL website' };
      }
      
      console.log(`Successfully fetched HTML data from HFL website, length: ${htmlContent.length} characters`);
      
      // Parse the HFL website HTML content to extract fixtures
      const fixtures = this.parseHFLWebsiteFixtures(htmlContent);
      
      console.log(`Extracted ${fixtures.length} fixtures from HFL website`);
      
      return { success: true, data: fixtures };
    } catch (error) {
      console.error('Error in fetchHighlandLeagueWebsite:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch fixtures from HFL website' 
      };
    }
  }

  // Parse HFL website fixtures from HTML content
  private static parseHFLWebsiteFixtures(html: string): ScrapedFixture[] {
    try {
      console.log('Parsing HFL website fixtures...');
      
      const fixtures: ScrapedFixture[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Find fixture tables - HFL website uses tables for fixtures
      const fixtureTables = doc.querySelectorAll('table.fixtures-table, table');
      
      console.log(`Found ${fixtureTables.length} potential fixture tables`);
      
      if (fixtureTables.length === 0) {
        console.log('No fixture tables found, trying alternative selectors');
        const alternativeTables = doc.querySelectorAll('div.fixtures table, .content table');
        console.log(`Found ${alternativeTables.length} tables with alternative selectors`);
        
        if (alternativeTables.length > 0) {
          this.parseTableFixtures(alternativeTables, fixtures);
        }
      } else {
        this.parseTableFixtures(fixtureTables, fixtures);
      }
      
      // If no fixtures found via tables, try extracting from general content
      if (fixtures.length === 0) {
        console.log('No fixtures found in tables, trying to extract from general content');
        // Look for fixture sections or text that contains fixture information
        const fixturesSections = doc.querySelectorAll('.fixtures, .fixture-list, .content');
        
        fixturesSections.forEach(section => {
          const text = section.textContent || '';
          // Try to find patterns like "Team A vs Team B - Date, Time"
          const fixturePatterns = text.match(/([A-Za-z\s]+)\s+(?:v|vs|versus)\s+([A-Za-z\s]+)(?:\s*[-–]\s*([A-Za-z0-9,\s]+))?/g);
          
          if (fixturePatterns) {
            fixturePatterns.forEach(pattern => {
              try {
                const match = pattern.match(/([A-Za-z\s]+)\s+(?:v|vs|versus)\s+([A-Za-z\s]+)(?:\s*[-–]\s*([A-Za-z0-9,\s]+))?/);
                if (match) {
                  const homeTeam = match[1].trim();
                  const awayTeam = match[2].trim();
                  let dateInfo = match[3] ? match[3].trim() : '';
                  
                  // Default date to today if not provided
                  let date = new Date().toISOString().split('T')[0];
                  let time = '15:00';
                  
                  // Try to extract date and time from the info
                  if (dateInfo) {
                    const dateTimeMatch = dateInfo.match(/(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})?(?:\s*,?\s*(\d{1,2}:\d{2}))?/);
                    if (dateTimeMatch) {
                      if (dateTimeMatch[1]) {
                        // Try to parse the date
                        const dateParts = dateTimeMatch[1].split(/[\/\.-]/);
                        if (dateParts.length === 3) {
                          // Assuming day/month/year format
                          let year = dateParts[2].length === 2 ? '20' + dateParts[2] : dateParts[2];
                          const dateObj = new Date(`${year}-${dateParts[1]}-${dateParts[0]}`);
                          if (!isNaN(dateObj.getTime())) {
                            date = dateObj.toISOString().split('T')[0];
                          }
                        }
                      }
                      
                      if (dateTimeMatch[2]) {
                        time = dateTimeMatch[2];
                      }
                    }
                  }
                  
                  fixtures.push({
                    homeTeam,
                    awayTeam,
                    date,
                    time,
                    competition: 'Highland League',
                    venue: 'TBD',
                    isCompleted: false,
                    homeScore: null,
                    awayScore: null
                  });
                }
              } catch (err) {
                console.warn('Error parsing fixture pattern:', err);
              }
            });
          }
        });
      }
      
      return fixtures;
    } catch (error) {
      console.error('Error parsing HFL website fixtures:', error);
      return [];
    }
  }
  
  // Helper method to parse fixtures from tables
  private static parseTableFixtures(tables: NodeListOf<Element>, fixtures: ScrapedFixture[]): void {
    tables.forEach((table, tableIndex) => {
      try {
        console.log(`Processing table ${tableIndex + 1}`);
        const rows = table.querySelectorAll('tr');
        
        console.log(`Found ${rows.length} rows in table ${tableIndex + 1}`);
        
        // Skip the header row if it exists
        const startIndex = rows.length > 0 && rows[0].querySelector('th') ? 1 : 0;
        
        for (let i = startIndex; i < rows.length; i++) {
          try {
            const cells = rows[i].querySelectorAll('td');
            if (cells.length < 3) continue; // Need at least date, teams, and competition
            
            // Determine which columns contain what data
            let dateText = '';
            let timeText = '15:00'; // Default time
            let teamsText = '';
            let venueText = 'TBD';
            let competitionText = 'Highland League';
            
            // Try to determine the data in each cell based on content and position
            if (cells.length >= 3) {
              // Most common structure: Date | Teams | Competition/Venue
              dateText = cells[0].textContent?.trim() || '';
              teamsText = cells[1].textContent?.trim() || '';
              competitionText = cells[2].textContent?.trim() || 'Highland League';
              
              // If we have more cells, see if one contains venue info
              if (cells.length > 3) {
                venueText = cells[3].textContent?.trim() || 'TBD';
              }
              
              // Check if the date cell contains time as well
              const dateTimeSplit = dateText.split(/\s+/);
              if (dateTimeSplit.length > 1 && dateTimeSplit[1].match(/\d{1,2}:\d{2}/)) {
                timeText = dateTimeSplit[1];
                dateText = dateTimeSplit[0];
              }
            }
            
            // Parse the date
            let date = new Date().toISOString().split('T')[0]; // Default to today
            if (dateText) {
              try {
                // Try various date formats
                let dateObj;
                
                // Check for "Day Month Year" format (e.g., "25 December 2023")
                const dmyMatch = dateText.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
                if (dmyMatch) {
                  const day = dmyMatch[1];
                  const month = dmyMatch[2];
                  const year = dmyMatch[3];
                  const monthMap: {[key: string]: string} = {
                    'january': '01', 'february': '02', 'march': '03', 'april': '04',
                    'may': '05', 'june': '06', 'july': '07', 'august': '08',
                    'september': '09', 'october': '10', 'november': '11', 'december': '12'
                  };
                  const monthNum = monthMap[month.toLowerCase()];
                  if (monthNum) {
                    dateObj = new Date(`${year}-${monthNum}-${day}`);
                  }
                } else {
                  // Try DD/MM/YYYY format
                  const parts = dateText.split(/[\/\.-]/);
                  if (parts.length === 3) {
                    let day = parts[0];
                    let month = parts[1];
                    let year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
                    dateObj = new Date(`${year}-${month}-${day}`);
                  }
                }
                
                if (dateObj && !isNaN(dateObj.getTime())) {
                  date = dateObj.toISOString().split('T')[0];
                }
              } catch (e) {
                console.warn(`Could not parse date: ${dateText}`);
              }
            }
            
            // Parse teams
            let homeTeam = '';
            let awayTeam = '';
            
            if (teamsText) {
              // Try different team separators
              let separator = '';
              if (teamsText.includes(' v ')) separator = ' v ';
              else if (teamsText.includes(' vs ')) separator = ' vs ';
              else if (teamsText.includes(' vs. ')) separator = ' vs. ';
              else if (teamsText.includes(' - ')) separator = ' - ';
              
              if (separator) {
                const teams = teamsText.split(separator);
                if (teams.length === 2) {
                  homeTeam = teams[0].trim();
                  awayTeam = teams[1].trim();
                  
                  // Check for scores in the team names
                  const homeScoreMatch = homeTeam.match(/(.+)\s+\((\d+)\)$/);
                  const awayScoreMatch = awayTeam.match(/(.+)\s+\((\d+)\)$/);
                  
                  let isCompleted = false;
                  let homeScore = null;
                  let awayScore = null;
                  
                  if (homeScoreMatch) {
                    homeTeam = homeScoreMatch[1].trim();
                    homeScore = parseInt(homeScoreMatch[2], 10);
                    isCompleted = true;
                  }
                  
                  if (awayScoreMatch) {
                    awayTeam = awayScoreMatch[1].trim();
                    awayScore = parseInt(awayScoreMatch[2], 10);
                    isCompleted = true;
                  }
                  
                  // Only add if we have both team names
                  if (homeTeam && awayTeam) {
                    fixtures.push({
                      homeTeam,
                      awayTeam,
                      date,
                      time: timeText,
                      competition: competitionText,
                      venue: venueText,
                      isCompleted,
                      homeScore,
                      awayScore
                    });
                  }
                }
              }
            }
          } catch (err) {
            console.warn(`Error parsing row ${i} in table ${tableIndex + 1}:`, err);
          }
        }
      } catch (err) {
        console.warn(`Error processing table ${tableIndex + 1}:`, err);
      }
    });
  }

  // New method: Fetch fixtures from BBC Sport
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
    // First try the official HFL website (most reliable source)
    try {
      console.log('Attempting Highland Football League website fetch first');
      const hflResult = await this.fetchHighlandLeagueWebsite();
      
      if (hflResult.success && hflResult.data && hflResult.data.length > 0) {
        console.log('HFL website fixtures fetch successful');
        return hflResult;
      } else {
        console.log('HFL website fixtures fetch failed, trying BBC Sport');
      }
    } catch (error) {
      console.error('Error in HFL website fetch, continuing to BBC:', error);
    }
    
    // Then try BBC Sport
    try {
      console.log('Attempting BBC Sport fixtures fetch');
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
