import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/components/fixtures/types';
import { Fixture } from '@/types/fixtures';
import { toast } from 'sonner';

// Function to insert or update fixtures in Supabase
export const insertOrUpdateFixtures = async (fixtures: Fixture[], source: string): Promise<boolean> => {
  try {
    if (!fixtures || fixtures.length === 0) {
      console.warn('No fixtures to insert or update.');
      return true;
    }

    const { data, error } = await supabase
      .from('fixtures')
      .upsert(
        fixtures,
        { onConflict: 'id', returning: 'minimal' }
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
    const fixtures: Fixture[] = JSON.parse(jsonData);
    
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
export const validateFixtures = (fixtures: Fixture[]): Fixture[] => {
  const validFixtures: Fixture[] = [];

  for (const fixture of fixtures) {
    if (
      fixture.id &&
      fixture.date &&
      fixture.time &&
      fixture.homeTeam &&
      fixture.awayTeam &&
      fixture.competition &&
      fixture.venue !== undefined &&
      fixture.isCompleted !== undefined
    ) {
      validFixtures.push(fixture);
    } else {
      console.warn('Invalid fixture found:', fixture);
    }
  }

  return validFixtures;
};

// Function to import and validate fixtures from JSON
export const importAndValidateFixturesFromJson = async (jsonData: string): Promise<boolean> => {
  try {
    const fixtures: Fixture[] = JSON.parse(jsonData);
    const validFixtures = validateFixtures(fixtures);
    
    // Add a second argument as requried by the function signature
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
