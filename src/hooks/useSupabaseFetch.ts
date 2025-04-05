
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase/supabaseClient';

// Define your known tables as a type
type KnownTables = 'fixtures' | 'highland_league_table' | 'image_folders' | 'scrape_logs' | 'settings';

// Generic version of the hook for strictly typed tables
export function useSupabaseFetch<T>(
  table: KnownTables,
  options?: {
    select?: string;
    match?: Record<string, any>;
    order?: { column: string; ascending: boolean };
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Using a simpler approach to build the query
        let query = supabase.from(table).select(options?.select || '*');
        
        if (options?.match) {
          Object.entries(options.match).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        if (options?.order) {
          query = query.order(options.order.column, { 
            ascending: options.order.ascending 
          });
        }
        
        const { data: result, error: queryError } = await query;
        
        if (queryError) throw queryError;
        
        setData((result || []) as T[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, options]);

  return { data, loading, error };
}

// Alternative version for dynamic table names (less type-safe)
export function useDynamicSupabaseFetch<T>(
  table: string,
  options?: {
    select?: string;
    match?: Record<string, any>;
    order?: { column: string; ascending: boolean };
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Using type assertion to bypass TypeScript's strict checking
        const baseQuery = supabase.from(table as any);
        let query = baseQuery.select(options?.select || '*');
        
        if (options?.match) {
          Object.entries(options.match).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        if (options?.order) {
          query = query.order(options.order.column, { 
            ascending: options.order.ascending 
          });
        }
        
        const { data: result, error: queryError } = await query;
        
        if (queryError) throw queryError;
        
        setData((result || []) as T[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, options]);

  return { data, loading, error };
}
