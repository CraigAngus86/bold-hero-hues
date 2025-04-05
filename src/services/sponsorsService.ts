
import { supabase } from '@/services/supabase/supabaseClient';
import { Sponsor as SponsorType } from '@/types/sponsors';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';

// Use a different name to avoid conflict with imported type
export type DBSponsor = {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  description?: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
};

/**
 * Get all sponsors
 */
export async function getAllSponsors(): Promise<DbServiceResponse<SponsorType[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('name');

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const sponsors: SponsorType[] = data.map(item => ({
        id: parseInt(item.id),
        name: item.name,
        logoUrl: item.logo_url,
        website: item.website_url,
        tier: item.tier,
        description: item.description
      }));

      return sponsors;
    },
    'Failed to load sponsors'
  );
}

/**
 * Get sponsors by tier
 */
export async function getSponsorsByTier(tier: 'platinum' | 'gold' | 'silver' | 'bronze'): Promise<DbServiceResponse<SponsorType[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('tier', tier)
        .order('name');

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const sponsors: SponsorType[] = data.map(item => ({
        id: parseInt(item.id),
        name: item.name,
        logoUrl: item.logo_url,
        website: item.website_url,
        tier: item.tier,
        description: item.description
      }));

      return sponsors;
    },
    `Failed to load ${tier} sponsors`
  );
}

/**
 * Get active sponsors
 */
export async function getActiveSponsors(): Promise<DbServiceResponse<SponsorType[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const sponsors: SponsorType[] = data.map(item => ({
        id: parseInt(item.id),
        name: item.name,
        logoUrl: item.logo_url,
        website: item.website_url,
        tier: item.tier,
        description: item.description
      }));

      return sponsors;
    },
    'Failed to load active sponsors'
  );
}

/**
 * Get sponsor by ID
 */
export async function getSponsorById(id: string): Promise<DbServiceResponse<SponsorType>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const sponsor: SponsorType = {
        id: parseInt(data.id),
        name: data.name,
        logoUrl: data.logo_url,
        website: data.website_url,
        tier: data.tier,
        description: data.description
      };

      return sponsor;
    },
    'Failed to load sponsor details'
  );
}

/**
 * Create sponsor
 */
export async function createSponsor(sponsor: Omit<DBSponsor, 'id' | 'created_at' | 'updated_at'>): Promise<DbServiceResponse<SponsorType>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .insert([sponsor])
        .select()
        .single();

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const newSponsor: SponsorType = {
        id: parseInt(data.id),
        name: data.name,
        logoUrl: data.logo_url,
        website: data.website_url,
        tier: data.tier,
        description: data.description
      };

      return newSponsor;
    },
    'Failed to create sponsor'
  );
}

/**
 * Update sponsor
 */
export async function updateSponsor(id: string, updates: Partial<DBSponsor>): Promise<DbServiceResponse<SponsorType>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const sponsor: SponsorType = {
        id: parseInt(data.id),
        name: data.name,
        logoUrl: data.logo_url,
        website: data.website_url,
        tier: data.tier,
        description: data.description
      };

      return sponsor;
    },
    'Failed to update sponsor'
  );
}

/**
 * Toggle sponsor active status
 */
export async function toggleSponsorStatus(id: string, isActive: boolean): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('sponsors')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      return true;
    },
    'Failed to update sponsor status'
  );
}

/**
 * Delete sponsor
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
    'Failed to delete sponsor'
  );
}

/**
 * Get all sponsor tiers
 */
export async function getSponsorTiers(): Promise<DbServiceResponse<string[]>> {
  return handleDbOperation(
    async () => {
      return ['platinum', 'gold', 'silver', 'bronze'];
    },
    'Failed to load sponsor tiers'
  );
}

// Create a function to convert Sponsor to DBSponsor
export function convertToDBSponsor(sponsor: SponsorType): Partial<DBSponsor> {
  return {
    name: sponsor.name,
    logo_url: sponsor.logoUrl,
    website_url: sponsor.website,
    tier: sponsor.tier,
    description: sponsor.description,
    is_active: true
  };
}
