
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
