
import { supabase } from '@/services/supabase/supabaseClient';

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
export const fetchUniqueCompetitions = async (): Promise<string[]> => {
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
