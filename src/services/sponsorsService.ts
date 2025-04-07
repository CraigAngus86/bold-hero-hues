
import { create } from 'zustand';
import { Sponsor, SponsorDisplaySettings, SponsorTier, SponsorContact, SponsorDocument, SponsorshipTier, SponsorCommunication } from '@/types/sponsors';
import { supabase } from '@/integrations/supabase/client';

// Define the store state
interface SponsorsState {
  sponsors: Sponsor[];
  isLoading: boolean;
  error: string | null;
  loadSponsors: () => Promise<void>;
  getSponsorById: (id: string) => Promise<Sponsor | null>;
  createSponsor: (sponsor: Omit<Sponsor, 'id'>) => Promise<boolean>;
  updateSponsor: (id: string, data: Partial<Sponsor>) => Promise<boolean>;
  deleteSponsor: (id: string) => Promise<boolean>;
  getSponsors: () => Sponsor[];
}

// Create the store
export const useSponsorsStore = create<SponsorsState>((set, get) => ({
  sponsors: [],
  isLoading: false,
  error: null,
  
  loadSponsors: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      set({ sponsors: data || [], isLoading: false });
    } catch (error) {
      console.error('Error loading sponsors:', error);
      set({ error: 'Failed to load sponsors', isLoading: false });
    }
  },
  
  getSponsorById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching sponsor:', error);
      return null;
    }
  },
  
  createSponsor: async (sponsor: Omit<Sponsor, 'id'>) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .insert(sponsor);
      
      if (error) throw error;
      await get().loadSponsors();
      return true;
    } catch (error) {
      console.error('Error creating sponsor:', error);
      return false;
    }
  },
  
  updateSponsor: async (id: string, data: Partial<Sponsor>) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      await get().loadSponsors();
      return true;
    } catch (error) {
      console.error('Error updating sponsor:', error);
      return false;
    }
  },
  
  deleteSponsor: async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await get().loadSponsors();
      return true;
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      return false;
    }
  },
  
  getSponsors: () => get().sponsors,
}));

// Helper functions for fetching sponsor configurations and related data
export const fetchSponsorDisplaySettings = async (): Promise<{success: boolean, data?: SponsorDisplaySettings, error?: string}> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_display_settings')
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data: data as SponsorDisplaySettings
    };
  } catch (error) {
    console.error('Error fetching sponsor display settings:', error);
    return {
      success: false,
      error: 'Failed to load sponsor display settings'
    };
  }
};

// Export contact management functions
export const createSponsorContact = async (contact: Omit<SponsorContact, 'id'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sponsor_contacts')
      .insert(contact);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating sponsor contact:', error);
    return false;
  }
};

export const fetchSponsorContacts = async (sponsorId: string): Promise<SponsorContact[]> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_contacts')
      .select('*')
      .eq('sponsor_id', sponsorId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sponsor contacts:', error);
    return [];
  }
};

export const updateSponsorContact = async (id: string, data: Partial<SponsorContact>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sponsor_contacts')
      .update(data)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating sponsor contact:', error);
    return false;
  }
};

export const deleteSponsorContact = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sponsor_contacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting sponsor contact:', error);
    return false;
  }
};

// Document management
export const createSponsorDocument = async (document: Omit<SponsorDocument, 'id'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sponsor_documents')
      .insert(document);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating sponsor document:', error);
    return false;
  }
};

export const deleteSponsorDocument = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sponsor_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting sponsor document:', error);
    return false;
  }
};

export const downloadSponsorDocumentUrl = async (filePath: string): Promise<string> => {
  const { publicUrl } = supabase.storage.from('sponsor_documents').getPublicUrl(filePath);
  return publicUrl;
};

// Tier management 
export const fetchSponsorshipTiers = async (): Promise<SponsorshipTier[]> => {
  try {
    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .select('*')
      .order('order_position');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sponsorship tiers:', error);
    return [];
  }
};

export const createSponsorshipTier = async (tier: Omit<SponsorshipTier, 'id'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sponsorship_tiers')
      .insert(tier);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating sponsorship tier:', error);
    return false;
  }
};

export const updateSponsorshipTier = async (id: string, data: Partial<SponsorshipTier>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sponsorship_tiers')
      .update(data)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating sponsorship tier:', error);
    return false;
  }
};

export const deleteSponsorshipTier = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sponsorship_tiers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting sponsorship tier:', error);
    return false;
  }
};

// Additional functions
export const getSponsorCategories = async (): Promise<string[]> => {
  try {
    // For mockup purposes, return some categories
    return ['Main Club Sponsor', 'Match Sponsor', 'Kit Sponsor', 'Youth Development', 'Event Sponsor'];
  } catch (error) {
    console.error('Error fetching sponsor categories:', error);
    return [];
  }
};

export const fetchSponsorById = async (id: string): Promise<Sponsor | null> => {
  return await useSponsorsStore.getState().getSponsorById(id);
};

export const getAllSponsors = async (): Promise<Sponsor[]> => {
  return useSponsorsStore.getState().getSponsors();
};
