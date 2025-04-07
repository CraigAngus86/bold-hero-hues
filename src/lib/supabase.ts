
// Enhanced mock for the Supabase client implementation

// Define the structure for query responses
interface QueryResponse<T> {
  data: T | null;
  error: any;
  count?: number;
}

// Helper to create a chainable promise-like object
const createChainablePromise = <T>(initialData: T | null = null) => {
  const chainMethods = {
    data: initialData,
    error: null,
    count: 0,
    
    // Basic promise methods
    then: function(callback: any) {
      return Promise.resolve({ data: this.data, error: this.error, count: this.count }).then(callback);
    },
    
    // Query methods
    eq: function(column: string, value: any) {
      // Return a new chainable with the same methods
      return { ...this };
    },
    neq: function(column: string, value: any) {
      return { ...this };
    },
    gt: function(column: string, value: any) {
      return { ...this };
    },
    gte: function(column: string, value: any) {
      return { ...this };
    },
    lt: function(column: string, value: any) {
      return { ...this };
    },
    lte: function(column: string, value: any) {
      return { ...this };
    },
    like: function(column: string, value: any) {
      return { ...this };
    },
    ilike: function(column: string, value: any) {
      return { ...this };
    },
    is: function(column: string, value: any) {
      return { ...this };
    },
    in: function(column: string, values: any[]) {
      return { ...this };
    },
    contains: function(column: string, value: any) {
      return { ...this };
    },
    containedBy: function(column: string, value: any) {
      return { ...this };
    },
    not: function(column: string, operator: string, value: any) {
      return { ...this };
    },
    or: function(filters: string) {
      return { ...this };
    },
    filter: function(column: string, operator: string, value: any) {
      return { ...this };
    },
    
    // Result methods
    limit: function(count: number) {
      return { ...this };
    },
    range: function(from: number, to: number) {
      return { ...this };
    },
    single: function() {
      return Promise.resolve({ data: this.data ? this.data[0] : null, error: this.error });
    },
    maybeSingle: function() {
      return Promise.resolve({ data: this.data ? this.data[0] : null, error: this.error });
    },
    order: function(column: string, options?: { ascending?: boolean }) {
      return { ...this };
    },
    select: function(columns: string = '*') {
      return { ...this };
    },
    count: function(options?: { exact?: boolean }) {
      return Promise.resolve({ data: 0, error: null, count: 0 });
    },
  };

  return chainMethods;
};

// Create the mock supabase client
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => {
      return createChainablePromise([]);
    },
    insert: (data: any) => {
      return Promise.resolve({ data, error: null });
    },
    update: (data: any) => {
      return Promise.resolve({ data, error: null });
    },
    upsert: (data: any, options?: any) => {
      return Promise.resolve({ data, error: null });
    },
    delete: () => {
      return Promise.resolve({ data: null, error: null });
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
          data: { path: paths },
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
  }
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
