
import { supabase } from '@/services/supabase/supabaseClient';
import { Match } from '@/components/fixtures/types';
import { SupabaseMatch, convertToSupabaseFormat } from './types';
import { toast } from 'sonner';

// Add a new match to Supabase
export const addMatchToSupabase = async (match: Partial<Match>): Promise<string | null> => {
  try {
    const supabaseMatch = convertToSupabaseFormat(match);
    
    // Ensure all required fields are present
    if (!supabaseMatch.home_team || !supabaseMatch.away_team || 
        !supabaseMatch.date || !supabaseMatch.time || 
        !supabaseMatch.competition || !supabaseMatch.venue) {
      console.error('Missing required fields for match');
      toast.error('Missing required fields for match');
      return null;
    }
    
    // Define the required fields explicitly for type safety
    const matchToInsert = {
      home_team: supabaseMatch.home_team,
      away_team: supabaseMatch.away_team,
      date: supabaseMatch.date,
      time: supabaseMatch.time,
      competition: supabaseMatch.competition,
      venue: supabaseMatch.venue,
      is_completed: supabaseMatch.is_completed || false,
      status: supabaseMatch.status || 'upcoming',
      visible: true
    };
    
    // If the match is completed, add scores
    if (supabaseMatch.is_completed && 
        supabaseMatch.home_score !== undefined && 
        supabaseMatch.away_score !== undefined) {
      Object.assign(matchToInsert, {
        home_score: supabaseMatch.home_score,
        away_score: supabaseMatch.away_score
      });
    }

    // Insert as an array for type safety
    const { data, error } = await supabase
      .from('matches')
      .insert([matchToInsert])
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
