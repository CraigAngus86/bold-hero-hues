
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase/supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

// Define known table names
export type TableName = 'fixtures' | 'highland_league_table' | 'image_folders' | 'scrape_logs' | 'settings';

// Options for queries
export interface QueryOptions {
  select?: string;
  match?: Record<string, any>;
  order?: { column: string; ascending: boolean };
}

// Result type
export interface FetchResult<T> {
  data: T[];
  loading: boolean;
  error: Error | PostgrestError | null;
}

/**
 * Hook for fetching data from Supabase with type safety
 */
export function useSupabaseFetch<T>(
  tableName: TableName,
  options?: QueryOptions
): FetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | PostgrestError | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        
        // Use type assertion to avoid complex type analysis
        const baseQuery = supabase.from(tableName) as any;
        
        // Build query step by step
        const selectClause = options?.select || '*';
        let query = baseQuery.select(selectClause);
        
        // Apply filters
        if (options?.match) {
          Object.entries(options.match).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        // Apply ordering
        if (options?.order) {
          query = query.order(options.order.column, { 
            ascending: options.order.ascending 
          });
        }
        
        // Execute the query
        const { data: result, error: queryError } = await query;
        
        if (!isMounted) return;
        
        if (queryError) {
          throw queryError;
        }
        
        setData(result as T[]);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching data:', err);
        setError(err as Error | PostgrestError);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [tableName, JSON.stringify(options)]);

  return { data, loading, error };
}

/**
 * Hook for dynamic table fetching (less type-safe)
 */
export function useDynamicSupabaseFetch<T>(
  tableName: string,
  options?: QueryOptions
): FetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | PostgrestError | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        
        // Use any type to bypass TypeScript checks completely
        const query = supabase.from(tableName) as any;
        
        // Build query step by step
        const selectClause = options?.select || '*';
        let builtQuery = query.select(selectClause);
        
        // Apply filters
        if (options?.match) {
          Object.entries(options.match).forEach(([key, value]) => {
            builtQuery = builtQuery.eq(key, value);
          });
        }
        
        // Apply ordering
        if (options?.order) {
          builtQuery = builtQuery.order(options.order.column, { 
            ascending: options.order.ascending 
          });
        }
        
        // Execute the query
        const { data: result, error: queryError } = await builtQuery;
        
        if (!isMounted) return;
        
        if (queryError) {
          throw queryError;
        }
        
        setData(result as T[]);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching data:', err);
        setError(err as Error | PostgrestError);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [tableName, JSON.stringify(options)]);

  return { data, loading, error };
}
