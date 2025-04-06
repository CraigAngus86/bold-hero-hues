
export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  start_date?: string;
  end_date?: string;
  renewal_status?: 'active' | 'pending' | 'renewed' | 'expired';
  display_order?: number;
}

export interface SponsorshipTier {
  id: string;
  name: string;
  description: string;
  benefits?: string;
  order_position: number;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SponsorContact {
  id: string;
  sponsor_id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  primary_contact: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SponsorCommunication {
  id: string;
  sponsor_id: string;
  contact_id?: string;
  date: string;
  type: 'email' | 'call' | 'meeting' | 'other';
  subject: string;
  content?: string;
  created_by?: string;
  created_at?: string;
}

export interface SponsorDocument {
  id: string;
  sponsor_id: string;
  name: string;
  file_path: string;
  document_type: 'contract' | 'invoice' | 'receipt' | 'other';
  upload_date: string;
  created_at?: string;
}

export interface SponsorDisplaySettings {
  id: string;
  show_on_homepage: boolean;
  display_mode: 'grid' | 'carousel' | 'list';
  sponsors_per_row: number;
  carousel_speed: number;
  show_tier_headings: boolean;
  randomize_order: boolean;
  max_logos_homepage: number;
  updated_at?: string;
}
