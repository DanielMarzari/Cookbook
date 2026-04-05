import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create clients only when URL is available (prevents build-time crashes)
function createSafeClient(url: string, key: string): SupabaseClient {
  if (!url || !key) {
    // Return a proxy that won't crash during static generation
    return new Proxy({} as SupabaseClient, {
      get: (_target, prop) => {
        if (prop === 'from') {
          return () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ data: null, error: null }),
            update: () => Promise.resolve({ data: null, error: null }),
            delete: () => Promise.resolve({ data: null, error: null }),
            upsert: () => Promise.resolve({ data: null, error: null }),
          });
        }
        if (prop === 'rpc') {
          return () => Promise.resolve({ data: null, error: null });
        }
        return () => {};
      },
    });
  }
  return createClient(url, key);
}

// Browser client
export const supabase = createSafeClient(supabaseUrl, supabaseAnonKey);

// Server client with service role (for server-side operations)
export const supabaseAdmin = createSafeClient(supabaseUrl, supabaseServiceKey);
