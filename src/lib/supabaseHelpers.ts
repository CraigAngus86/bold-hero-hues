
/**
 * Helper functions to work with Supabase responses
 */

// Helper to get around the TypeScript issue with Supabase client chain methods
// This fixes the "Type of 'await' operand must either be a valid promise or must not contain a callable 'then' member" error
export const unwrapPromise = async <T>(promise: Promise<{ data: T; error: any }> | any): Promise<{ data: T; error: any }> => {
  try {
    // Convert the Supabase chainable object to a real promise if needed
    const result = await Promise.resolve(promise);
    return result;
  } catch (error) {
    return { data: null as T, error };
  }
};

// Cast unknown type to string safely
export const safeString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

// Cast unknown[] to string[] safely
export const safeStringArray = (values: unknown[] | null): string[] => {
  if (!values) return [];
  return values.map(safeString);
};

// Add a polyfill for the missing count property
export const addCountProperty = <T>(response: { data: T[]; error: any }): { data: T[]; error: any; count: number } => {
  return {
    ...response,
    count: response.data?.length || 0
  };
};
