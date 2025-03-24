
import { createClient } from '@supabase/supabase-js';

// These environment variables are automatically available in your Lovable project
// when you connect to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing!');
  console.error('Make sure you have connected your Lovable project to Supabase and that the environment variables are available.');
  console.error('You may need to restart your Lovable project after connecting to Supabase.');
}

// Create Supabase client with verification
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to get Supabase client with error handling
export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Please ensure you have connected your Lovable project to Supabase.'
    );
  }
  return supabase;
};
