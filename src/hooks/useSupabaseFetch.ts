
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
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Start the query
        let query = supabase.from(tableName);
        
        // Select columns
        const selectQuery = options?.select 
          ? query.select(options.select)
          : query.select('*');
          
        // Apply filters if any
        let filteredQuery = selectQuery;
        if (options?.match) {
          Object.entries(options.match).forEach(([key, value]) => {
            filteredQuery = filteredQuery.eq(key, value);
          });
        }
        
        // Apply ordering if any
        let orderedQuery = filteredQuery;
        if (options?.order) {
          orderedQuery = filteredQuery.order(options.order.column, { 
            ascending: options.order.ascending 
          });
        }
        
        // Execute the query
        const { data: result, error: queryError } = await orderedQuery;
        
        if (queryError) {
          throw queryError;
        }
        
        setData(result as T[]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err as Error | PostgrestError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cast to any to bypass TypeScript's strict checking for dynamic tables
        const query = (supabase as any).from(tableName);
        
        // Select columns
        const selectQuery = options?.select 
          ? query.select(options.select)
          : query.select('*');
          
        // Apply filters if any
        let filteredQuery = selectQuery;
        if (options?.match) {
          Object.entries(options.match).forEach(([key, value]) => {
            filteredQuery = filteredQuery.eq(key, value);
          });
        }
        
        // Apply ordering if any
        let orderedQuery = filteredQuery;
        if (options?.order) {
          orderedQuery = filteredQuery.order(options.order.column, { 
            ascending: options.order.ascending 
          });
        }
        
        // Execute the query
        const { data: result, error: queryError } = await orderedQuery;
        
        if (queryError) {
          throw queryError;
        }
        
        setData(result as T[]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err as Error | PostgrestError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, JSON.stringify(options)]);

  return { data, loading, error };
}
