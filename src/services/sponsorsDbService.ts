
import { supabase } from '@/services/supabase/supabaseClient';
import { DBSponsor, Sponsor, convertToSponsor } from '@/types/sponsors';
import { showErrorToUser } from '@/utils/errorHandling';

/**
 * Get all sponsors
 */
export async function getAllSponsors(): Promise<Sponsor[]> {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('is_active', true)
      .order('tier', { ascending: false });

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
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('tier', tier)
      .eq('is_active', true)
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
 * Get sponsor by ID
 */
export async function getSponsorById(id: string): Promise<Sponsor | null> {
  try {
    const { data, error } = await supabase
      .from('sponsors')
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
    const { data, error } = await supabase
      .from('sponsors')
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
    const { data, error } = await supabase
      .from('sponsors')
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
 * Delete sponsor (soft delete by setting is_active to false)
 */
export async function deleteSponsor(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sponsors')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    showErrorToUser(error, 'Failed to delete sponsor');
    return false;
  }
}

/**
 * Permanently delete sponsor
 */
export async function permanentlyDeleteSponsor(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error permanently deleting sponsor:', error);
    showErrorToUser(error, 'Failed to permanently delete sponsor');
    return false;
  }
}
