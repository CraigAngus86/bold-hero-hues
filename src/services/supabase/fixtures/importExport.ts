
import { supabase } from '@/integrations/supabase/client';
import { ScrapedFixture } from '@/types/fixtures';
import { storeFixtures } from './storeService';
import { logScrapeOperation } from './loggingService';
import { toast } from 'sonner';

/**
 * Import historic fixtures from a JSON file
 * @param jsonData The parsed JSON data containing fixtures array
 * @returns Promise with operation result
 */
export const importHistoricFixtures = async (jsonData: ScrapedFixture[] | any[]): Promise<boolean> => {
  try {
    if (!Array.isArray(jsonData)) {
      toast.error('Invalid JSON format');
      return false;
    }
    
    // Convert the data if it's in the Claude script format
    const fixtures: ScrapedFixture[] = jsonData.map(fixture => {
      // Check if this is our standard format or Claude's format
      if ('homeTeam' in fixture || 'home_team' in fixture) {
        // It's already in our format or close to it
        return fixture as ScrapedFixture;
      } else {
        // It's in Claude's format, convert it
        // Banks O' Dee is always one of the teams, the other team is the opposition
        const isHome = fixture.location === 'Home';
        
        return {
          homeTeam: isHome ? "Banks o' Dee FC" : fixture.opposition || '',
          awayTeam: isHome ? fixture.opposition || '' : "Banks o' Dee FC",
          date: fixture.date || '',
          time: fixture.kickOffTime || fixture.kick_off_time || '',
          competition: fixture.competition || '',
          venue: isHome ? "Spain Park" : fixture.location || '',
          isCompleted: fixture.isCompleted || fixture.is_completed || false,
          homeScore: isHome ? 
            (fixture.score ? parseInt(fixture.score.split('-')[0]) : null) : 
            (fixture.score ? parseInt(fixture.score.split('-')[1]) : null),
          awayScore: isHome ? 
            (fixture.score ? parseInt(fixture.score.split('-')[1]) : null) : 
            (fixture.score ? parseInt(fixture.score.split('-')[0]) : null),
          source: 'manual-import'
        };
      }
    });
    
    const source = 'manual-import';
    const result = await storeFixtures(fixtures, source);
    
    if (result.success) {
      toast.success(`Successfully imported ${fixtures.length} fixtures`);
      return true;
    } else {
      toast.error(`Failed to import fixtures: ${result.message}`);
      return false;
    }
  } catch (error) {
    console.error('Error importing fixtures:', error);
    toast.error('Error importing fixtures');
    return false;
  }
};

/**
 * Scrape and store fixtures in one operation
 * @param fixtures Array of scraped fixtures to store
 * @returns Promise with operation success status
 */
export const scrapeAndStoreFixtures = async (fixtures: ScrapedFixture[]): Promise<boolean> => {
  try {
    if (!fixtures || fixtures.length === 0) {
      console.warn('No fixtures provided to scrapeAndStoreFixtures');
      return false;
    }
    
    // Determine the source based on the first fixture
    const source = fixtures[0].source || 'unknown';
    
    // Store the fixtures
    const result = await storeFixtures(fixtures, source);
    
    return result.success;
  } catch (error) {
    console.error('Error in scrapeAndStoreFixtures:', error);
    return false;
  }
};
