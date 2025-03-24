
import { supabase } from '@/services/supabase/supabaseClient';
import { Match } from '@/components/fixtures/types';
import { toast } from 'sonner';

// Import mock data to Supabase
export const importMockDataToSupabase = async (mockMatches: Match[]): Promise<boolean> => {
  try {
    // First, validate the matches to ensure they have all required fields
    const validMatches = mockMatches.filter(match => 
      match.homeTeam && 
      match.awayTeam && 
      match.date &&
      match.time &&
      match.competition &&
      match.venue &&
      typeof match.isCompleted === 'boolean' // Ensure isCompleted is a boolean
    );
    
    if (validMatches.length === 0) {
      toast.error('No valid matches to import');
      return false;
    }
    
    console.log(`Validated ${validMatches.length} matches for import`);
    
    // Convert to Supabase format with all required fields
    // Create an array of objects with explicitly defined required fields
    const supabaseMatches = validMatches.map(match => ({
      home_team: match.homeTeam,
      away_team: match.awayTeam,
      date: match.date,
      time: match.time,
      competition: match.competition,
      venue: match.venue,
      is_completed: match.isCompleted,
      home_score: match.isCompleted ? match.homeScore : null,
      away_score: match.isCompleted ? match.awayScore : null,
      status: match.isCompleted ? 'completed' : 'upcoming',
      visible: true
    }));
    
    console.log(`Importing ${supabaseMatches.length} matches to Supabase...`);
    console.log('Sample match data:', supabaseMatches[0]);
    
    const { error } = await supabase
      .from('matches')
      .insert(supabaseMatches);

    if (error) {
      console.error('Error importing match data to Supabase:', error);
      toast.error(`Failed to import match data: ${error.message}`);
      return false;
    }

    console.log('Match data imported successfully');
    toast.success('Match data imported successfully');
    return true;
  } catch (error) {
    console.error('Error in importMockDataToSupabase:', error);
    toast.error('Failed to import match data');
    return false;
  }
};

// Scrape fixtures and results and store in Supabase
export const scrapeAndStoreFixtures = async (): Promise<boolean> => {
  try {
    toast.info("Fetching fixtures and results data...");
    
    // Use the FirecrawlService to fetch fixtures from RSS
    const { FirecrawlService } = await import('@/utils/FirecrawlService');
    const result = await FirecrawlService.fetchHighlandLeagueRSS();
    
    if (!result.success || !result.data || result.data.length === 0) {
      const errorMsg = result.error || 'No fixtures found in the RSS feed';
      console.error(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    
    console.log('Fixtures fetched:', result.data.length);
    
    // Add a temporary ID to each fixture and ensure required fields are present
    const fixturesWithRequiredFields: Match[] = result.data.map((fixture, index) => ({
      id: `temp-${index}`, // Temporary ID, will be replaced by UUID in Supabase
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      date: fixture.date || new Date().toISOString().split('T')[0], // Default to today if no date
      time: fixture.time || '00:00', // Default time if none provided
      competition: fixture.competition || 'Highland League',
      venue: fixture.venue || 'TBD',
      isCompleted: fixture.isCompleted || false, // Default to false if not provided
      homeScore: fixture.homeScore || null,
      awayScore: fixture.awayScore || null
    }));
    
    console.log('Clearing existing matches from database...');
    
    // Clear existing data first
    const { error: deleteError } = await supabase
      .from('matches')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Avoid deleting any special records
      
    if (deleteError) {
      console.error('Error clearing existing matches:', deleteError);
      toast.error(`Failed to clear existing data: ${deleteError.message}`);
      return false;
    }
    
    console.log('Storing new fixtures in database...');
    return await importMockDataToSupabase(fixturesWithRequiredFields);
  } catch (error) {
    console.error('Error in scrapeAndStoreFixtures:', error);
    toast.error('Failed to fetch and store fixtures data');
    return false;
  }
};
