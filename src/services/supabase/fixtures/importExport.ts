
import { supabase } from '@/integrations/supabase/client';
import { DBFixture } from '@/types/fixtures';
import { toast } from 'sonner';

/**
 * Validate fixture data before import
 */
export const validateFixtures = (fixtures: any[]): { valid: boolean, errors: string[] } => {
  const errors: string[] = [];
  
  if (!Array.isArray(fixtures)) {
    errors.push('Data is not an array');
    return { valid: false, errors };
  }
  
  if (fixtures.length === 0) {
    errors.push('No fixtures to import');
    return { valid: false, errors };
  }
  
  // Check each fixture for required fields
  fixtures.forEach((fixture, index) => {
    if (!fixture.date) errors.push(`Fixture #${index + 1} is missing date`);
    if (!fixture.time) errors.push(`Fixture #${index + 1} is missing time`);
    if (!fixture.home_team && !fixture.homeTeam) errors.push(`Fixture #${index + 1} is missing home team`);
    if (!fixture.away_team && !fixture.awayTeam) errors.push(`Fixture #${index + 1} is missing away team`);
    if (!fixture.competition) errors.push(`Fixture #${index + 1} is missing competition`);
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Insert or update fixtures in the database
 */
export const insertOrUpdateFixtures = async (fixtures: any[]): Promise<{
  success: boolean;
  inserted: number;
  updated: number;
  errors: any[];
}> => {
  const errors: any[] = [];
  let inserted = 0;
  let updated = 0;

  try {
    // Standardize the fixtures data structure
    const standardizedFixtures = fixtures.map(fixture => ({
      date: fixture.date,
      time: fixture.time,
      home_team: fixture.homeTeam || fixture.home_team,
      away_team: fixture.awayTeam || fixture.away_team,
      competition: fixture.competition,
      venue: fixture.venue,
      is_completed: fixture.isCompleted || fixture.is_completed || false,
      home_score: fixture.homeScore || fixture.home_score,
      away_score: fixture.awayScore || fixture.away_score,
      source: fixture.source || 'manual_import',
      ticket_link: fixture.ticketLink || fixture.ticket_link
    }));
    
    // Process fixtures in batches to avoid API limits
    const batchSize = 50;
    for (let i = 0; i < standardizedFixtures.length; i += batchSize) {
      const batch = standardizedFixtures.slice(i, i + batchSize);
      
      // Check if fixtures already exist by matching dates and teams
      for (const fixture of batch) {
        const { data: existingFixtures, error: checkError } = await supabase
          .from('fixtures')
          .select('id')
          .eq('date', fixture.date)
          .eq('home_team', fixture.home_team)
          .eq('away_team', fixture.away_team);
        
        if (checkError) {
          errors.push({fixture, error: checkError});
          continue;
        }
        
        if (existingFixtures && existingFixtures.length > 0) {
          // Update existing fixture
          const { error: updateError } = await supabase
            .from('fixtures')
            .update(fixture)
            .eq('id', existingFixtures[0].id);
          
          if (updateError) {
            errors.push({fixture, error: updateError});
          } else {
            updated++;
          }
        } else {
          // Insert new fixture
          const { error: insertError } = await supabase
            .from('fixtures')
            .insert([fixture]);
          
          if (insertError) {
            errors.push({fixture, error: insertError});
          } else {
            inserted++;
          }
        }
      }
    }
    
    return {
      success: errors.length === 0,
      inserted,
      updated,
      errors
    };
  } catch (error) {
    console.error('Error in insertOrUpdateFixtures:', error);
    return {
      success: false,
      inserted,
      updated,
      errors: [{general: error}]
    };
  }
};

/**
 * Import fixtures from external scrapers
 */
export const scrapeAndStoreFixtures = async (source: string, fixtures: any[]): Promise<{
  success: boolean;
  message: string;
  inserted?: number;
  updated?: number;
}> => {
  try {
    // Validate fixtures
    const validation = validateFixtures(fixtures);
    if (!validation.valid) {
      return {
        success: false,
        message: `Invalid fixture data: ${validation.errors.join(', ')}`
      };
    }
    
    // Insert or update fixtures
    const result = await insertOrUpdateFixtures(fixtures);
    
    // Log operation
    await supabase
      .from('scrape_logs')
      .insert({
        source,
        status: result.success ? 'completed' : 'failed',
        items_found: fixtures.length,
        items_added: result.inserted,
        items_updated: result.updated,
        error_message: result.errors.length > 0 ? JSON.stringify(result.errors) : null
      });
    
    return {
      success: result.success,
      message: `Imported ${result.inserted} new fixtures, updated ${result.updated} existing fixtures`,
      inserted: result.inserted,
      updated: result.updated
    };
  } catch (error) {
    console.error('Error in scrapeAndStoreFixtures:', error);
    return {
      success: false,
      message: `Error importing fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Import fixtures from JSON file
 */
export const importFixturesFromJson = async (jsonData: any): Promise<{
  success: boolean;
  message: string;
  inserted?: number;
  updated?: number;
}> => {
  try {
    let fixtures = [];
    
    // Handle different JSON structures
    if (Array.isArray(jsonData)) {
      fixtures = jsonData;
    } else if (jsonData.fixtures && Array.isArray(jsonData.fixtures)) {
      fixtures = jsonData.fixtures;
    } else if (jsonData.data && Array.isArray(jsonData.data)) {
      fixtures = jsonData.data;
    } else {
      return {
        success: false,
        message: 'Invalid JSON structure. Expected array of fixtures.'
      };
    }
    
    return await scrapeAndStoreFixtures('json_import', fixtures);
  } catch (error) {
    console.error('Error importing fixtures from JSON:', error);
    return {
      success: false,
      message: `Error importing fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Export fixtures to JSON file
 */
export const exportFixturesToJson = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Fetch all fixtures
    const { data: fixtures, error } = await supabase
      .from('fixtures')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    if (!fixtures || fixtures.length === 0) {
      return {
        success: false,
        message: 'No fixtures found to export.'
      };
    }
    
    // Format export data
    const exportData = {
      generated: new Date().toISOString(),
      count: fixtures.length,
      fixtures
    };
    
    // Create and download the JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportName = `fixtures_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
    
    return {
      success: true,
      message: `Successfully exported ${fixtures.length} fixtures.`
    };
  } catch (error) {
    console.error('Error exporting fixtures to JSON:', error);
    return {
      success: false,
      message: `Error exporting fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Import historic fixtures from a CSV or other structured source
 */
export const importHistoricFixtures = async (fixtures: any[]): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const result = await scrapeAndStoreFixtures('historic_import', fixtures);
    return result;
  } catch (error) {
    console.error('Error importing historic fixtures:', error);
    return {
      success: false,
      message: `Error importing fixtures: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
