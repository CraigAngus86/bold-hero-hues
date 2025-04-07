
// Sponsor types 
export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'bronze';

export interface Sponsor {
  id: string;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  logo_url?: string;
  website_url?: string;
  tier?: SponsorTier;
  description?: string;
  start_date?: string;
  end_date?: string;
  renewal_status?: 'pending' | 'active' | 'renewed' | 'expired';
  display_order?: number;
  
  // For contact information
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
}

export interface SponsorshipTier {
  id: string;
  name: string;
  description?: string;
  benefits?: string;
  price?: number;
  order_position?: number;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SponsorContact {
  id: string;
  sponsor_id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SponsorDisplaySettings {
  show_on_homepage: boolean;
  display_mode: 'grid' | 'carousel' | 'list';
  sponsors_per_row?: number;
  randomize_order?: boolean;
  show_tier_headings?: boolean;
  max_logos_homepage?: number;
}

export interface SponsorDocument {
  id: string;
  name: string;
  sponsor_id: string;
  file_path: string;
  document_type: string;
  upload_date: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SponsorCommunication {
  id: string;
  sponsor_id: string;
  user_id: string;
  date: string;
  communication_type: 'email' | 'call' | 'meeting' | 'other';
  notes: string;
  outcome?: string;
  follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
}
