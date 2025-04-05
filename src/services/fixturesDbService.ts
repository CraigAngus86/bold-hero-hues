
import { supabase } from '@/integrations/supabase/client';
import { Fixture, DBFixture, convertToMatches } from '@/types/fixtures';
import { toast } from 'sonner';

/**
 * Get all fixtures with optional filtering
 */
export async function getAllFixtures(options?: {
  season?: string;
  competition?: string;
  upcoming?: boolean;
  limit?: number;
}): Promise<Fixture[]> {
  try {
    let query = supabase
      .from('fixtures')
      .select('*');

    // Apply optional filters
    if (options?.season) {
      query = query.eq('season', options.season);
    }
    
    if (options?.competition) {
      query = query.eq('competition', options.competition);
    }
    
    if (options?.upcoming !== undefined) {
      const today = new Date().toISOString().split('T')[0];
      if (options.upcoming) {
        query = query
          .gte('date', today)
          .eq('is_completed', false)
          .order('date', { ascending: true });
      } else {
        query = query
          .eq('is_completed', true)
          .order('date', { ascending: false });
      }
    } else {
      query = query.order('date', { ascending: true });
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return convertToMatches(data as DBFixture[]);
  } catch (error) {
    console.error('Failed to load fixtures:', error);
    toast.error('Failed to load fixtures data');
    return [];
  }
}

/**
 * Get upcoming fixtures
 */
export async function getUpcomingFixtures(limit = 5): Promise<Fixture[]> {
  return getAllFixtures({ upcoming: true, limit });
}

/**
 * Get completed fixtures (results)
 */
export async function getResults(limit = 5): Promise<Fixture[]> {
  return getAllFixtures({ upcoming: false, limit });
}

/**
 * Get fixture by ID
 */
export async function getFixtureById(id: string): Promise<Fixture | null> {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    const fixtures = convertToMatches([data as DBFixture]);
    return fixtures[0];
  } catch (error) {
    console.error(`Failed to load fixture details for ID: ${id}`, error);
    toast.error('Failed to load fixture details');
    return null;
  }
}

/**
 * Create a new fixture
 */
export async function createFixture(fixtureData: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('fixtures')
      .insert([fixtureData]);

    if (error) throw error;
    
    toast.success('Fixture created successfully');
    return true;
  } catch (error) {
    console.error('Failed to create fixture:', error);
    toast.error('Failed to create fixture');
    return false;
  }
}

/**
 * Update fixture
 */
export async function updateFixture(id: string, updates: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('fixtures')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    
    toast.success('Fixture updated successfully');
    return true;
  } catch (error) {
    console.error('Failed to update fixture:', error);
    toast.error('Failed to update fixture');
    return false;
  }
}

/**
 * Add ticket link to fixture
 */
export async function addTicketLinkToFixture(id: string, ticketLink: string): Promise<boolean> {
  return updateFixture(id, { ticket_link: ticketLink });
}

/**
 * Update fixture result
 */
export async function updateFixtureResult(
  id: string, 
  homeScore: number, 
  awayScore: number
): Promise<boolean> {
  return updateFixture(id, { 
    home_score: homeScore, 
    away_score: awayScore,
    is_completed: true 
  });
}

/**
 * Delete fixture
 */
export async function deleteFixture(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('fixtures')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    toast.success('Fixture deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete fixture:', error);
    toast.error('Failed to delete fixture');
    return false;
  }
}

/**
 * Get unique competitions
 */
export async function getCompetitions(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('competition');

    if (error) throw error;

    const competitions = [...new Set(data.map(item => item.competition))];
    return competitions;
  } catch (error) {
    console.error('Failed to load competitions:', error);
    toast.error('Failed to load competitions');
    return [];
  }
}

/**
 * Get unique venues
 */
export async function getVenues(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('venue')
      .not('venue', 'is', null);

    if (error) throw error;

    const venues = [...new Set(data.map(item => item.venue).filter(Boolean))];
    return venues as string[];
  } catch (error) {
    console.error('Failed to load venues:', error);
    toast.error('Failed to load venues');
    return [];
  }
}

/**
 * Get unique seasons
 */
export async function getSeasons(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('season')
      .not('season', 'is', null);

    if (error) throw error;

    const seasons = [...new Set(data.map(item => item.season).filter(Boolean))];
    return seasons as string[];
  } catch (error) {
    console.error('Failed to load seasons:', error);
    toast.error('Failed to load seasons');
    return ['2024-2025', '2023-2024']; // Fallback values
  }
}
