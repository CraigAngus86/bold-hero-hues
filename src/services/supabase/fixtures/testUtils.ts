
import { ScrapedFixture } from '@/types/fixtures';
import { storeFixtures } from './storeService';
import { toast } from 'sonner';

/**
 * Test utility to validate fixture data structure
 * @param fixtures Array of fixtures to validate
 * @returns Object with validation result
 */
export const validateFixtureData = (fixtures: any[]): { 
  valid: boolean; 
  message: string;
  validFixtures: ScrapedFixture[];
} => {
  if (!Array.isArray(fixtures)) {
    return { 
      valid: false, 
      message: 'Invalid data format: Expected an array of fixtures', 
      validFixtures: [] 
    };
  }

  if (fixtures.length === 0) {
    return { 
      valid: false, 
      message: 'No fixtures found in the data', 
      validFixtures: [] 
    };
  }

  // Check if fixtures have required fields based on the format
  const validFixtures: ScrapedFixture[] = [];
  const errors: string[] = [];

  fixtures.forEach((fixture, index) => {
    try {
      // Determine if this is standard format or Claude format
      const isStandardFormat = ('homeTeam' in fixture || 'home_team' in fixture);
      const isClaudeFormat = ('opposition' in fixture && 'location' in fixture);
      
      if (!isStandardFormat && !isClaudeFormat) {
        errors.push(`Fixture #${index + 1} has an unknown format`);
        return;
      }

      if (isStandardFormat) {
        // Validate standard format
        if (!fixture.homeTeam && !fixture.home_team) {
          errors.push(`Fixture #${index + 1} is missing home team`);
        }
        if (!fixture.awayTeam && !fixture.away_team) {
          errors.push(`Fixture #${index + 1} is missing away team`);
        }
        if (!fixture.date) {
          errors.push(`Fixture #${index + 1} is missing date`);
        }
      }

      if (isClaudeFormat) {
        // Validate Claude format
        if (!fixture.opposition) {
          errors.push(`Fixture #${index + 1} is missing opposition`);
        }
        if (!fixture.location) {
          errors.push(`Fixture #${index + 1} is missing location`);
        }
        if (!fixture.date) {
          errors.push(`Fixture #${index + 1} is missing date`);
        }

        // Validate location value
        if (fixture.location && !['Home', 'Away'].includes(fixture.location)) {
          errors.push(`Fixture #${index + 1} has invalid location: must be 'Home' or 'Away'`);
        }
      }

      // Add to valid fixtures if no errors
      if (isStandardFormat) {
        validFixtures.push({
          homeTeam: fixture.homeTeam || fixture.home_team || '',
          awayTeam: fixture.awayTeam || fixture.away_team || '',
          date: fixture.date || '',
          time: fixture.time || '',
          competition: fixture.competition || 'Unknown',
          venue: fixture.venue || '',
          isCompleted: fixture.isCompleted || fixture.is_completed || false,
          homeScore: fixture.homeScore || fixture.home_score || null,
          awayScore: fixture.awayScore || fixture.away_score || null,
          source: 'manual-import'
        });
      } else if (isClaudeFormat) {
        const isHome = fixture.location === 'Home';
        validFixtures.push({
          homeTeam: isHome ? "Banks o' Dee FC" : fixture.opposition || '',
          awayTeam: isHome ? fixture.opposition || '' : "Banks o' Dee FC",
          date: fixture.date || '',
          time: fixture.kickOffTime || fixture.kick_off_time || '',
          competition: fixture.competition || 'Unknown',
          venue: isHome ? "Spain Park" : fixture.location || '',
          isCompleted: fixture.isCompleted || fixture.is_completed || false,
          homeScore: isHome ? 
            (fixture.score ? parseInt(fixture.score.split('-')[0]) : null) : 
            (fixture.score ? parseInt(fixture.score.split('-')[1]) : null),
          awayScore: isHome ? 
            (fixture.score ? parseInt(fixture.score.split('-')[1]) : null) : 
            (fixture.score ? parseInt(fixture.score.split('-')[0]) : null),
          source: 'manual-import'
        });
      }
    } catch (error) {
      errors.push(`Error processing fixture #${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  if (errors.length > 0) {
    return { 
      valid: false, 
      message: `Found ${errors.length} issues with the fixture data:\n${errors.slice(0, 3).join('\n')}${errors.length > 3 ? `\n...and ${errors.length - 3} more issues` : ''}`, 
      validFixtures 
    };
  }

  return { 
    valid: true, 
    message: `Successfully validated ${validFixtures.length} fixtures`, 
    validFixtures 
  };
};

/**
 * Run a test import with the provided fixtures
 * @param fixtures Array of fixtures to test import
 * @returns Promise with test results
 */
export const testFixturesImport = async (fixtures: ScrapedFixture[]): Promise<{
  success: boolean;
  message: string;
  validationErrors?: string[];
}> => {
  try {
    // Validate the fixtures
    const validation = validateFixtureData(fixtures);
    
    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        validationErrors: [validation.message]
      };
    }
    
    // For test import, we don't actually store anything
    // We just log what would be stored
    console.log(`[TEST IMPORT] Would import ${validation.validFixtures.length} fixtures`);
    validation.validFixtures.forEach((fixture, i) => {
      if (i < 5) { // Only log first 5 for brevity
        console.log(`[TEST IMPORT] Fixture ${i + 1}:`, {
          homeTeam: fixture.homeTeam,
          awayTeam: fixture.awayTeam,
          date: fixture.date,
          competition: fixture.competition,
          isCompleted: fixture.isCompleted
        });
      }
    });
    
    return {
      success: true,
      message: `Test import successful for ${validation.validFixtures.length} fixtures`
    };
  } catch (error) {
    console.error('Error in test import:', error);
    return {
      success: false,
      message: `Error in test import: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Generate a downloadable export of all fixtures from Supabase
 */
export const generateFixturesExport = async (): Promise<void> => {
  try {
    // We'll use the fixture service to get all fixtures
    const { fetchMatchesFromSupabase } = await import('@/services/supabase/fixtures/fetchService');
    const fixtures = await fetchMatchesFromSupabase();
    
    if (!fixtures || fixtures.length === 0) {
      toast.error('No fixtures found to export');
      return;
    }
    
    // Convert DB fixtures to JSON format
    const exportData = fixtures.map(fixture => ({
      homeTeam: fixture.home_team,
      awayTeam: fixture.away_team,
      date: fixture.date,
      time: fixture.time,
      competition: fixture.competition,
      venue: fixture.venue,
      isCompleted: fixture.is_completed,
      homeScore: fixture.home_score,
      awayScore: fixture.away_score,
      source: fixture.source,
      importDate: fixture.import_date
    }));
    
    // Create downloadable file
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixtures-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
    
    toast.success(`Exported ${exportData.length} fixtures`);
  } catch (error) {
    console.error('Error generating fixtures export:', error);
    toast.error('Failed to export fixtures');
  }
};
