
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase/supabaseClient';
import { PostgrestFilterBuilder } from '@supabase/supabase-js';

interface UseSupabaseFetchOptions<T> {
  tableName: string;
  columns?: string;
  filters?: {
    column: string;
    operator: string;
    value: any;
  }[];
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
}

export function useSupabaseFetch<T>({ 
  tableName, 
  columns = '*', 
  filters = [],
  orderBy,
  limit
}: UseSupabaseFetchOptions<T>) {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Using any for the query to avoid strict typing issues with table names
        let query: any = supabase
          .from(tableName)
          .select(columns);
        
        // Apply filters if any
        filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value);
        });
        
        // Apply ordering if specified
        if (orderBy) {
          query = query.order(orderBy.column, { 
            ascending: orderBy.ascending !== false 
          });
        }
        
        // Apply limit if specified
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data: result, error } = await query;
        
        if (error) throw error;
        
        setData(result as T[]);
      } catch (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [tableName, columns, JSON.stringify(filters), orderBy, limit]);
  
  return { data, isLoading, error };
}
