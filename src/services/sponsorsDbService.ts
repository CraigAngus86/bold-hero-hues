
import { supabase } from '@/services/supabase/supabaseClient';
import { DBSponsor, Sponsor, convertToSponsor } from '@/types';
import { showErrorToUser, createAppError, ErrorType } from '@/utils/errorHandling';

/**
 * Get all sponsors
 */
export async function getAllSponsors(): Promise<Sponsor[]> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('sponsors') as any)
      .select('*')
      .order('name');

    if (error) throw error;

    return (data as DBSponsor[]).map(convertToSponsor);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    showErrorToUser(error, 'Failed to load sponsors');
    return [];
  }
}

/**
 * Get sponsors by tier
 */
export async function getSponsorsByTier(tier: 'platinum' | 'gold' | 'silver' | 'bronze'): Promise<Sponsor[]> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('sponsors') as any)
      .select('*')
      .eq('tier', tier)
      .order('name');

    if (error) throw error;

    return (data as DBSponsor[]).map(convertToSponsor);
  } catch (error) {
    console.error(`Error fetching ${tier} sponsors:`, error);
    showErrorToUser(error, `Failed to load ${tier} sponsors`);
    return [];
  }
}

/**
 * Get active sponsors
 */
export async function getActiveSponsors(): Promise<Sponsor[]> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('sponsors') as any)
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return (data as DBSponsor[]).map(convertToSponsor);
  } catch (error) {
    console.error('Error fetching active sponsors:', error);
    showErrorToUser(error, 'Failed to load active sponsors');
    return [];
  }
}

/**
 * Get sponsor by ID
 */
export async function getSponsorById(id: string): Promise<Sponsor | null> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('sponsors') as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return convertToSponsor(data as DBSponsor);
  } catch (error) {
    console.error('Error fetching sponsor:', error);
    showErrorToUser(error, 'Failed to load sponsor details');
    return null;
  }
}

/**
 * Create sponsor
 */
export async function createSponsor(sponsor: Omit<DBSponsor, 'id' | 'created_at' | 'updated_at'>): Promise<Sponsor | null> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('sponsors') as any)
      .insert([sponsor])
      .select()
      .single();

    if (error) throw error;

    return convertToSponsor(data as DBSponsor);
  } catch (error) {
    console.error('Error creating sponsor:', error);
    showErrorToUser(error, 'Failed to create sponsor');
    return null;
  }
}

/**
 * Update sponsor
 */
export async function updateSponsor(id: string, updates: Partial<DBSponsor>): Promise<Sponsor | null> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { data, error } = await (supabase.from('sponsors') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return convertToSponsor(data as DBSponsor);
  } catch (error) {
    console.error('Error updating sponsor:', error);
    showErrorToUser(error, 'Failed to update sponsor');
    return null;
  }
}

/**
 * Toggle sponsor active status
 */
export async function toggleSponsorStatus(id: string, isActive: boolean): Promise<boolean> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { error } = await (supabase.from('sponsors') as any)
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error toggling sponsor status:', error);
    showErrorToUser(error, 'Failed to update sponsor status');
    return false;
  }
}

/**
 * Delete sponsor
 */
export async function deleteSponsor(id: string): Promise<boolean> {
  try {
    // Cast supabase.from to any to bypass type checking until Supabase types are updated
    const { error } = await (supabase.from('sponsors') as any)
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    showErrorToUser(error, 'Failed to delete sponsor');
    return false;
  }
}
