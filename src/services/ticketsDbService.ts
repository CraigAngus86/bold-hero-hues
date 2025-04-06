
import { supabase } from '@/integrations/supabase/client';
import { 
  TicketType, 
  Season, 
  SeasonTicket, 
  MatchTicketConfig,
  TicketSale,
  Season as SeasonType
} from '@/types/tickets';
import { Fixture } from '@/types/fixtures';
import { toast } from 'sonner';

// Ticket Types
export const fetchTicketTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('ticket_types')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as TicketType[]
    };
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    return {
      success: false,
      error,
      data: [] as TicketType[]
    };
  }
};

export const createTicketType = async (ticketData: Omit<TicketType, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('ticket_types')
      .insert(ticketData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as TicketType
    };
  } catch (error) {
    console.error('Error creating ticket type:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

export const updateTicketType = async (id: string, ticketData: Partial<TicketType>) => {
  try {
    const { data, error } = await supabase
      .from('ticket_types')
      .update(ticketData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as TicketType
    };
  } catch (error) {
    console.error('Error updating ticket type:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

export const deleteTicketType = async (id: string) => {
  try {
    const { error } = await supabase
      .from('ticket_types')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting ticket type:', error);
    return {
      success: false,
      error
    };
  }
};

// Seasons
export const fetchSeasons = async () => {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as SeasonType[]
    };
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return {
      success: false,
      error,
      data: [] as SeasonType[]
    };
  }
};

export const fetchActiveSeason = async () => {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('active', true)
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as SeasonType
    };
  } catch (error) {
    console.error('Error fetching active season:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

export const createSeason = async (seasonData: Omit<SeasonType, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // If this is set as active, deactivate all other seasons
    if (seasonData.active) {
      await supabase
        .from('seasons')
        .update({ active: false })
        .neq('id', 'temp'); // This will update all records since no id matches 'temp'
    }

    const { data, error } = await supabase
      .from('seasons')
      .insert(seasonData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as SeasonType
    };
  } catch (error) {
    console.error('Error creating season:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

// Season Tickets
export const fetchSeasonTickets = async (seasonId?: string) => {
  try {
    let query = supabase
      .from('season_tickets')
      .select('*, seasons(*)');

    if (seasonId) {
      query = query.eq('season_id', seasonId);
    }

    const { data, error } = await query.order('price', { ascending: true });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as (SeasonTicket & { seasons: SeasonType })[]
    };
  } catch (error) {
    console.error('Error fetching season tickets:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

export const createSeasonTicket = async (ticketData: Omit<SeasonTicket, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('season_tickets')
      .insert(ticketData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as SeasonTicket
    };
  } catch (error) {
    console.error('Error creating season ticket:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

// Match Ticket Configurations
export const fetchMatchTicketConfig = async (fixtureId: string) => {
  try {
    const { data, error } = await supabase
      .from('match_ticket_configs')
      .select('*')
      .eq('fixture_id', fixtureId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw error;
    }

    return {
      success: true,
      data: data as MatchTicketConfig
    };
  } catch (error) {
    console.error('Error fetching match ticket config:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

export const createOrUpdateMatchTicketConfig = async (
  fixtureId: string,
  configData: Omit<MatchTicketConfig, 'created_at' | 'updated_at'>
) => {
  try {
    // Check if config exists
    const { data: existing } = await supabase
      .from('match_ticket_configs')
      .select()
      .eq('fixture_id', fixtureId)
      .maybeSingle();

    let result;
    
    if (existing) {
      // Update
      result = await supabase
        .from('match_ticket_configs')
        .update(configData)
        .eq('fixture_id', fixtureId)
        .select()
        .single();
    } else {
      // Insert
      result = await supabase
        .from('match_ticket_configs')
        .insert(configData)
        .select()
        .single();
    }

    const { data, error } = result;
    
    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as MatchTicketConfig,
      isNew: !existing
    };
  } catch (error) {
    console.error('Error creating/updating match ticket config:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

// Ticket Sales
export const fetchTicketSales = async (params?: {
  fixtureId?: string;
  seasonId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    let query = supabase
      .from('ticket_sales')
      .select('*');

    if (params?.fixtureId) {
      query = query.eq('fixture_id', params.fixtureId);
    }

    if (params?.seasonId) {
      query = query.eq('season_id', params.seasonId);
    }

    if (params?.startDate) {
      query = query.gte('purchase_date', params.startDate);
    }

    if (params?.endDate) {
      query = query.lte('purchase_date', params.endDate);
    }

    const { data, error } = await query.order('purchase_date', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as TicketSale[]
    };
  } catch (error) {
    console.error('Error fetching ticket sales:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

export const createTicketSale = async (saleData: Omit<TicketSale, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('ticket_sales')
      .insert(saleData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as TicketSale
    };
  } catch (error) {
    console.error('Error creating ticket sale:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

// Season Ticket Holders
export const fetchSeasonTicketHolders = async (seasonId?: string) => {
  try {
    let query = supabase
      .from('season_ticket_holders')
      .select('*, season_tickets(*), seasons(*)');

    if (seasonId) {
      query = query.eq('season_id', seasonId);
    }

    const { data, error } = await query.order('last_name', { ascending: true });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching season ticket holders:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

// External Ticket Systems
export const fetchTicketSystems = async () => {
  try {
    const { data, error } = await supabase
      .from('ticket_systems')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching ticket systems:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

export const createTicketSystem = async (system: Omit<any, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('ticket_systems')
      .insert(system)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error creating ticket system:', error);
    return {
      success: false,
      error,
      data: null
    };
  }
};

// Sales Analysis
export const getSalesStats = async (params?: {
  startDate?: string;
  endDate?: string;
  seasonId?: string;
}) => {
  try {
    // Use Supabase stored procedure/function or complex query
    // For now, we'll fetch all sales and calculate stats on client side
    let query = supabase
      .from('ticket_sales')
      .select('*, fixtures(*), ticket_types(*)');

    if (params?.startDate) {
      query = query.gte('purchase_date', params.startDate);
    }

    if (params?.endDate) {
      query = query.lte('purchase_date', params.endDate);
    }

    if (params?.seasonId) {
      query = query.eq('season_id', params.seasonId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    return {
      success: false,
      error,
      data: []
    };
  }
};

// Utility to check if a fixture has tickets configured
export const hasTicketsConfigured = async (fixtureId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('match_ticket_configs')
      .select('fixture_id')
      .eq('fixture_id', fixtureId)
      .maybeSingle();

    if (error) {
      console.error('Error checking ticket configuration:', error);
      return false;
    }

    return !!data;
  } catch (e) {
    console.error('Exception checking ticket configuration:', e);
    return false;
  }
};

// Export all functions for use in components
export default {
  fetchTicketTypes,
  createTicketType,
  updateTicketType,
  deleteTicketType,
  fetchSeasons,
  fetchActiveSeason,
  createSeason,
  fetchSeasonTickets,
  createSeasonTicket,
  fetchMatchTicketConfig,
  createOrUpdateMatchTicketConfig,
  fetchTicketSales,
  createTicketSale,
  fetchSeasonTicketHolders,
  fetchTicketSystems,
  createTicketSystem,
  getSalesStats,
  hasTicketsConfigured
};
