
// This is an enhanced mock for the actual Supabase client implementation
// It provides all the methods needed for the application to function without errors

export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => {
      const baseResponse = {
        data: [],
        error: null,
        count: 0
      };
      
      const chainableMethods = {
        eq: (column: string, value: any) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
          single: () => Promise.resolve({ data: null, error: null }),
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
          then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
        }),
        neq: (column: string, value: any) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
          then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
        }),
        gt: (column: string, value: any) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        gte: (column: string, value: any) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        lt: (column: string, value: any) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        lte: (column: string, value: any) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        in: (column: string, values: any[]) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        is: (column: string, value: any) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        not: (column: string, value: any) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        or: (filter: string) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        order: (column: string, options?: { ascending?: boolean }) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        limit: (count: number) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        range: (from: number, to: number) => ({
          ...chainableMethods,
          ...baseResponse,
          data: [],
          error: null,
        }),
        count: (options?: { exact?: boolean }) => Promise.resolve({ data: 0, error: null, count: 0 }),
        then: (callback: any) => Promise.resolve({ data: [], error: null, count: 0 }).then(callback)
      };
      
      return {
        ...chainableMethods,
        ...baseResponse
      };
    },
    insert: (data: any) => {
      return {
        select: () => Promise.resolve({ data: null, error: null }),
        then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback)
      };
    },
    upsert: (data: any, options?: any) => {
      return {
        select: () => Promise.resolve({ data: null, error: null }),
        then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback)
      };
    },
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback)
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      in: (column: string, values: any[]) => Promise.resolve({ data: null, error: null }),
      then: (callback: any) => Promise.resolve({ data: null, error: null }).then(callback)
    }),
    count: (options?: { exact?: boolean }) => Promise.resolve({ data: 0, error: null }),
  }),
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => Promise.resolve({ data: { path }, error: null }),
      getPublicUrl: (path: string) => ({ 
        data: { publicUrl: `https://example.com/${path}` },
        publicUrl: `https://example.com/${path}` 
      }),
      list: (path: string, options?: any) => Promise.resolve({ data: [], error: null }),
    }),
  },
  auth: {
    signUp: (credentials: { email: string, password: string }) => 
      Promise.resolve({ data: null, error: null }),
    signIn: (credentials: { email: string, password: string }) => 
      Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: (email: string, options?: any) => Promise.resolve({ data: null, error: null }),
    updateUser: (data: any) => Promise.resolve({ data: null, error: null }),
    onAuthStateChange: (callback: () => void) => ({ data: { subscription: { unsubscribe: () => {} } } }),
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
  channel: (name: string) => ({
    on: (event: string, callback: () => void) => ({
      subscribe: () => {}
    })
  })
};

// Utility types for Supabase response patterns
export interface DatabaseResponse<T> {
  data: T | null;
  error: any | null;
}
