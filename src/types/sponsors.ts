
// Sponsor related types

export interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  website?: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  description?: string;
}

// Types for Supabase database interactions
export interface DBSponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  description?: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

// Conversion function for sponsors from DB format to UI format
export function convertToSponsor(dbSponsor: DBSponsor): Sponsor {
  return {
    id: parseInt(dbSponsor.id),
    name: dbSponsor.name,
    logoUrl: dbSponsor.logo_url,
    website: dbSponsor.website_url,
    tier: dbSponsor.tier,
    description: dbSponsor.description
  };
}

// Conversion function from UI format to DB format
export function convertToDBSponsor(sponsor: Sponsor): Partial<DBSponsor> {
  return {
    name: sponsor.name,
    logo_url: sponsor.logoUrl,
    website_url: sponsor.website,
    tier: sponsor.tier,
    description: sponsor.description,
    is_active: true
  };
}
