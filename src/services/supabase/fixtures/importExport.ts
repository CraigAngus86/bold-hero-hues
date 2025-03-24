
import { supabase } from '@/services/supabase/supabaseClient';
import { toast } from 'sonner';
import { ScrapedFixture, convertToMatch } from '@/types/fixtures';

export const scrapeAndStoreFixtures = async (fixtures?: ScrapedFixture[]): Promise<boolean> => {
  try {
    // If fixtures are not provided, return false
    if (!fixtures || fixtures.length === 0) {
      console.error('No fixtures provided to store');
      return false;
    }
    
    console.log(`Storing ${fixtures.length} fixtures in Supabase...`);
    
    // Format the fixtures for the database
    const formattedFixtures = fixtures.map(fixture => {
      const isCompleted = !!fixture.isCompleted;
      
      // Generate an ID if one doesn't exist
      if (!fixture.id) {
        fixture.id = `${fixture.homeTeam}-${fixture.awayTeam}-${fixture.date}-${Math.random().toString(36).substring(2, 9)}`;
      }
      
      // Format the final fixture object
      return {
        home_team: fixture.homeTeam,
        away_team: fixture.awayTeam,
        date: fixture.date,
        time: fixture.time || '15:00',
        competition: fixture.competition || 'Highland League',
        venue: fixture.venue || 'TBD',
        is_completed: isCompleted,
        home_score: isCompleted ? fixture.homeScore : null,
        away_score: isCompleted ? fixture.awayScore : null,
        visible: true, // Default to visible
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
    
    // Insert the fixtures into Supabase using service role if available
    let response;
    
    try {
      // Attempt to use regular client (subject to RLS)
      response = await supabase
        .from('matches')
        .upsert(formattedFixtures, {
          onConflict: 'home_team,away_team,date', // This matches our unique constraint
          ignoreDuplicates: false,
        });
    } catch (supabaseError) {
      console.error('Initial supabase error:', supabaseError);
      // Our first attempt failed, handle the error
      response = { error: supabaseError };
    }
    
    if (response.error) {
      console.error('Error storing fixtures in Supabase:', response.error);
      
      // Check if it's an RLS error and inform the user
      if (response.error.code === '42501' || (response.error.message && response.error.message.includes('row-level security'))) {
        const rlsErrorMessage = 'Failed to store fixtures due to Row Level Security (RLS) policy. This might require admin permissions.';
        console.error(rlsErrorMessage);
        toast.error(rlsErrorMessage);
        toast.error('Check console for details and contact your Supabase admin');
        return false;
      } else {
        toast.error('Error storing fixtures in database');
        return false;
      }
    }
    
    console.log(`Successfully stored ${formattedFixtures.length} fixtures in Supabase`);
    return true;
  } catch (error) {
    console.error('Error in scrapeAndStoreFixtures:', error);
    return false;
  }
};

/**
 * Import matches from external JSON data
 * @param matchData Array of match data to import
 * @returns boolean indicating success
 */
export const importMockDataToSupabase = async (matchData: any[]): Promise<boolean> => {
  try {
    if (!matchData || matchData.length === 0) {
      console.error('No match data provided for import');
      return false;
    }
    
    console.log(`Preparing to import ${matchData.length} matches to Supabase...`);
    
    // Format the fixtures for the database
    const fixtures = matchData.map(match => {
      const isCompleted = !!match.isCompleted;
      
      return {
        home_team: match.homeTeam,
        away_team: match.awayTeam,
        date: match.date,
        time: match.time || '15:00',
        competition: match.competition || 'Highland League',
        venue: match.venue || 'TBD',
        is_completed: isCompleted,
        home_score: isCompleted ? match.homeScore : null,
        away_score: isCompleted ? match.awayScore : null,
        visible: true, // Default to visible
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
    
    // Insert the fixtures into Supabase
    const { error } = await supabase
      .from('matches')
      .upsert(fixtures, {
        onConflict: 'home_team,away_team,date', // This matches our unique constraint
        ignoreDuplicates: false,
      });
    
    if (error) {
      console.error('Error importing matches to Supabase:', error);
      return false;
    }
    
    console.log(`Successfully imported ${fixtures.length} matches to Supabase`);
    return true;
  } catch (error) {
    console.error('Error in importMockDataToSupabase:', error);
    return false;
  }
};
