
// Service for sponsor-related database operations
import { Sponsor, SponsorshipTier, SponsorDisplaySettings, DbServiceResponse } from '@/types/sponsors';
import { supabase } from '@/lib/supabase';

// Get all sponsors from the database
export async function getAllSponsors(): Promise<DbServiceResponse<Sponsor[]>> {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as Sponsor[]
    };
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Get sponsor by ID
export async function getSponsorById(id: string): Promise<DbServiceResponse<Sponsor>> {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as Sponsor
    };
  } catch (error) {
    console.error(`Error fetching sponsor with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Get all sponsors of a specific tier
export async function getSponsorsByTier(tier: string): Promise<DbServiceResponse<Sponsor[]>> {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('tier', tier)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as Sponsor[]
    };
  } catch (error) {
    console.error(`Error fetching sponsors with tier ${tier}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Create a new tier
export async function createSponsorshipTier(tier: Omit<SponsorshipTier, 'id'>): Promise<DbServiceResponse<SponsorshipTier>> {
  try {
    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .insert({
        ...tier,
        name: tier.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as SponsorshipTier
    };
  } catch (error) {
    console.error('Error creating sponsorship tier:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Get all sponsorship tiers
export async function getAllSponsorshipTiers(): Promise<DbServiceResponse<SponsorshipTier[]>> {
  try {
    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .select('*')
      .order('order_position', { ascending: true });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as SponsorshipTier[]
    };
  } catch (error) {
    console.error('Error fetching sponsorship tiers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Save or update display settings
export async function saveSponsorDisplaySettings(settings: SponsorDisplaySettings): Promise<DbServiceResponse<SponsorDisplaySettings>> {
  try {
    // Check if settings exist
    const { data: existingData, error: checkError } = await supabase
      .from('sponsor_display_settings')
      .select('*')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    let data;
    let error;

    if (existingData && existingData.length > 0) {
      // Update existing settings
      const result = await supabase
        .from('sponsor_display_settings')
        .update(settings)
        .eq('id', existingData[0].id);
      
      data = result.data;
      error = result.error;
    } else {
      // Insert new settings
      const result = await supabase
        .from('sponsor_display_settings')
        .insert(settings);
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: settings
    };
  } catch (error) {
    console.error('Error saving sponsor display settings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
