
import { supabase } from '@/services/supabase/supabaseClient';
import { Fixture, DBFixture, convertToMatches } from '@/types/fixtures';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';

/**
 * Get all fixtures with optional filtering
 */
export async function getAllFixtures(options?: {
  season?: string;
  competition?: string;
}): Promise<DbServiceResponse<Fixture[]>> {
  return handleDbOperation(
    async () => {
      let query = supabase
        .from('fixtures')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      // Apply optional filters
      if (options?.season) {
        query = query.eq('season', options.season);
      }
      
      if (options?.competition) {
        query = query.eq('competition', options.competition);
      }

      const { data, error } = await query;

      if (error) throw error;

      return convertToMatches(data as DBFixture[]);
    },
    'Failed to load fixtures'
  );
}

/**
 * Get upcoming fixtures
 */
export async function getUpcomingFixtures(limit = 5): Promise<DbServiceResponse<Fixture[]>> {
  return handleDbOperation(
    async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .gte('date', today)
        .eq('is_completed', false)
        .order('date', { ascending: true })
        .order('time', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return convertToMatches(data as DBFixture[]);
    },
    'Failed to load upcoming fixtures'
  );
}

/**
 * Get completed fixtures (results)
 */
export async function getResults(limit = 5): Promise<DbServiceResponse<Fixture[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .eq('is_completed', true)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return convertToMatches(data as DBFixture[]);
    },
    'Failed to load results'
  );
}

/**
 * Get fixture by ID
 */
export async function getFixtureById(id: string): Promise<DbServiceResponse<Fixture>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const fixtures = convertToMatches([data as DBFixture]);
      return fixtures[0];
    },
    `Failed to load fixture details for ID: ${id}`
  );
}

/**
 * Create a new fixture
 */
export async function createFixture(fixtureData: Omit<DBFixture, 'id' | 'created_at' | 'updated_at'>): Promise<DbServiceResponse<Fixture>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('fixtures')
        .insert([fixtureData])
        .select()
        .single();

      if (error) throw error;

      const fixtures = convertToMatches([data as DBFixture]);
      return fixtures[0];
    },
    'Failed to create fixture'
  );
}

/**
 * Update fixture
 */
export async function updateFixture(id: string, updates: Partial<DBFixture>): Promise<DbServiceResponse<Fixture>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('fixtures')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const fixtures = convertToMatches([data as DBFixture]);
      return fixtures[0];
    },
    'Failed to update fixture'
  );
}

/**
 * Add ticket link to fixture
 */
export async function addTicketLinkToFixture(id: string, ticketLink: string): Promise<DbServiceResponse<Fixture>> {
  return updateFixture(id, { ticket_link: ticketLink });
}

/**
 * Update fixture result
 */
export async function updateFixtureResult(
  id: string, 
  homeScore: number, 
  awayScore: number
): Promise<DbServiceResponse<Fixture>> {
  return updateFixture(id, { 
    home_score: homeScore, 
    away_score: awayScore,
    is_completed: true 
  });
}

/**
 * Delete fixture
 */
export async function deleteFixture(id: string): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('fixtures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    'Failed to delete fixture'
  );
}

/**
 * Get unique competitions
 */
export async function getCompetitions(): Promise<DbServiceResponse<string[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('fixtures')
        .select('competition');

      if (error) throw error;

      const competitions = [...new Set(data.map(item => item.competition))];
      return competitions;
    },
    'Failed to load competitions'
  );
}

/**
 * Get unique seasons
 */
export async function getSeasons(): Promise<DbServiceResponse<string[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('fixtures')
        .select('season');

      if (error) throw error;

      const seasons = [...new Set(data.map(item => item.season).filter(Boolean))];
      return seasons as string[];
    },
    'Failed to load seasons'
  );
}
