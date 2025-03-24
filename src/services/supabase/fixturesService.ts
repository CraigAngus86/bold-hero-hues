
import { supabase } from '@/integrations/supabase/client';
import { ScrapedFixture } from '@/types/fixtures';
import { toast } from 'sonner';

/**
 * Fetches all fixtures from Supabase
 * @returns Array of fixtures
 */
export const fetchFixturesFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .eq('is_completed', false)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching fixtures:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchFixturesFromSupabase:', error);
    return [];
  }
};

/**
 * Fetches all results from Supabase
 * @returns Array of completed fixtures (results)
 */
export const fetchResultsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .eq('is_completed', true)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchResultsFromSupabase:', error);
    return [];
  }
};

/**
 * Fetches all matches (fixtures and results) from Supabase
 * @returns Array of all matches
 */
export const fetchMatchesFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchMatchesFromSupabase:', error);
    return [];
  }
};

/**
 * Store scraped fixtures in the database
 * @param fixtures Array of scraped fixtures to store
 * @param source Source of the fixture data (e.g., 'bbc-sport', 'highland-league')
 * @returns Object with information about the import process
 */
export const storeFixtures = async (fixtures: ScrapedFixture[], source: string) => {
  if (!fixtures || fixtures.length === 0) {
    return { success: false, message: 'No fixtures to store', added: 0, updated: 0 };
  }
  
  try {
    console.log(`Storing ${fixtures.length} fixtures from ${source}`);
    
    let addedCount = 0;
    let updatedCount = 0;
    
    // Process fixtures in batches to avoid timeout issues
    const BATCH_SIZE = 50;
    const batches = Math.ceil(fixtures.length / BATCH_SIZE);
    
    for (let i = 0; i < batches; i++) {
      const start = i * BATCH_SIZE;
      const end = Math.min((i + 1) * BATCH_SIZE, fixtures.length);
      const currentBatch = fixtures.slice(start, end);
      
      // For each fixture in the batch, check if it exists
      for (const fixture of currentBatch) {
        const formattedFixture = {
          home_team: fixture.homeTeam,
          away_team: fixture.awayTeam,
          date: fixture.date,
          time: fixture.time,
          competition: fixture.competition,
          venue: fixture.venue || '',
          is_completed: !!fixture.isCompleted,
          home_score: fixture.homeScore !== undefined ? fixture.homeScore : null,
          away_score: fixture.awayScore !== undefined ? fixture.awayScore : null,
          source: source
        };
        
        // Check if this fixture already exists
        const { data: existingFixtures, error: checkError } = await supabase
          .from('fixtures')
          .select('id')
          .eq('home_team', formattedFixture.home_team)
          .eq('away_team', formattedFixture.away_team)
          .eq('date', formattedFixture.date);
        
        if (checkError) {
          console.error('Error checking if fixture exists:', checkError);
          continue;
        }
        
        if (existingFixtures && existingFixtures.length > 0) {
          // Update existing fixture
          const fixtureId = existingFixtures[0].id;
          
          const { error: updateError } = await supabase
            .from('fixtures')
            .update({
              ...formattedFixture,
              updated_at: new Date().toISOString()
            })
            .eq('id', fixtureId);
          
          if (updateError) {
            console.error('Error updating fixture:', updateError);
            continue;
          }
          
          updatedCount++;
        } else {
          // Insert new fixture
          const { error: insertError } = await supabase
            .from('fixtures')
            .insert([{
              ...formattedFixture,
              import_date: new Date().toISOString()
            }]);
          
          if (insertError) {
            console.error('Error inserting fixture:', insertError);
            continue;
          }
          
          addedCount++;
        }
      }
    }
    
    // Log the scrape operation
    await logScrapeOperation(source, 'success', fixtures.length, addedCount, updatedCount);
    
    console.log(`Successfully stored fixtures: added ${addedCount}, updated ${updatedCount}`);
    return { 
      success: true, 
      message: `Successfully imported fixtures: added ${addedCount}, updated ${updatedCount}`,
      added: addedCount,
      updated: updatedCount
    };
  } catch (error) {
    console.error('Error storing fixtures:', error);
    
    // Log the error
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
      message: `Error storing fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`,
      added: 0,
      updated: 0
    };
  }
};

/**
 * Stores a record of scrape operations
 */
export const logScrapeOperation = async (
  source: string,
  status: 'success' | 'error',
  itemsFound: number,
  itemsAdded: number,
  itemsUpdated: number,
  errorMessage?: string
) => {
  try {
    await supabase.from('scrape_logs').insert([{
      source,
      status,
      items_found: itemsFound,
      items_added: itemsAdded,
      items_updated: itemsUpdated,
      error_message: errorMessage
    }]);
  } catch (error) {
    console.error('Error logging scrape operation:', error);
  }
};

/**
 * Imports historic fixtures from a JSON file
 */
export const importHistoricFixtures = async (fixtures: ScrapedFixture[], source: string) => {
  try {
    const result = await storeFixtures(fixtures, source);
    
    if (result.success) {
      toast.success(`Successfully imported ${result.added + result.updated} historic fixtures`);
      return true;
    } else {
      toast.error(result.message);
      return false;
    }
  } catch (error) {
    console.error('Error importing historic fixtures:', error);
    toast.error(`Error importing historic fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};

/**
 * Scrapes and store fixtures from a provided source
 */
export const scrapeAndStoreFixtures = async (fixtures: ScrapedFixture[]) => {
  if (!fixtures || fixtures.length === 0) {
    toast.error('No fixtures found to import');
    return false;
  }
  
  try {
    const source = 'manual-import';
    const result = await storeFixtures(fixtures, source);
    
    if (result.success) {
      toast.success(`Successfully imported ${result.added + result.updated} fixtures`);
      return true;
    } else {
      toast.error(result.message);
      return false;
    }
  } catch (error) {
    console.error('Error in scrapeAndStoreFixtures:', error);
    toast.error(`Error importing fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};
