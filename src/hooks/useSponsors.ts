
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Sponsor } from '@/types/sponsors';

export const useSponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchSponsors = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('sponsors')
          .select('*')
          .eq('is_active', true)
          .order('tier', { ascending: true })
          .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        setSponsors(data || []);
      } catch (err) {
        console.error('Error fetching sponsors:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch sponsors'));
        toast.error('Failed to load sponsors');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSponsors();
  }, []);
  
  // Group sponsors by tier
  const sponsorsByTier = sponsors.reduce<Record<string, Sponsor[]>>((acc, sponsor) => {
    const tier = sponsor.tier || 'other';
    if (!acc[tier]) {
      acc[tier] = [];
    }
    acc[tier].push(sponsor);
    return acc;
  }, {});
  
  return {
    sponsors,
    sponsorsByTier,
    isLoading,
    error
  };
};

export default useSponsors;
