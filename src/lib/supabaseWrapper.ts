
import { supabase } from '@/integrations/supabase/client';
import { unwrapPromise, ensureString, convertToStringArray } from '@/lib/supabaseHelpers';

/**
 * A wrapper around the Supabase client to ensure consistent behavior
 * and properly handle type conversions, especially for count property
 */
export class SupabaseClientWrapper {
  /**
   * Execute a query and ensure the response has a count property
   */
  static async executeQuery<T>(
    queryPromise: Promise<any> | any
  ): Promise<{ data: T[]; error: any; count: number }> {
    try {
      const result = await unwrapPromise<T[]>(queryPromise);
      
      return {
        data: Array.isArray(result.data) ? result.data : [],
        error: result.error,
        count: result.count !== undefined ? result.count : (Array.isArray(result.data) ? result.data.length : 0)
      };
    } catch (error) {
      console.error('Supabase query execution error:', error);
      return { data: [], error, count: 0 };
    }
  }
  
  /**
   * Convert unknown array to string array safely
   */
  static toStringArray(values: unknown[] | null | undefined): string[] {
    return convertToStringArray(values || []);
  }
  
  /**
   * Convert unknown to string safely
   */
  static toString(value: unknown): string {
    return ensureString(value);
  }
  
  /**
   * Normalize publicUrl vs publicURL inconsistency
   */
  static normalizePublicUrl(urlObj: { publicUrl?: string; publicURL?: string }): string {
    return urlObj.publicUrl || urlObj.publicURL || '';
  }
  
  /**
   * Build a SELECT query with proper count handling
   */
  static select<T>(tableName: string, columns: string = '*') {
    const query = supabase.from(tableName).select(columns);
    return {
      eq: (column: string, value: any) => SupabaseClientWrapper.executeQuery<T>(query.eq(column, value)),
      neq: (column: string, value: any) => SupabaseClientWrapper.executeQuery<T>(query.neq(column, value)),
      gt: (column: string, value: any) => SupabaseClientWrapper.executeQuery<T>(query.gt(column, value)),
      gte: (column: string, value: any) => SupabaseClientWrapper.executeQuery<T>(query.gte(column, value)),
      lt: (column: string, value: any) => SupabaseClientWrapper.executeQuery<T>(query.lt(column, value)),
      lte: (column: string, value: any) => SupabaseClientWrapper.executeQuery<T>(query.lte(column, value)),
      in: (column: string, values: any[]) => SupabaseClientWrapper.executeQuery<T>(query.in(column, values)),
      order: (column: string, options?: { ascending?: boolean }) => 
        SupabaseClientWrapper.executeQuery<T>(query.order(column, options)),
      limit: (count: number) => SupabaseClientWrapper.executeQuery<T>(query.limit(count)),
      single: async () => {
        const result = await unwrapPromise<T>(query.single());
        return {
          data: result.data as T,
          error: result.error,
        };
      },
      maybeSingle: async () => {
        const result = await unwrapPromise<T>(query.maybeSingle());
        return {
          data: result.data as T,
          error: result.error,
        };
      },
      execute: () => SupabaseClientWrapper.executeQuery<T>(query),
    };
  }
  
  /**
   * Insert data into a table
   */
  static insert<T>(tableName: string, data: any) {
    const query = supabase.from(tableName).insert(data);
    return {
      select: (columns: string = '*') => SupabaseClientWrapper.executeQuery<T>(query.select(columns)),
      execute: () => SupabaseClientWrapper.executeQuery<T>(query),
    };
  }
  
  /**
   * Update data in a table
   */
  static update<T>(tableName: string, data: any) {
    const query = supabase.from(tableName).update(data);
    return {
      eq: (column: string, value: any) => ({
        select: (columns: string = '*') => SupabaseClientWrapper.executeQuery<T>(query.eq(column, value).select(columns)),
        execute: () => SupabaseClientWrapper.executeQuery<T>(query.eq(column, value)),
      }),
      in: (column: string, values: any[]) => ({
        select: (columns: string = '*') => SupabaseClientWrapper.executeQuery<T>(query.in(column, values).select(columns)),
        execute: () => SupabaseClientWrapper.executeQuery<T>(query.in(column, values)),
      }),
    };
  }
  
  /**
   * Delete data from a table
   */
  static delete(tableName: string) {
    const query = supabase.from(tableName).delete();
    return {
      eq: (column: string, value: any) => SupabaseClientWrapper.executeQuery(query.eq(column, value)),
      in: (column: string, values: any[]) => SupabaseClientWrapper.executeQuery(query.in(column, values)),
    };
  }
  
  /**
   * Get an item from storage with normalized URL
   */
  static getPublicUrl(bucket: string, path: string): string {
    const urlObj = supabase.storage.from(bucket).getPublicUrl(path);
    return this.normalizePublicUrl(urlObj);
  }
}
