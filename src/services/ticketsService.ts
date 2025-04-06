
import { supabase } from '@/services/supabase/supabaseClient';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';
import { Fixture } from '@/types/fixtures';
import { TicketType, Season, MatchTicketConfig, TicketSale } from '@/types/tickets';

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
export async function getFixturesWithTickets(): Promise<DbServiceResponse<Fixture[]>> {
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

/**
 * Get upcoming fixtures with ticket links
 */
export async function getUpcomingFixturesWithTickets(): Promise<DbServiceResponse<Fixture[]>> {
  return handleDbOperation(
    async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .not('ticket_link', 'is', null)
        .gte('date', today)
        .order('date', { ascending: true });

      if (error) throw error;
      return data;
    },
    'Failed to get upcoming fixtures with tickets'
  );
}

/**
 * Remove ticket link from a fixture
 */
export async function removeTicketLink(fixtureId: string): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('fixtures')
        .update({ ticket_link: null })
        .eq('id', fixtureId);

      if (error) throw error;
      return true;
    },
    'Failed to remove ticket link'
  );
}

/**
 * Get sales summary statistics
 * This is a placeholder that would connect to actual ticket sales data in the future
 */
export async function getTicketSalesStats(): Promise<DbServiceResponse<any>> {
  return handleDbOperation(
    async () => {
      // This would be replaced with actual database queries when ticket sales tables are implemented
      return {
        totalRevenue: 32450,
        ticketsSold: 1827,
        seasonTickets: 267,
        onlinePercentage: 72
      };
    },
    'Failed to get ticket sales stats'
  );
}
