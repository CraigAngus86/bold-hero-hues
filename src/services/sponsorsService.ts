
import { Sponsor, SponsorContact, SponsorCommunication, SponsorDocument, SponsorshipTier, SponsorDisplaySettings, SponsorTier } from '@/types/sponsors';
import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

// Define the store types
interface SponsorsState {
  sponsors: Sponsor[];
  loading: boolean;
  error: string | null;
  
  // Methods
  fetchSponsors: () => Promise<void>;
  getSponsorById: (id: string) => Sponsor | undefined;
  getSponsorsByTier: (tier: string) => Sponsor[];
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => Promise<{ success: boolean; data?: Sponsor; error?: string }>;
  updateSponsor: (id: string, updates: Partial<Sponsor>) => Promise<{ success: boolean; data?: Sponsor; error?: string }>;
  deleteSponsor: (id: string) => Promise<{ success: boolean; error?: string }>;
}

// Create the store
export const useSponsorsStore = create<SponsorsState>((set, get) => ({
  sponsors: [],
  loading: false,
  error: null,
  
  fetchSponsors: async () => {
    set({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      set({ sponsors: data || [], loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sponsors';
      console.error('Error fetching sponsors:', error);
      set({ error: errorMessage, loading: false });
    }
  },
  
  getSponsorById: (id: string) => {
    return get().sponsors.find(sponsor => sponsor.id === id);
  },
  
  getSponsorsByTier: (tier: string) => {
    return get().sponsors.filter(sponsor => sponsor.tier === tier && sponsor.is_active);
  },
  
  addSponsor: async (sponsor: Omit<Sponsor, 'id'>) => {
    try {
      const { data, error } = await supabase.from('sponsors').insert({
        ...sponsor,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (error) throw error;
      
      // Refresh sponsors list
      get().fetchSponsors();
      
      return { success: true, data: data as Sponsor };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add sponsor';
      console.error('Error adding sponsor:', error);
      return { success: false, error: errorMessage };
    }
  },
  
  updateSponsor: async (id: string, updates: Partial<Sponsor>) => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh sponsors list
      get().fetchSponsors();
      
      return { success: true, data: data as Sponsor };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update sponsor';
      console.error('Error updating sponsor:', error);
      return { success: false, error: errorMessage };
    }
  },
  
  deleteSponsor: async (id: string) => {
    try {
      // Delete sponsor's related data first
      await supabase.from('sponsor_contacts').delete().eq('sponsor_id', id);
      await supabase.from('sponsor_documents').delete().eq('sponsor_id', id);
      await supabase.from('sponsor_communications').delete().eq('sponsor_id', id);
      
      // Then delete the sponsor
      const { error } = await supabase.from('sponsors').delete().eq('id', id);
      
      if (error) throw error;
      
      // Update local state by filtering out the deleted sponsor
      set(state => ({
        sponsors: state.sponsors.filter(s => s.id !== id)
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete sponsor';
      console.error('Error deleting sponsor:', error);
      return { success: false, error: errorMessage };
    }
  }
}));

// Fetch all sponsors
export const getAllSponsors = async (): Promise<{ success: boolean; data: Sponsor[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    
    return { success: true, data: data as Sponsor[] };
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return { 
      success: false, 
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch sponsors' 
    };
  }
};

// Sponsor contacts functions
export const fetchSponsorContacts = async (sponsorId: string): Promise<SponsorContact[]> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_contacts')
      .select('*')
      .eq('sponsor_id', sponsorId)
      .order('name');
    
    if (error) throw error;
    
    return data as SponsorContact[];
  } catch (error) {
    console.error(`Error fetching contacts for sponsor ${sponsorId}:`, error);
    return [];
  }
};

export const createSponsorContact = async (contact: Omit<SponsorContact, 'id'>): Promise<{ success: boolean; data?: SponsorContact; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_contacts')
      .insert({
        ...contact,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return { success: true, data: data as SponsorContact };
  } catch (error) {
    console.error('Error creating sponsor contact:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create contact' 
    };
  }
};

export const updateSponsorContact = async (id: string, updates: Partial<SponsorContact>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('sponsor_contacts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error updating sponsor contact:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update contact' 
    };
  }
};

export const deleteSponsorContact = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('sponsor_contacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting sponsor contact:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete contact' 
    };
  }
};

// Sponsor communications
export const fetchSponsorCommunications = async (sponsorId: string): Promise<SponsorCommunication[]> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_communications')
      .select('*')
      .eq('sponsor_id', sponsorId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return data as SponsorCommunication[];
  } catch (error) {
    console.error(`Error fetching communications for sponsor ${sponsorId}:`, error);
    return [];
  }
};

export const createSponsorCommunication = async (communication: Omit<SponsorCommunication, 'id'>): Promise<{ success: boolean; data?: SponsorCommunication; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_communications')
      .insert({
        ...communication,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return { success: true, data: data as SponsorCommunication };
  } catch (error) {
    console.error('Error creating sponsor communication:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create communication' 
    };
  }
};

// Sponsor documents
export const fetchSponsorDocuments = async (sponsorId: string): Promise<SponsorDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_documents')
      .select('*')
      .eq('sponsor_id', sponsorId);
    
    if (error) throw error;
    
    return data as SponsorDocument[];
  } catch (error) {
    console.error(`Error fetching documents for sponsor ${sponsorId}:`, error);
    return [];
  }
};

export const createSponsorDocument = async (document: Omit<SponsorDocument, 'id'>): Promise<{ success: boolean; data?: SponsorDocument; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_documents')
      .insert({
        ...document,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return { success: true, data: data as SponsorDocument };
  } catch (error) {
    console.error('Error creating sponsor document:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create document' 
    };
  }
};

export const deleteSponsorDocument = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('sponsor_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting sponsor document:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete document' 
    };
  }
};

// Sponsor display settings
export const fetchSponsorDisplaySettings = async (): Promise<SponsorDisplaySettings> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_display_settings')
      .select('*')
      .single();
    
    if (error) {
      // If no settings exist yet, return defaults
      if (error.message.includes('No rows found')) {
        return {
          show_on_homepage: true,
          display_mode: 'grid',
          sponsors_per_row: 4,
          randomize_order: false,
          show_tier_headings: true,
          max_logos_homepage: 8
        };
      }
      throw error;
    }
    
    return data as SponsorDisplaySettings;
  } catch (error) {
    console.error('Error fetching sponsor display settings:', error);
    // Return default settings on error
    return {
      show_on_homepage: true,
      display_mode: 'grid',
      sponsors_per_row: 4,
      randomize_order: false,
      show_tier_headings: true,
      max_logos_homepage: 8
    };
  }
};

// Sponsorship tiers
export const fetchSponsorshipTiers = async (): Promise<SponsorshipTier[]> => {
  try {
    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .select('*')
      .order('order_position');
    
    if (error) throw error;
    
    return data as SponsorshipTier[];
  } catch (error) {
    console.error('Error fetching sponsorship tiers:', error);
    return [];
  }
};

export const createSponsorshipTier = async (tier: Omit<SponsorshipTier, 'id'>): Promise<{ success: boolean; data?: SponsorshipTier; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .insert({
        ...tier,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return { success: true, data: data as SponsorshipTier };
  } catch (error) {
    console.error('Error creating sponsorship tier:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create tier' 
    };
  }
};

export const updateSponsorshipTier = async (id: string, updates: Partial<SponsorshipTier>): Promise<{ success: boolean; data?: SponsorshipTier; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, data: data as SponsorshipTier };
  } catch (error) {
    console.error('Error updating sponsorship tier:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update tier' 
    };
  }
};

export const deleteSponsorshipTier = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('sponsorship_tiers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting sponsorship tier:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete tier' 
    };
  }
};

// Helper to get different sponsor categories
export const getSponsorCategories = async (): Promise<string[]> => {
  try {
    const tiers = await fetchSponsorshipTiers();
    return tiers.map(tier => tier.name);
  } catch (error) {
    console.error('Error getting sponsor categories:', error);
    return ['platinum', 'gold', 'silver', 'bronze']; // Fallback to defaults
  }
};

// Function to create a sponsor
export const createSponsor = async (sponsor: Omit<Sponsor, 'id'>): Promise<{ success: boolean; data?: Sponsor; error?: string }> => {
  return useSponsorsStore.getState().addSponsor(sponsor);
};

// Function to update a sponsor
export const updateSponsor = async (id: string, updates: Partial<Sponsor>): Promise<{ success: boolean; data?: Sponsor; error?: string }> => {
  return useSponsorsStore.getState().updateSponsor(id, updates);
};

// Function to delete a sponsor
export const deleteSponsor = async (id: string): Promise<{ success: boolean; error?: string }> => {
  return useSponsorsStore.getState().deleteSponsor(id);
};

// Function to get sponsors by a specific field
export const getSponsors = async (field: string, value: any): Promise<Sponsor[]> => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq(field, value);
    
    if (error) throw error;
    
    return data as Sponsor[];
  } catch (error) {
    console.error(`Error fetching sponsors where ${field}=${value}:`, error);
    return [];
  }
};
