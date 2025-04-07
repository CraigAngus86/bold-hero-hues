
export interface SponsorTier {
  id: string;
  name: string;
  description?: string;
  color?: string;
  order_position: number;
  benefits?: string[];
}

export type SponsorshipTier = SponsorTier;

export interface Sponsor {
  id: string;
  name: string;
  tier: string | SponsorTier;
  logo_url?: string;
  website_url?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  description?: string;
  display_order?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
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
}

// Add missing interfaces
export interface SponsorDisplaySettings {
  id?: string;
  show_on_homepage: boolean;
  show_tier_headings: boolean;
  display_mode: 'grid' | 'carousel' | 'list';
  sponsors_per_row?: number;
  max_logos_homepage?: number;
  carousel_speed?: number;
  randomize_order?: boolean;
}

export interface SponsorCommunication {
  id: string;
  sponsor_id: string;
  contact_id?: string;
  type: string;
  subject: string;
  content?: string;
  date: string;
  created_by?: string;
}

export interface SponsorDocument {
  id: string;
  sponsor_id: string;
  name: string;
  document_type: string;
  file_path: string;
  upload_date?: string;
}

export interface DbServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}
