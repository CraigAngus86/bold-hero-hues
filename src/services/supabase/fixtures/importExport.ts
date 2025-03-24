
import { supabase } from '@/services/supabase/supabaseClient';
import { toast } from 'sonner';
import { ScrapedFixture } from '@/types/fixtures';

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
      
      // Check for data format issues - if the date field contains team names
      // This is a workaround for the scraper returning mixed up data
      let homeTeam = fixture.homeTeam;
      let awayTeam = fixture.awayTeam;
      let date = fixture.date;
      
      // If date contains a team name and homeTeam contains a score-like string, 
      // we need to rearrange the data
      if (date.includes('FC') || date.includes('City') || date.includes('United') || date.includes('Rangers')) {
        // The date field likely contains the home team name
        homeTeam = date;
        
        // Attempt to extract a proper date from somewhere else or use a placeholder
        date = new Date().toISOString().split('T')[0]; // Today's date as fallback
        
        console.log(`Fixed inverted data for fixture: Original date="${fixture.date}", Using="${date}", HomeTeam="${homeTeam}"`);
      }
      
      // Clean up the team names if they contain score information
      if (homeTeam.includes('v')) {
        const parts = homeTeam.split('v').map(p => p.trim());
        if (parts.length === 2) {
          try {
            // If it looks like "3 v 2", the home team is from date field
            const scorePattern = /^\d+$/;
            if (scorePattern.test(parts[0]) && scorePattern.test(parts[1])) {
              homeTeam = date;
              // We already set date to today's date above
            }
          } catch (e) {
            console.error('Error parsing score from team name:', e);
          }
        }
      }
      
      if (awayTeam.includes('v')) {
        const parts = awayTeam.split('v').map(p => p.trim());
        if (parts.length === 2) {
          try {
            // If it looks like "3 v 2", use the away team name from somewhere else
            const scorePattern = /^\d+$/;
            if (scorePattern.test(parts[0]) && scorePattern.test(parts[1])) {
              // Try to find away team name in the original date field
              if (date.includes('FC')) {
                awayTeam = date;
              }
            }
          } catch (e) {
            console.error('Error parsing score from team name:', e);
          }
        }
      }
      
      // Final data cleanup
      homeTeam = homeTeam.replace(/\d+\s*v\s*\d+/g, '').trim();
      awayTeam = awayTeam.replace(/\d+\s*v\s*\d+/g, '').trim();
      
      // Make sure date is in YYYY-MM-DD format
      if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Try to parse the date or use a fallback
        try {
          const parsedDate = new Date(date);
          if (!isNaN(parsedDate.getTime())) {
            date = parsedDate.toISOString().split('T')[0];
          } else {
            date = new Date().toISOString().split('T')[0]; // Today's date as fallback
          }
        } catch (e) {
          date = new Date().toISOString().split('T')[0]; // Today's date as fallback
        }
      }
      
      return {
        home_team: homeTeam,
        away_team: awayTeam,
        date: date,
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
    
    // Insert the fixtures into Supabase
    const { error } = await supabase
      .from('matches')
      .upsert(formattedFixtures, {
        onConflict: 'home_team,away_team,date', // This matches our unique constraint
        ignoreDuplicates: false,
      });
    
    if (error) {
      console.error('Error storing fixtures in Supabase:', error);
      toast.error('Error storing fixtures in database');
      return false;
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
