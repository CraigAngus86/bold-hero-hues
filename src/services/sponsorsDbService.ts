
import { supabase } from '@/services/supabase/supabaseClient';
import { handleDbOperation, DbServiceResponse } from './utils/dbService';
import { 
  Sponsor, 
  SponsorshipTier, 
  SponsorContact, 
  SponsorCommunication, 
  SponsorDocument,
  SponsorDisplaySettings
} from '@/types/sponsors';

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
        .order('display_order', { ascending: true })
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
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Sponsor[] || [];
    },
    `Failed to fetch sponsors with tier ${tier}`
  );
}

// Get all sponsors (for admin management)
export async function getAllSponsors(): Promise<DbServiceResponse<Sponsor[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('tier', { ascending: true })
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Sponsor[] || [];
    },
    'Failed to fetch all sponsors'
  );
}

// Sponsorship Tiers Management

export async function fetchSponsorshipTiers(): Promise<DbServiceResponse<SponsorshipTier[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsorship_tiers')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      return data as SponsorshipTier[] || [];
    },
    'Failed to fetch sponsorship tiers'
  );
}

export async function createSponsorshipTier(tier: Omit<SponsorshipTier, 'id'>): Promise<DbServiceResponse<SponsorshipTier>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsorship_tiers')
        .insert(tier)
        .select()
        .single();

      if (error) throw error;
      return data as SponsorshipTier;
    },
    'Failed to create sponsorship tier'
  );
}

export async function updateSponsorshipTier(id: string, tier: Partial<SponsorshipTier>): Promise<DbServiceResponse<SponsorshipTier>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsorship_tiers')
        .update(tier)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as SponsorshipTier;
    },
    `Failed to update sponsorship tier with id ${id}`
  );
}

export async function deleteSponsorshipTier(id: string): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('sponsorship_tiers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    `Failed to delete sponsorship tier with id ${id}`
  );
}

// Display Settings

export async function fetchSponsorDisplaySettings(): Promise<DbServiceResponse<SponsorDisplaySettings>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsor_display_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      return data as SponsorDisplaySettings;
    },
    'Failed to fetch sponsor display settings'
  );
}

export async function updateSponsorDisplaySettings(id: string, settings: Partial<SponsorDisplaySettings>): Promise<DbServiceResponse<SponsorDisplaySettings>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsor_display_settings')
        .update(settings)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as SponsorDisplaySettings;
    },
    'Failed to update sponsor display settings'
  );
}

// Sponsor Contacts

export async function fetchSponsorContacts(sponsorId: string): Promise<DbServiceResponse<SponsorContact[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsor_contacts')
        .select('*')
        .eq('sponsor_id', sponsorId)
        .order('primary_contact', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as SponsorContact[] || [];
    },
    `Failed to fetch contacts for sponsor ${sponsorId}`
  );
}

export async function createSponsorContact(contact: Omit<SponsorContact, 'id'>): Promise<DbServiceResponse<SponsorContact>> {
  return handleDbOperation(
    async () => {
      // If this is being set as primary, make sure to unset any existing primary
      if (contact.primary_contact) {
        await supabase
          .from('sponsor_contacts')
          .update({ primary_contact: false })
          .eq('sponsor_id', contact.sponsor_id)
          .eq('primary_contact', true);
      }

      const { data, error } = await supabase
        .from('sponsor_contacts')
        .insert(contact)
        .select()
        .single();

      if (error) throw error;
      return data as SponsorContact;
    },
    'Failed to create sponsor contact'
  );
}

export async function updateSponsorContact(id: string, contact: Partial<SponsorContact>): Promise<DbServiceResponse<SponsorContact>> {
  return handleDbOperation(
    async () => {
      // If this is being set as primary, make sure to unset any existing primary
      if (contact.primary_contact) {
        const { data: currentContact } = await supabase
          .from('sponsor_contacts')
          .select('sponsor_id')
          .eq('id', id)
          .single();
          
        if (currentContact) {
          await supabase
            .from('sponsor_contacts')
            .update({ primary_contact: false })
            .eq('sponsor_id', currentContact.sponsor_id)
            .eq('primary_contact', true)
            .neq('id', id);
        }
      }

      const { data, error } = await supabase
        .from('sponsor_contacts')
        .update(contact)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as SponsorContact;
    },
    `Failed to update sponsor contact with id ${id}`
  );
}

export async function deleteSponsorContact(id: string): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('sponsor_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    `Failed to delete sponsor contact with id ${id}`
  );
}

// Communications

export async function fetchSponsorCommunications(sponsorId: string): Promise<DbServiceResponse<SponsorCommunication[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsor_communications')
        .select('*, sponsor_contacts(*)')
        .eq('sponsor_id', sponsorId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as SponsorCommunication[] || [];
    },
    `Failed to fetch communications for sponsor ${sponsorId}`
  );
}

export async function createSponsorCommunication(communication: Omit<SponsorCommunication, 'id'>): Promise<DbServiceResponse<SponsorCommunication>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsor_communications')
        .insert(communication)
        .select()
        .single();

      if (error) throw error;
      return data as SponsorCommunication;
    },
    'Failed to create sponsor communication'
  );
}

export async function deleteSponsorCommunication(id: string): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('sponsor_communications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    `Failed to delete sponsor communication with id ${id}`
  );
}

// Documents

export async function fetchSponsorDocuments(sponsorId: string): Promise<DbServiceResponse<SponsorDocument[]>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsor_documents')
        .select('*')
        .eq('sponsor_id', sponsorId)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      return data as SponsorDocument[] || [];
    },
    `Failed to fetch documents for sponsor ${sponsorId}`
  );
}

export async function createSponsorDocument(document: Omit<SponsorDocument, 'id'>): Promise<DbServiceResponse<SponsorDocument>> {
  return handleDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('sponsor_documents')
        .insert(document)
        .select()
        .single();

      if (error) throw error;
      return data as SponsorDocument;
    },
    'Failed to create sponsor document'
  );
}

export async function deleteSponsorDocument(id: string): Promise<DbServiceResponse<boolean>> {
  return handleDbOperation(
    async () => {
      const { error } = await supabase
        .from('sponsor_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    `Failed to delete sponsor document with id ${id}`
  );
}
