
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://bbbxhwaixjjxgboeiktq.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYnhod2FpeGpqeGdib2Vpa3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MzA1NzMsImV4cCI6MjA1ODQwNjU3M30.ZZEenwbdq-bGlya3R2yvuspOlKMqkBp6tzC3TAdKGcQ";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Add a helper for type-safe access to supabase tables
export type Tables = any; // TODO: Generate proper types from Supabase

export type SupabaseResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
};

// Helper function to handle common supabase operations
export async function executeQuery<T>(
  operation: () => Promise<any>
): Promise<SupabaseResult<T>> {
  try {
    const { data, error, count } = await operation();
    
    if (error) {
      console.error('Supabase query error:', error);
      return {
        success: false,
        error: error.message || 'An unknown error occurred'
      };
    }
    
    return {
      success: true,
      data: data as T,
      count
    };
  } catch (error) {
    console.error('Unexpected error during Supabase operation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}
