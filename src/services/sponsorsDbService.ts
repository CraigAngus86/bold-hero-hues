
import { supabase } from './supabase/client';
import { DbServiceResponse, Sponsor, SponsorContact, SponsorCommunication, SponsorDocument, SponsorTier, SponsorDisplaySettings } from '@/types/sponsors';

// Fetch all sponsors
export const fetchSponsors = async (): Promise<DbServiceResponse<Sponsor[]>> => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return { success: false, error: error.message };
  }
};

// Fetch a specific sponsor by ID
export const fetchSponsorById = async (id: string): Promise<DbServiceResponse<Sponsor>> => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error fetching sponsor:', error);
    return { success: false, error: error.message };
  }
};

// Create a new sponsor
export const createSponsor = async (sponsor: Omit<Sponsor, 'id'>): Promise<DbServiceResponse<Sponsor>> => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .insert([sponsor])
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error creating sponsor:', error);
    return { success: false, error: error.message };
  }
};

// Update an existing sponsor
export const updateSponsor = async (id: string, sponsor: Partial<Sponsor>): Promise<DbServiceResponse<Sponsor>> => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .update(sponsor)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error updating sponsor:', error);
    return { success: false, error: error.message };
  }
};

// Delete a sponsor
export const deleteSponsor = async (id: string): Promise<DbServiceResponse<null>> => {
  try {
    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    return { success: false, error: error.message };
  }
};

// Fetch all sponsor tiers
export const fetchSponsorshipTiers = async (): Promise<DbServiceResponse<SponsorTier[]>> => {
  try {
    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .select('*')
      .order('order_position', { ascending: true });
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error fetching sponsor tiers:', error);
    return { success: false, error: error.message };
  }
};

// Create a new sponsor tier
export const createSponsorshipTier = async (tier: Omit<SponsorTier, 'id'>): Promise<DbServiceResponse<SponsorTier>> => {
  try {
    // Ensure the tier has a name which is required by the database
    if (!tier.name) {
      return { success: false, error: 'Tier name is required' };
    }
    
    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .insert([tier])
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error creating sponsor tier:', error);
    return { success: false, error: error.message };
  }
};

// Update an existing sponsor tier
export const updateSponsorshipTier = async (id: string, tier: Partial<SponsorTier>): Promise<DbServiceResponse<SponsorTier>> => {
  try {
    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .update(tier)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error updating sponsor tier:', error);
    return { success: false, error: error.message };
  }
};

// Delete a sponsor tier
export const deleteSponsorshipTier = async (id: string): Promise<DbServiceResponse<null>> => {
  try {
    const { error } = await supabase
      .from('sponsorship_tiers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting sponsor tier:', error);
    return { success: false, error: error.message };
  }
};

// Fetch sponsor display settings
export const fetchSponsorDisplaySettings = async (): Promise<DbServiceResponse<SponsorDisplaySettings>> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_display_settings')
      .select('*')
      .single();
    
    if (error) {
      // If no settings exist yet, return an empty settings object
      if (error.code === 'PGRST116') {
        return { 
          data: { 
            id: 'default',
            show_on_homepage: true,
            show_tier_headings: true,
            sponsors_per_row: 4,
            display_mode: 'grid'
          }, 
          success: true 
        };
      }
      throw error;
    }
    
    return { data, success: true };
  } catch (error) {
    console.error('Error fetching sponsor display settings:', error);
    return { success: false, error: error.message };
  }
};

// Update sponsor display settings
export const updateSponsorDisplaySettings = async (id: string, settings: Partial<SponsorDisplaySettings>): Promise<DbServiceResponse<SponsorDisplaySettings>> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_display_settings')
      .update(settings)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error updating sponsor display settings:', error);
    return { success: false, error: error.message };
  }
};

// Contact Management

// Fetch contacts for a sponsor
export const fetchSponsorContacts = async (sponsorId: string): Promise<DbServiceResponse<SponsorContact[]>> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_contacts')
      .select('*')
      .eq('sponsor_id', sponsorId);
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error fetching sponsor contacts:', error);
    return { success: false, error: error.message };
  }
};

// Create a new contact
export const createSponsorContact = async (contact: Omit<SponsorContact, 'id'>): Promise<DbServiceResponse<SponsorContact>> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_contacts')
      .insert([contact])
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error creating sponsor contact:', error);
    return { success: false, error: error.message };
  }
};

// Update an existing contact
export const updateSponsorContact = async (id: string, contact: Partial<SponsorContact>): Promise<DbServiceResponse<SponsorContact>> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_contacts')
      .update(contact)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error updating sponsor contact:', error);
    return { success: false, error: error.message };
  }
};

// Delete a contact
export const deleteSponsorContact = async (id: string): Promise<DbServiceResponse<null>> => {
  try {
    const { error } = await supabase
      .from('sponsor_contacts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting sponsor contact:', error);
    return { success: false, error: error.message };
  }
};

// Communications

// Fetch communications for a sponsor
export const fetchSponsorCommunications = async (sponsorId: string): Promise<DbServiceResponse<SponsorCommunication[]>> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_communications')
      .select('*')
      .eq('sponsor_id', sponsorId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error fetching sponsor communications:', error);
    return { success: false, error: error.message };
  }
};

// Create a new communication
export const createSponsorCommunication = async (comm: Omit<SponsorCommunication, 'id'>): Promise<DbServiceResponse<SponsorCommunication>> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_communications')
      .insert([comm])
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error creating sponsor communication:', error);
    return { success: false, error: error.message };
  }
};

// Delete a communication
export const deleteSponsorCommunication = async (id: string): Promise<DbServiceResponse<null>> => {
  try {
    const { error } = await supabase
      .from('sponsor_communications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting sponsor communication:', error);
    return { success: false, error: error.message };
  }
};

// Documents

// Fetch documents for a sponsor
export const fetchSponsorDocuments = async (sponsorId: string): Promise<DbServiceResponse<SponsorDocument[]>> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_documents')
      .select('*')
      .eq('sponsor_id', sponsorId);
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error fetching sponsor documents:', error);
    return { success: false, error: error.message };
  }
};

// Create a new document
export const createSponsorDocument = async (document: Omit<SponsorDocument, 'id'>): Promise<DbServiceResponse<SponsorDocument>> => {
  try {
    const { data, error } = await supabase
      .from('sponsor_documents')
      .insert([document])
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, success: true };
  } catch (error) {
    console.error('Error creating sponsor document:', error);
    return { success: false, error: error.message };
  }
};

// Delete a document
export const deleteSponsorDocument = async (id: string): Promise<DbServiceResponse<null>> => {
  try {
    const { error } = await supabase
      .from('sponsor_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting sponsor document:', error);
    return { success: false, error: error.message };
  }
};

// Mock function for document download URLs
export const getSponsorDocumentDownloadUrl = async (id: string): Promise<DbServiceResponse<{ url: string }>> => {
  // This would be implemented with actual file storage in a production app
  return { 
    success: true, 
    data: { url: `https://example.com/documents/${id}` }
  };
};
