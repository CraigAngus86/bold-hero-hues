
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase/supabaseClient';

// Define specific known tables as a union type
export type TableName = 'fixtures' | 'highland_league_table' | 'image_folders' | 'scrape_logs' | 'settings';

// Simplified options interface
export interface QueryOptions {
  select?: string;
  match?: Record<string, any>;
  order?: { column: string; ascending: boolean };
}

// Specific return type to avoid recursion
export interface FetchResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch data from Supabase tables
 */
export function useSupabaseFetch<T>(
  table: TableName,
  options?: QueryOptions
): FetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Start query with the table
        let query = supabase.from(table);
        
        // Select columns
        query = query.select(options?.select || '*');
        
        // Apply filters if any
        if (options?.match) {
          Object.entries(options.match).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        // Apply ordering if specified
        if (options?.order) {
          query = query.order(options.order.column, { 
            ascending: options.order.ascending 
          });
        }
        
        // Execute the query
        const { data: result, error: queryError } = await query;
        
        if (queryError) throw queryError;
        
        // Use explicit type assertion to help TypeScript
        setData(result as T[] || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // Use JSON.stringify for object dependencies
  }, [table, JSON.stringify(options)]);

  return { data, loading, error };
}

// Optional dynamic version for non-standard tables
export function useDynamicSupabaseFetch<T>(
  table: string, // Any table name
  options?: QueryOptions
): FetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use any to break potential recursion in type checking
        let query: any = supabase.from(table);
        
        // Select columns
        query = query.select(options?.select || '*');
        
        // Apply filters if any
        if (options?.match) {
          Object.entries(options.match).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        // Apply ordering if specified
        if (options?.order) {
          query = query.order(options.order.column, { 
            ascending: options.order.ascending 
          });
        }
        
        // Execute the query
        const { data: result, error: queryError } = await query;
        
        if (queryError) throw queryError;
        
        setData(result as T[] || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, JSON.stringify(options)]);

  return { data, loading, error };
}
