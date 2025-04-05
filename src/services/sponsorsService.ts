import { supabase } from '@/services/supabase/supabaseClient';
import { DBSponsor, Sponsor, convertToSponsor } from '@/types';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';
import { create } from 'zustand';

export interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  website?: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  description?: string;
}

interface SponsorsState {
  sponsors: Sponsor[];
  isLoading: boolean;
  error: string | null;
  fetchSponsors: () => Promise<void>;
  addSponsor: (sponsor: Sponsor) => void;
  updateSponsor: (sponsor: Sponsor) => void;
  deleteSponsor: (id: number) => void;
}

export const useSponsorsStore = create<SponsorsState>((set) => ({
  sponsors: [
    {
      id: 1,
      name: 'McIntosh Plant Hire',
      logoUrl: '/lovable-uploads/sponsors/mcintosh.png',
      website: 'https://www.mcintoshplanthire.co.uk/',
      tier: 'gold'
    },
    {
      id: 2,
      name: 'Texo Group',
      logoUrl: '/lovable-uploads/sponsors/texo.png',
      website: 'https://www.texo.co.uk/',
      tier: 'gold'
    },
    {
      id: 3,
      name: 'Saltire Energy',
      logoUrl: '/lovable-uploads/sponsors/saltire.png',
      website: 'https://www.saltire.com/',
      tier: 'silver'
    },
    {
      id: 4,
      name: 'Anderson Construction',
      logoUrl: '/lovable-uploads/sponsors/anderson.png',
      website: 'https://www.andersonconstruction.co.uk/',
      tier: 'silver'
    },
    {
      id: 5,
      name: 'STATS Group',
      logoUrl: '/lovable-uploads/sponsors/stats.png',
      website: 'https://www.statsgroup.com/',
      tier: 'bronze'
    }
  ],
  isLoading: false,
  error: null,
  fetchSponsors: async () => {
    // This is a placeholder for when we eventually fetch sponsors from an API
    set({ isLoading: true, error: null });
    
    try {
      // In the future, this will be replaced with an actual API call
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // The data is already set in the initial state, so we don't need to update it
      set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  addSponsor: (sponsor: Sponsor) => {
    set((state) => ({
      sponsors: [...state.sponsors, sponsor]
    }));
  },
  updateSponsor: (updatedSponsor: Sponsor) => {
    set((state) => ({
      sponsors: state.sponsors.map(sponsor => 
        sponsor.id === updatedSponsor.id ? updatedSponsor : sponsor
      )
    }));
  },
  deleteSponsor: (id: number) => {
    set((state) => ({
      sponsors: state.sponsors.filter(sponsor => sponsor.id !== id)
    }));
  }
}));

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

      return (data as DBSponsor[]).map(convertToSponsor);
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

      return (data as DBSponsor[]).map(convertToSponsor);
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

      return (data as DBSponsor[]).map(convertToSponsor);
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

      return convertToSponsor(data as DBSponsor);
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

      return convertToSponsor(data as DBSponsor);
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

      return convertToSponsor(data as DBSponsor);
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
