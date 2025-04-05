import { supabase } from '@/services/supabase/supabaseClient';
import { Sponsor, DBSponsor, convertToSponsor } from '@/types/sponsors';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';
import { create } from 'zustand';

/**
 * Get all sponsors
 */
export async function getAllSponsors(): Promise<DbServiceResponse<Sponsor[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('name');

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const sponsors: Sponsor[] = data.map(item => convertToSponsor(item as DBSponsor));

      return sponsors;
    },
    'Failed to load sponsors'
  );
}

/**
 * Get sponsors by tier
 */
export async function getSponsorsByTier(tier: 'platinum' | 'gold' | 'silver' | 'bronze'): Promise<DbServiceResponse<Sponsor[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('tier', tier)
        .order('name');

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const sponsors: Sponsor[] = data.map(item => convertToSponsor(item as DBSponsor));

      return sponsors;
    },
    `Failed to load ${tier} sponsors`
  );
}

/**
 * Get active sponsors
 */
export async function getActiveSponsors(): Promise<DbServiceResponse<Sponsor[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const sponsors: Sponsor[] = data.map(item => convertToSponsor(item as DBSponsor));

      return sponsors;
    },
    'Failed to load active sponsors'
  );
}

/**
 * Get sponsor by ID
 */
export async function getSponsorById(id: string): Promise<DbServiceResponse<Sponsor>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const sponsor: Sponsor = {
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
export async function createSponsor(sponsor: Omit<DBSponsor, 'id' | 'created_at' | 'updated_at'>): Promise<DbServiceResponse<Sponsor>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .insert([sponsor])
        .select()
        .single();

      if (error) throw error;

      // Convert from DB format to the Sponsor type defined in types/sponsors.ts
      const newSponsor: Sponsor = {
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
export async function updateSponsor(id: string, updates: Partial<DBSponsor>): Promise<DbServiceResponse<Sponsor>> {
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
      const sponsor: Sponsor = {
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
export function convertToDBSponsor(sponsor: Sponsor): Partial<DBSponsor> {
  return {
    name: sponsor.name,
    logo_url: sponsor.logoUrl,
    website_url: sponsor.website,
    tier: sponsor.tier,
    description: sponsor.description,
    is_active: true
  };
}

// Create a Zustand store for sponsors
interface SponsorsState {
  sponsors: Sponsor[];
  loading: boolean;
  error: Error | null;
  fetchSponsors: () => Promise<void>;
  addSponsor: (sponsor: Sponsor) => void;
  updateSponsor: (sponsor: Sponsor) => void;
  deleteSponsor: (id: number) => void;
}

export const useSponsorsStore = create<SponsorsState>((set, get) => ({
  sponsors: [],
  loading: false,
  error: null,
  fetchSponsors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getActiveSponsors();
      if (response.success) {
        set({ sponsors: response.data || [] });
      } else {
        set({ error: new Error(response.message || 'Failed to fetch sponsors') });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Unknown error') });
    } finally {
      set({ loading: false });
    }
  },
  addSponsor: (sponsor: Sponsor) => {
    const { sponsors } = get();
    set({ sponsors: [...sponsors, sponsor] });
  },
  updateSponsor: (sponsor: Sponsor) => {
    const { sponsors } = get();
    set({
      sponsors: sponsors.map(s => s.id === sponsor.id ? sponsor : s)
    });
  },
  deleteSponsor: (id: number) => {
    const { sponsors } = get();
    set({
      sponsors: sponsors.filter(s => s.id !== id)
    });
  }
}));

// Export Sponsor type to be used in components that import from this file
export type { Sponsor };
