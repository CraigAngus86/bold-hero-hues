
import { supabase } from '@/services/supabase/supabaseClient';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';
import { Sponsor } from '@/types/sponsors';

/**
 * Fetch all sponsors
 */
export async function fetchSponsors(): Promise<DbServiceResponse<Sponsor[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('tier', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Sponsor[] || [];
    },
    'Failed to fetch sponsors'
  );
}

/**
 * Fetch a sponsor by id
 */
export async function fetchSponsorById(id: string): Promise<DbServiceResponse<Sponsor>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Sponsor;
    },
    `Failed to fetch sponsor with id ${id}`
  );
}

/**
 * Create a sponsor
 */
export async function createSponsor(sponsor: Omit<Sponsor, 'id'>): Promise<DbServiceResponse<Sponsor>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .insert(sponsor)
        .select()
        .single();

      if (error) throw error;
      return data as Sponsor;
    },
    'Failed to create sponsor'
  );
}

/**
 * Update a sponsor
 */
export async function updateSponsor(id: string, sponsor: Partial<Sponsor>): Promise<DbServiceResponse<Sponsor>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .update(sponsor)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Sponsor;
    },
    `Failed to update sponsor with id ${id}`
  );
}

/**
 * Delete a sponsor
 */
export async function deleteSponsor(id: string): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    `Failed to delete sponsor with id ${id}`
  );
}

/**
 * Fetch sponsors by tier
 */
export async function fetchSponsorsByTier(tier: string): Promise<DbServiceResponse<Sponsor[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('tier', tier)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Sponsor[] || [];
    },
    `Failed to fetch sponsors with tier ${tier}`
  );
}

// New function to directly return all sponsors (for admin management)
export async function getAllSponsors(): Promise<DbServiceResponse<Sponsor[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('tier', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Sponsor[] || [];
    },
    'Failed to fetch all sponsors'
  );
}
