
import { supabase } from '@/services/supabase/supabaseClient';
import { Match } from '@/components/fixtures/types';
import { SupabaseMatch, convertToMatchFormat } from './types';
import { toast } from 'sonner';

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
