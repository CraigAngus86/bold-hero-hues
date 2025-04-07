
// This is an enhanced mock for the actual Supabase client implementation
// It provides all the methods needed for the application to function without errors

export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: (column: string, options?: { ascending?: boolean }) => 
          Promise.resolve({ data: [], error: null }),
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
        range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
        or: (filter: string) => Promise.resolve({ data: [], error: null }),
        gte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        lte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        neq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        not: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        in: (column: string, values: any[]) => Promise.resolve({ data: [], error: null }),
        count: (options?: { exact?: boolean }) => Promise.resolve({ data: 0, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        data: null,
        error: null,
      }),
      order: (column: string, options?: { ascending?: boolean }) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
        range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
        or: (filter: string) => Promise.resolve({ data: [], error: null }),
        gte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        lte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        neq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        not: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        in: (column: string, values: any[]) => Promise.resolve({ data: [], error: null }),
      }),
      limit: (count: number) => Promise.resolve({ data: [], error: null }),
      range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
      or: (filter: string) => Promise.resolve({ data: [], error: null }),
      gte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      lte: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      neq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      not: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      in: (column: string, values: any[]) => Promise.resolve({ data: [], error: null }),
      count: (options?: { exact?: boolean }) => Promise.resolve({ data: 0, error: null }),
      data: null,
      error: null,
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    upsert: (data: any, options?: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      in: (column: string, values: any[]) => Promise.resolve({ data: null, error: null }),
    }),
    limit: (count: number) => Promise.resolve({ data: [], error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    data: null,
    error: null,
  }),
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => Promise.resolve({ data: { path }, error: null }),
      getPublicUrl: (path: string) => ({ publicUrl: `https://example.com/${path}`, data: { publicUrl: `https://example.com/${path}` } }),
      list: (path: string) => Promise.resolve({ data: [], error: null }),
    }),
  },
  auth: {
    signUp: (credentials: { email: string, password: string }) => 
      Promise.resolve({ data: null, error: null }),
    signIn: (credentials: { email: string, password: string }) => 
      Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback: () => void) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    resetPasswordForEmail: (email: string) => Promise.resolve({ data: null, error: null }),
    updateUser: (data: any) => Promise.resolve({ data: null, error: null }),
    admin: {
      listUsers: () => Promise.resolve({ data: [], error: null }),
      getUserById: (id: string) => Promise.resolve({ data: null, error: null }),
      createUser: (data: any) => Promise.resolve({ data: null, error: null }),
      updateUserById: (id: string, data: any) => Promise.resolve({ data: null, error: null }),
      deleteUser: (id: string) => Promise.resolve({ data: null, error: null }),
    }
  },
  functions: {
    invoke: (name: string, options?: { body?: any }) => Promise.resolve({ data: null, error: null }),
  },
};

// Utility types for Supabase response patterns
export interface DatabaseResponse<T> {
  data: T | null;
  error: any | null;
}
