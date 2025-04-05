
import { supabase } from '@/services/supabase/supabaseClient';
import { DBFixture, Fixture, convertToMatches } from '@/types/fixtures';
import { showErrorToUser } from '@/utils/errorHandling';

/**
 * Get all fixtures
 */
export async function getAllFixtures(): Promise<Fixture[]> {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;

    return convertToMatches(data as DBFixture[]);
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    showErrorToUser(error, 'Failed to load fixtures');
    return [];
  }
}

/**
 * Get upcoming fixtures
 */
export async function getUpcomingFixtures(limit = 5): Promise<Fixture[]> {
  try {
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
  } catch (error) {
    console.error('Error fetching upcoming fixtures:', error);
    showErrorToUser(error, 'Failed to load upcoming fixtures');
    return [];
  }
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
    return fixtures.length > 0 ? fixtures[0] : null;
  } catch (error) {
    console.error('Error fetching fixture:', error);
    showErrorToUser(error, 'Failed to load fixture details');
    return null;
  }
}

/**
 * Update fixture
 */
export async function updateFixture(id: string, updates: Partial<DBFixture>): Promise<Fixture | null> {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const fixtures = convertToMatches([data as DBFixture]);
    return fixtures.length > 0 ? fixtures[0] : null;
  } catch (error) {
    console.error('Error updating fixture:', error);
    showErrorToUser(error, 'Failed to update fixture');
    return null;
  }
}

/**
 * Add ticket link to fixture
 */
export async function addTicketLinkToFixture(id: string, ticketLink: string): Promise<Fixture | null> {
  return updateFixture(id, { ticket_link: ticketLink });
}
