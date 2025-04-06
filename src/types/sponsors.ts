
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

export interface SponsorshipTier {
  id: string;
  name: string;
  description: string;
  benefits?: string;
  order: number;
}

export interface SponsorDisplaySettings {
  showOnHomepage: boolean;
  displayMode: 'grid' | 'carousel' | 'list';
  sponsorsPerRow: number;
  carouselSpeed: number;
  showTierHeadings: boolean;
  randomizeOrder: boolean;
  maxLogosHomepage: number;
}
