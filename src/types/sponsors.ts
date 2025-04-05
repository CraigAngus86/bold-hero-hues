
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
}
