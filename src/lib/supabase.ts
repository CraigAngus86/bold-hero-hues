
// Enhanced mock for the Supabase client implementation

// Define the structure for query responses
interface QueryResponse<T> {
  data: T | null;
  error: any;
  count?: number;
}

// Create more accurate type definitions for the chainable query methods
type ChainableQueryMethods<T> = {
  // Query filter methods
  eq: (column: string, value: any) => ChainableQueryMethods<T>;
  neq: (column: string, value: any) => ChainableQueryMethods<T>;
  gt: (column: string, value: any) => ChainableQueryMethods<T>;
  gte: (column: string, value: any) => ChainableQueryMethods<T>;
  lt: (column: string, value: any) => ChainableQueryMethods<T>;
  lte: (column: string, value: any) => ChainableQueryMethods<T>;
  like: (column: string, value: any) => ChainableQueryMethods<T>;
  ilike: (column: string, value: any) => ChainableQueryMethods<T>;
  is: (column: string, value: any) => ChainableQueryMethods<T>;
  in: (column: string, values: any[]) => ChainableQueryMethods<T>;
  contains: (column: string, value: any) => ChainableQueryMethods<T>;
  containedBy: (column: string, value: any) => ChainableQueryMethods<T>;
  not: (column: string, operator: string, value: any) => ChainableQueryMethods<T>;
  or: (filters: string) => ChainableQueryMethods<T>;
  filter: (column: string, operator: string, value: any) => ChainableQueryMethods<T>;
  
  // Result methods
  limit: (count: number) => ChainableQueryMethods<T>;
  range: (from: number, to: number) => ChainableQueryMethods<T>;
  single: () => Promise<QueryResponse<T[0]>>;
  maybeSingle: () => Promise<QueryResponse<T[0] | null>>;
  order: (column: string, options?: { ascending?: boolean }) => ChainableQueryMethods<T>;
  select: (columns?: string) => ChainableQueryMethods<T>;
  
  // Promise-like behavior to make it awaitable
  then: <TResult1 = QueryResponse<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResponse<T>) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ) => Promise<TResult1 | TResult2>;
};

// Helper to create a chainable promise-like object
const createChainablePromise = <T>(initialData: T | null = null): ChainableQueryMethods<T> => {
  // Create a base result that will be returned through the chain
  const result: QueryResponse<T> = {
    data: initialData,
    error: null,
    count: Array.isArray(initialData) ? initialData.length : 0,
  };
  
  // Create the chainable object with methods that return a new chainable object
  const chainable: ChainableQueryMethods<T> = {
    // Basic promise then method for awaiting
    then: function(onfulfilled, onrejected) {
      return Promise.resolve(result).then(onfulfilled, onrejected);
    },
    
    // Query methods that return a new chainable
    eq: function() { return { ...chainable }; },
    neq: function() { return { ...chainable }; },
    gt: function() { return { ...chainable }; },
    gte: function() { return { ...chainable }; },
    lt: function() { return { ...chainable }; },
    lte: function() { return { ...chainable }; },
    like: function() { return { ...chainable }; },
    ilike: function() { return { ...chainable }; },
    is: function() { return { ...chainable }; },
    in: function() { return { ...chainable }; },
    contains: function() { return { ...chainable }; },
    containedBy: function() { return { ...chainable }; },
    not: function() { return { ...chainable }; },
    or: function() { return { ...chainable }; },
    filter: function() { return { ...chainable }; },
    
    // Result methods
    limit: function() { return { ...chainable }; },
    range: function() { return { ...chainable }; },
    single: function() { 
      return Promise.resolve({
        data: Array.isArray(result.data) && result.data.length > 0 ? result.data[0] : null,
        error: result.error
      }); 
    },
    maybeSingle: function() { 
      return Promise.resolve({
        data: Array.isArray(result.data) && result.data.length > 0 ? result.data[0] : null,
        error: result.error
      });
    },
    order: function() { return { ...chainable }; },
    select: function() { return { ...chainable }; },
  };
  
  return chainable;
};

// Create the mock supabase client
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => {
      return createChainablePromise([]);
    },
    insert: (data: any) => {
      return createChainablePromise(data);
    },
    update: (data: any) => {
      return createChainablePromise(data);
    },
    upsert: (data: any, options?: any) => {
      return createChainablePromise(data);
    },
    delete: () => {
      return createChainablePromise(null);
    },
  }),
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => {
        return Promise.resolve({ 
          data: { path },
          error: null 
        });
      },
      getPublicUrl: (path: string) => ({
        data: { publicURL: `https://example.com/storage/${bucket}/${path}` },
        publicUrl: `https://example.com/storage/${bucket}/${path}`
      }),
      list: (prefix: string) => {
        return Promise.resolve({
          data: [
            { name: 'file1.jpg' },
            { name: 'file2.png' }
          ],
          error: null
        });
      },
      remove: (paths: string[]) => {
        return Promise.resolve({
          data: { paths },
          error: null
        });
      },
      download: (path: string) => {
        return Promise.resolve({
          data: new Blob(['mock file content']),
          error: null
        });
      }
    }),
  },
  auth: {
    signUp: (credentials: { email: string; password: string }) => {
      return Promise.resolve({
        data: { user: { id: 'fake-user-id', email: credentials.email } },
        error: null
      });
    },
    signIn: (credentials: { email: string; password: string }) => {
      return Promise.resolve({
        data: { user: { id: 'fake-user-id', email: credentials.email } },
        error: null
      });
    },
    signOut: () => {
      return Promise.resolve({ data: null, error: null });
    },
    onAuthStateChange: (callback: () => void) => {
      return { 
        unsubscribe: () => {}
      };
    },
    resetPasswordForEmail: (email: string) => {
      return Promise.resolve({ data: null, error: null });
    },
    updateUser: (updates: any) => {
      return Promise.resolve({ data: { user: updates }, error: null });
    }
  },
  functions: {
    invoke: (name: string, options?: { body?: any }) => {
      return Promise.resolve({
        data: { success: true },
        error: null
      });
    }
  },
  channel: (name: string) => ({
    on: (event: string, callback: () => void) => ({
      subscribe: () => {}
    })
  })
};

// Add helper for type-safe access to supabase tables
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
