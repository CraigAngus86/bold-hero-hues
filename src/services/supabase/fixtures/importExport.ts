
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/components/fixtures/types';
import { DBFixture, ScrapedFixture } from '@/types/fixtures';
import { toast } from 'sonner';

// Function to insert or update fixtures in Supabase
export const insertOrUpdateFixtures = async (fixtures: DBFixture[], source: string): Promise<boolean> => {
  try {
    if (!fixtures || fixtures.length === 0) {
      console.warn('No fixtures to insert or update.');
      return true;
    }

    const { data, error } = await supabase
      .from('fixtures')
      .upsert(
        fixtures,
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Error inserting/updating fixtures:', error);
      toast.error(`Failed to ${source} fixtures: ${error.message}`);
      return false;
    }

    console.log(`Successfully ${source} ${fixtures.length} fixtures.`);
    toast.success(`Successfully ${source} ${fixtures.length} fixtures.`);
    return true;
  } catch (error) {
    console.error('Error during fixtures upsert operation:', error);
    toast.error(`Error during fixtures ${source}: ${error}`);
    return false;
  }
};

// Function to import fixtures from JSON
export const importFixturesFromJson = async (jsonData: string): Promise<boolean> => {
  try {
    const fixtures: DBFixture[] = JSON.parse(jsonData);
    
    // Add a second argument as requried by the function signature
    const result = await insertOrUpdateFixtures(fixtures, 'import');
    return result;
  } catch (error) {
    console.error('Error importing fixtures from JSON:', error);
    toast.error('Failed to import fixtures from JSON');
    return false;
  }
};

// Function to validate fixtures before importing
export const validateFixtures = (fixtures: DBFixture[]): DBFixture[] => {
  const validFixtures: DBFixture[] = [];

  for (const fixture of fixtures) {
    if (
      fixture.id &&
      fixture.date &&
      fixture.time &&
      fixture.home_team &&
      fixture.away_team &&
      fixture.competition &&
      fixture.venue !== undefined &&
      fixture.is_completed !== undefined
    ) {
      validFixtures.push(fixture);
    } else {
      console.warn('Invalid fixture found:', fixture);
    }
  }

  return validFixtures;
};

// Function to import and validate fixtures from JSON
export const importHistoricFixtures = async (jsonData: any): Promise<boolean> => {
  try {
    // Check if it's an array or string
    let fixtures: DBFixture[];
    
    if (typeof jsonData === 'string') {
      fixtures = JSON.parse(jsonData);
    } else if (Array.isArray(jsonData)) {
      fixtures = jsonData;
    } else {
      throw new Error('Invalid data format. Expected an array of fixtures.');
    }
    
    const validFixtures = validateFixtures(fixtures);
    
    const result = await insertOrUpdateFixtures(validFixtures, 'import');
    return result;
  } catch (error) {
    console.error('Error importing and validating fixtures from JSON:', error);
    toast.error('Failed to import and validate fixtures from JSON');
    return false;
  }
};

// Function to export fixtures to JSON
export const exportFixturesToJson = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*');

    if (error) {
      console.error('Error fetching fixtures:', error);
      toast.error('Failed to export fixtures to JSON');
      return null;
    }

    const jsonData = JSON.stringify(data, null, 2);
    return jsonData;
  } catch (error) {
    console.error('Error exporting fixtures to JSON:', error);
    toast.error('Failed to export fixtures to JSON');
    return null;
  }
};

// Add scrapeAndStoreFixtures function 
export const scrapeAndStoreFixtures = async (source: string): Promise<{success: boolean, fixtures?: any[]}> => {
  try {
    // Call the edge function to scrape fixtures
    const { data, error } = await supabase.functions.invoke('scrape-fixtures', {
      body: { action: source }
    });
    
    if (error) {
      console.error(`Error scraping fixtures from ${source}:`, error);
      return { success: false };
    }
    
    if (!data?.success || !data.fixtures) {
      return { success: false };
    }
    
    // Convert scraped fixtures to DB format
    const dbFixtures = data.fixtures.map((fixture: ScrapedFixture) => ({
      id: fixture.id || crypto.randomUUID(), // Use the id if available or generate a new one
      date: fixture.date,
      time: fixture.time,
      home_team: fixture.homeTeam,
      away_team: fixture.awayTeam,
      competition: fixture.competition,
      venue: fixture.venue,
      is_completed: fixture.isCompleted,
      home_score: fixture.homeScore,
      away_score: fixture.awayScore,
      source: source
    }));
    
    // Store the fixtures in the database
    const storeResult = await insertOrUpdateFixtures(dbFixtures, `scrape-${source}`);
    
    return {
      success: storeResult,
      fixtures: data.fixtures
    };
  } catch (error) {
    console.error(`Error in scrapeAndStoreFixtures (${source}):`, error);
    return { success: false };
  }
};
