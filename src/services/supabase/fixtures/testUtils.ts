
import { ScrapedFixture } from '@/types/fixtures';

/**
 * Validates fixture data to ensure it meets the required format
 */
export const validateFixtureData = (data: any): {
  valid: boolean;
  message: string;
  validFixtures?: ScrapedFixture[]
} => {
  // Check if data is an array
  if (!Array.isArray(data)) {
    return {
      valid: false,
      message: 'Data must be an array of fixtures'
    };
  }
  
  // Check if array is empty
  if (data.length === 0) {
    return {
      valid: false,
      message: 'No fixtures found in the data'
    };
  }
  
  // Detect format (standard or Claude)
  const isCloudeFormat = data[0] && 'opposition' in data[0];
  
  // Validate each fixture based on format
  const validFixtures: ScrapedFixture[] = [];
  const invalidFixtures: number[] = [];
  
  data.forEach((item, index) => {
    try {
      if (isCloudeFormat) {
        // Claude format validation
        if (!item.opposition || !item.location || !item.date) {
          invalidFixtures.push(index);
          return;
        }
        
        const isHome = item.location === 'Home';
        const [homeScore, awayScore] = item.score?.split('-').map(Number) || [undefined, undefined];
        
        validFixtures.push({
          date: item.date,
          time: item.kickOffTime || '15:00',
          homeTeam: isHome ? "Banks o' Dee" : item.opposition,
          awayTeam: isHome ? item.opposition : "Banks o' Dee",
          competition: item.competition || 'Highland League',
          venue: isHome ? "Spain Park" : `${item.opposition} Ground`,
          isCompleted: !!item.isCompleted,
          homeScore: homeScore,
          awayScore: awayScore,
          source: 'manual-import'
        });
      } else {
        // Standard format validation
        if (!item.homeTeam || !item.awayTeam || !item.date) {
          invalidFixtures.push(index);
          return;
        }
        
        validFixtures.push({
          date: item.date,
          time: item.time || '15:00',
          homeTeam: item.homeTeam,
          awayTeam: item.awayTeam,
          competition: item.competition || 'Highland League',
          venue: item.venue || 'TBD',
          isCompleted: !!item.isCompleted,
          homeScore: item.homeScore,
          awayScore: item.awayScore,
          source: 'manual-import'
        });
      }
    } catch (error) {
      invalidFixtures.push(index);
    }
  });
  
  if (invalidFixtures.length > 0) {
    return {
      valid: validFixtures.length > 0,
      message: `${validFixtures.length} valid fixtures found, ${invalidFixtures.length} invalid fixtures detected at positions: ${invalidFixtures.join(', ')}`,
      validFixtures
    };
  }
  
  return {
    valid: true,
    message: `${validFixtures.length} valid fixtures found`,
    validFixtures
  };
};

/**
 * Function to test the import without actually saving to database
 */
export const testFixturesImport = async (data: any): Promise<{
  valid: boolean;
  message: string;
  fixtures?: ScrapedFixture[]
}> => {
  try {
    return validateFixtureData(data);
  } catch (error) {
    return {
      valid: false,
      message: error instanceof Error ? error.message : 'Unknown error validating fixtures'
    };
  }
};

/**
 * Function to download fixtures as JSON file
 */
export const generateFixturesExport = async () => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Fetch all fixtures from the database
    const { data: fixtures, error } = await supabase
      .from('fixtures')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    // Format data for export
    const exportData = fixtures.map(fixture => ({
      date: fixture.date,
      time: fixture.time,
      homeTeam: fixture.home_team,
      awayTeam: fixture.away_team,
      competition: fixture.competition,
      venue: fixture.venue,
      isCompleted: fixture.is_completed,
      homeScore: fixture.home_score,
      awayScore: fixture.away_score
    }));
    
    // Create and download the file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `banks-o-dee-fixtures-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    linkElement.remove();
    
    return true;
  } catch (error) {
    console.error('Error exporting fixtures:', error);
    return false;
  }
};
