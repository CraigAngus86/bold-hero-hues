
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
      match.venue
    );
    
    if (validMatches.length === 0) {
      toast.error('No valid matches to import');
      return false;
    }
    
    // Convert to Supabase format with all required fields
    // Create an array of objects with explicitly defined required fields
    const supabaseMatches = validMatches.map(match => ({
      home_team: match.homeTeam,
      away_team: match.awayTeam,
      date: match.date,
      time: match.time,
      competition: match.competition,
      venue: match.venue,
      is_completed: match.isCompleted || false,
      home_score: match.isCompleted ? match.homeScore : null,
      away_score: match.isCompleted ? match.awayScore : null,
      status: match.isCompleted ? 'completed' : 'upcoming',
      visible: true
    }));
    
    const { error } = await supabase
      .from('matches')
      .insert(supabaseMatches);

    if (error) {
      console.error('Error importing mock data to Supabase:', error);
      toast.error(`Failed to import mock data: ${error.message}`);
      return false;
    }

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
    
    if (!result.success || !result.data) {
      toast.error(result.error || 'Failed to fetch fixtures');
      return false;
    }
    
    // Add a temporary ID to each fixture for the importMockDataToSupabase function
    const fixturesWithIds = result.data.map((fixture, index) => ({
      ...fixture,
      id: `temp-${index}` // Temporary ID, will be replaced by UUID in Supabase
    }));
    
    // Clear existing data first
    const { error: deleteError } = await supabase
      .from('matches')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
      
    if (deleteError) {
      console.error('Error clearing existing matches:', deleteError);
      toast.error(`Failed to clear existing data: ${deleteError.message}`);
      return false;
    }
    
    return await importMockDataToSupabase(fixturesWithIds);
  } catch (error) {
    console.error('Error in scrapeAndStoreFixtures:', error);
    toast.error('Failed to fetch and store fixtures data');
    return false;
  }
};
