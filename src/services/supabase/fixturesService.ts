
import { supabase } from '@/services/supabase/supabaseClient';
import { Match } from '@/components/fixtures/types';
import { toast } from 'sonner';

export interface SupabaseMatch {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  competition: string;
  venue: string;
  is_completed: boolean;
  home_score?: number | null;
  away_score?: number | null;
  status: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// Convert Supabase match to our frontend Match format
export const convertToMatchFormat = (match: SupabaseMatch): Match => {
  return {
    id: match.id,
    homeTeam: match.home_team,
    awayTeam: match.away_team,
    date: match.date,
    time: match.time,
    competition: match.competition,
    venue: match.venue,
    isCompleted: match.is_completed,
    homeScore: match.home_score || 0,
    awayScore: match.away_score || 0
  };
};

// Convert frontend Match to Supabase format for single match
export const convertToSupabaseFormat = (match: Partial<Match>): Partial<SupabaseMatch> => {
  // Make sure required fields are present
  if (!match.homeTeam || !match.awayTeam || !match.date || !match.time || !match.competition || !match.venue) {
    console.error('Missing required fields for match conversion');
    throw new Error('Missing required fields for match conversion');
  }

  const supabaseMatch: Partial<SupabaseMatch> = {
    home_team: match.homeTeam,
    away_team: match.awayTeam,
    date: match.date,
    time: match.time,
    competition: match.competition,
    venue: match.venue,
    is_completed: match.isCompleted || false,
    status: match.isCompleted ? 'completed' : 'upcoming'
  };

  if (match.isCompleted && match.homeScore !== undefined && match.awayScore !== undefined) {
    supabaseMatch.home_score = match.homeScore;
    supabaseMatch.away_score = match.awayScore;
  }

  return supabaseMatch;
};

// Fetch all matches from Supabase
export const fetchMatchesFromSupabase = async (): Promise<Match[]> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('visible', true)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching matches from Supabase:', error);
      throw new Error(`Failed to fetch matches: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('No matches found in Supabase');
      return [];
    }

    return data.map(convertToMatchFormat);
  } catch (error) {
    console.error('Error in fetchMatchesFromSupabase:', error);
    toast.error('Failed to load matches from the database');
    return [];
  }
};

// Fetch all fixtures (upcoming matches)
export const fetchFixturesFromSupabase = async (): Promise<Match[]> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('is_completed', false)
      .eq('visible', true)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching fixtures from Supabase:', error);
      throw new Error(`Failed to fetch fixtures: ${error.message}`);
    }

    return (data || []).map(convertToMatchFormat);
  } catch (error) {
    console.error('Error in fetchFixturesFromSupabase:', error);
    toast.error('Failed to load fixtures from the database');
    return [];
  }
};

// Fetch all results (completed matches)
export const fetchResultsFromSupabase = async (): Promise<Match[]> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('is_completed', true)
      .eq('visible', true)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching results from Supabase:', error);
      throw new Error(`Failed to fetch results: ${error.message}`);
    }

    return (data || []).map(convertToMatchFormat);
  } catch (error) {
    console.error('Error in fetchResultsFromSupabase:', error);
    toast.error('Failed to load results from the database');
    return [];
  }
};

// Add a new match to Supabase
export const addMatchToSupabase = async (match: Partial<Match>): Promise<string | null> => {
  try {
    const supabaseMatch = convertToSupabaseFormat(match);
    
    const { data, error } = await supabase
      .from('matches')
      .insert(supabaseMatch)
      .select();

    if (error) {
      console.error('Error adding match to Supabase:', error);
      toast.error(`Failed to add match: ${error.message}`);
      return null;
    }

    toast.success('Match added successfully');
    return data && data[0] ? data[0].id : null;
  } catch (error) {
    console.error('Error in addMatchToSupabase:', error);
    toast.error('Failed to add match to the database');
    return null;
  }
};

// Update an existing match in Supabase
export const updateMatchInSupabase = async (id: string, match: Partial<Match>): Promise<boolean> => {
  try {
    // For update, we don't need to enforce all required fields since we're updating
    // specific fields of an existing record
    const supabaseMatch: Partial<SupabaseMatch> = {};
    
    if (match.homeTeam) supabaseMatch.home_team = match.homeTeam;
    if (match.awayTeam) supabaseMatch.away_team = match.awayTeam;
    if (match.date) supabaseMatch.date = match.date;
    if (match.time) supabaseMatch.time = match.time;
    if (match.competition) supabaseMatch.competition = match.competition;
    if (match.venue) supabaseMatch.venue = match.venue;
    if (match.isCompleted !== undefined) {
      supabaseMatch.is_completed = match.isCompleted;
      supabaseMatch.status = match.isCompleted ? 'completed' : 'upcoming';
    }
    
    if (match.isCompleted && match.homeScore !== undefined && match.awayScore !== undefined) {
      supabaseMatch.home_score = match.homeScore;
      supabaseMatch.away_score = match.awayScore;
    }
    
    // Update the updated_at field
    supabaseMatch.updated_at = new Date().toISOString();
    
    const { error } = await supabase
      .from('matches')
      .update(supabaseMatch)
      .eq('id', id);

    if (error) {
      console.error('Error updating match in Supabase:', error);
      toast.error(`Failed to update match: ${error.message}`);
      return false;
    }

    toast.success('Match updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateMatchInSupabase:', error);
    toast.error('Failed to update match in the database');
    return false;
  }
};

// Delete a match from Supabase
export const deleteMatchFromSupabase = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting match from Supabase:', error);
      toast.error(`Failed to delete match: ${error.message}`);
      return false;
    }

    toast.success('Match deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteMatchFromSupabase:', error);
    toast.error('Failed to delete match from the database');
    return false;
  }
};

// Toggle match visibility
export const toggleMatchVisibility = async (id: string, visible: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('matches')
      .update({ visible, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error toggling match visibility in Supabase:', error);
      toast.error(`Failed to update match visibility: ${error.message}`);
      return false;
    }

    toast.success(`Match ${visible ? 'shown' : 'hidden'} successfully`);
    return true;
  } catch (error) {
    console.error('Error in toggleMatchVisibility:', error);
    toast.error('Failed to update match visibility');
    return false;
  }
};

// Update match score and set as completed
export const updateMatchScore = async (
  id: string, 
  homeScore: number, 
  awayScore: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('matches')
      .update({ 
        home_score: homeScore, 
        away_score: awayScore, 
        is_completed: true,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating match score in Supabase:', error);
      toast.error(`Failed to update match score: ${error.message}`);
      return false;
    }

    toast.success('Match score updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateMatchScore:', error);
    toast.error('Failed to update match score');
    return false;
  }
};

// Fetch competitions
export const fetchCompetitionsFromSupabase = async (): Promise<string[]> => {
  try {
    // First try to get from the competitions table
    const { data, error } = await supabase
      .from('competitions')
      .select('name')
      .eq('active', true)
      .order('name');

    if (error) {
      console.error('Error fetching competitions from Supabase:', error);
      // Fall back to getting unique values from matches
      return fetchUniqueCompetitions();
    }

    if (data && data.length > 0) {
      return data.map(comp => comp.name);
    } else {
      // If competitions table is empty, get distinct values from matches
      return fetchUniqueCompetitions();
    }
  } catch (error) {
    console.error('Error in fetchCompetitionsFromSupabase:', error);
    return fetchUniqueCompetitions();
  }
};

// Helper to fetch unique competitions from matches table
const fetchUniqueCompetitions = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('competition');

    if (error) {
      console.error('Error fetching unique competitions:', error);
      return [];
    }

    // Extract unique competition names
    const uniqueCompetitions = [...new Set(data.map(match => match.competition))];
    return uniqueCompetitions.sort();
  } catch (error) {
    console.error('Error in fetchUniqueCompetitions:', error);
    return [];
  }
};

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
    const supabaseMatches = validMatches.map(match => ({
      home_team: match.homeTeam,
      away_team: match.awayTeam,
      date: match.date,
      time: match.time,
      competition: match.competition,
      venue: match.venue,
      is_completed: match.isCompleted || false,
      home_score: match.homeScore,
      away_score: match.awayScore,
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

    toast.success('Mock data imported successfully');
    return true;
  } catch (error) {
    console.error('Error in importMockDataToSupabase:', error);
    toast.error('Failed to import mock data');
    return false;
  }
};

// Scrape fixtures and results and store in Supabase
export const scrapeAndStoreFixtures = async (): Promise<boolean> => {
  try {
    toast.info("Scraping fixtures and results data...");
    
    // This would normally call an edge function or API to scrape data
    // For now, let's simulate by importing mock data
    const { mockMatches } = await import('@/components/fixtures/fixturesMockData');
    
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
    
    return await importMockDataToSupabase(mockMatches);
  } catch (error) {
    console.error('Error in scrapeAndStoreFixtures:', error);
    toast.error('Failed to scrape and store fixtures data');
    return false;
  }
};
