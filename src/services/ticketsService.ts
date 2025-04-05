
import { supabase } from '@/services/supabase/supabaseClient';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';

/**
 * Add or update ticket link for a fixture
 */
export async function updateTicketLink(
  fixtureId: string, 
  ticketLink: string
): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('fixtures')
        .update({ ticket_link: ticketLink })
        .eq('id', fixtureId);

      if (error) throw error;
      return true;
    },
    'Failed to update ticket link'
  );
}

/**
 * Get ticket link for a fixture
 */
export async function getTicketLink(
  fixtureId: string
): Promise<DbServiceResponse<string | null>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('fixtures')
        .select('ticket_link')
        .eq('id', fixtureId)
        .single();

      if (error) throw error;
      return data?.ticket_link || null;
    },
    'Failed to get ticket link'
  );
}

/**
 * Check if tickets are available for a fixture
 */
export async function hasTicketsAvailable(
  fixtureId: string
): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('fixtures')
        .select('ticket_link')
        .eq('id', fixtureId)
        .single();

      if (error) throw error;
      return !!data?.ticket_link;
    },
    'Failed to check ticket availability'
  );
}

/**
 * Get all fixtures with ticket links
 */
export async function getFixturesWithTickets(): Promise<DbServiceResponse<any[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .not('ticket_link', 'is', null)
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },
    'Failed to get fixtures with tickets'
  );
}
