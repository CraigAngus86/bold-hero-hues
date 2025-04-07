
export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  description?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  renewal_status?: string;
  created_at?: string;
  updated_at?: string;
  display_order?: number;
  // Additional contact fields
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
}

export interface SponsorDocument {
  id: string;
  name: string;
  sponsor_id: string;
  file_path: string;
  document_type: string;
  upload_date: string;
  created_at?: string;
}

export interface SponsorCommunication {
  id: string;
  sponsor_id: string;
  date: string;
  type: 'email' | 'call' | 'meeting' | 'other';
  subject: string;
  content?: string;
  created_by: string;
  contact_id?: string;
  created_at?: string;
}

export interface SponsorContact {
  id: string;
  sponsor_id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  primary_contact: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SponsorTier {
  id: string;
  name: string;
  description?: string;
  benefits?: string;
  color?: string;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

// Renamed from SponsorshipTier to SponsorTier for consistency
export type SponsorshipTier = SponsorTier;

export interface SponsorDisplaySettings {
  id: string;
  show_on_homepage?: boolean;
  show_tier_headings?: boolean;
  carousel_speed?: number;
  sponsors_per_row?: number;
  max_logos_homepage?: number;
  display_mode?: string;
  randomize_order?: boolean;
  updated_at?: string;
}

export interface DbServiceResponse<T> {
  data?: T;
  success: boolean;
  error?: string;
}
