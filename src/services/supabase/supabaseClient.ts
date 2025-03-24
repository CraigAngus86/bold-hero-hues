
import { createClient } from '@supabase/supabase-js';
import { supabase as integrationsSupabase } from '@/integrations/supabase/client';

// Use the integrated Supabase client
export const supabase = integrationsSupabase;

// Helper function to get Supabase client with error handling
export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Please ensure you have connected your Lovable project to Supabase.'
    );
  }
  return supabase;
};
