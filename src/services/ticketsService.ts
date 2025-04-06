
import { supabase } from '@/integrations/supabase/client';
import { Fixture, convertToMatches } from '@/types/fixtures';

/**
 * Get all fixtures with ticket links
 */
export const getFixturesWithTickets = async () => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .not('ticket_link', 'is', null)
      .order('date', { ascending: true });

    if (error) throw error;

    return {
      data: convertToMatches(data),
      error: null
    };
  } catch (error) {
    console.error('Error fetching fixtures with tickets:', error);
    return {
      data: null,
      error
    };
  }
};

/**
 * Update ticket link for a fixture
 */
export const updateTicketLink = async (fixtureId: string, link: string) => {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .update({ ticket_link: link })
      .eq('id', fixtureId)
      .select()
      .single();

    if (error) throw error;

    return {
      data: convertToMatches([data])[0],
      error: null
    };
  } catch (error) {
    console.error('Error updating ticket link:', error);
    return {
      data: null,
      error
    };
  }
};

/**
 * Delete ticket link from a fixture
 */
export const removeTicketLink = async (fixtureId: string) => {
  try {
    const { error } = await supabase
      .from('fixtures')
      .update({ ticket_link: null })
      .eq('id', fixtureId);

    if (error) throw error;

    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error removing ticket link:', error);
    return {
      success: false,
      error
    };
  }
};

export default {
  getFixturesWithTickets,
  updateTicketLink,
  removeTicketLink
};
