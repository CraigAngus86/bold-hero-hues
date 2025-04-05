
import { supabase } from '@/integrations/supabase/client';
import { ScrapedFixture } from '@/types/fixtures';
import { logScrapeOperation } from './loggingService';
import { storeFixtures } from './storeService';

export const importHistoricFixtures = async (
  fixturesData: any
): Promise<boolean> => {
  try {
    // Check if the data is already in the expected format or if it's in the special Claude format
    let fixtures: ScrapedFixture[] = [];
    
    if (Array.isArray(fixturesData)) {
      if (fixturesData[0] && 'opposition' in fixturesData[0]) {
        // Convert from Claude's format to our standard format
        fixtures = fixturesData.map(item => {
          const isHome = item.location === 'Home';
          const [homeScore, awayScore] = item.score?.split('-').map(Number) || [null, null];
          
          return {
            date: item.date,
            time: item.kickOffTime || '15:00',
            homeTeam: isHome ? "Banks o' Dee" : item.opposition,
            awayTeam: isHome ? item.opposition : "Banks o' Dee",
            competition: item.competition || 'Highland League',
            venue: isHome ? "Spain Park" : `${item.opposition} Ground`,
            isCompleted: !!item.isCompleted,
            homeScore: homeScore !== null ? homeScore : undefined,
            awayScore: awayScore !== null ? awayScore : undefined,
            source: 'manual-import'
          };
        });
      } else {
        // Assuming it's already in our standard format
        fixtures = fixturesData;
      }
    }
    
    // Add source tag to all fixtures
    fixtures = fixtures.map(fixture => ({
      ...fixture,
      source: fixture.source || 'manual-import'
    }));
    
    // Store the fixtures
    const result = await storeFixtures(fixtures);
    
    // Log the operation
    await logScrapeOperation(
      'manual-import',
      result.success ? 'success' : 'error',
      fixtures.length,
      result.added,
      result.updated,
      result.success ? null : result.message
    );
    
    return result.success;
  } catch (error) {
    console.error('Error importing fixtures:', error);
    return false;
  }
};

// Function to scrape fixtures from remote sources and store them
export const scrapeAndStoreFixtures = async (
  fixtures: ScrapedFixture[],
  source: string
): Promise<{
  success: boolean;
  added: number;
  updated: number;
  message: string;
}> => {
  try {
    // Add source tag to all fixtures
    const taggedFixtures = fixtures.map(fixture => ({
      ...fixture,
      source
    }));
    
    // Store the fixtures
    const result = await storeFixtures(taggedFixtures);
    
    // Log the operation
    await logScrapeOperation(
      source,
      result.success ? 'success' : 'error',
      fixtures.length,
      result.added,
      result.updated,
      result.success ? null : result.message
    );
    
    return result;
  } catch (error) {
    console.error('Error scraping and storing fixtures:', error);
    await logScrapeOperation(
      source,
      'error',
      fixtures.length,
      0,
      0,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return {
      success: false,
      added: 0,
      updated: 0,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
