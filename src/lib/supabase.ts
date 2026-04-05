import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both standard and Vercel integration env var names
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Chainable no-op proxy for build-time / missing env vars
function createNoopChain(): any {
  const result = { data: [], error: null, count: null, status: 200, statusText: 'OK' };
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'then') {
        return (resolve: any) => resolve(result);
      }
      if (prop === 'catch' || prop === 'finally') {
        return () => Promise.resolve(result);
      }
      return (..._args: any[]) => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
}

function createSafeClient(url: string, key: string): SupabaseClient {
  if (!url || !key) {
    return new Proxy({} as SupabaseClient, {
      get(_target, prop) {
        if (prop === 'from' || prop === 'rpc' || prop === 'storage' || prop === 'auth') {
          return (..._args: any[]) => createNoopChain();
        }
        return (..._args: any[]) => createNoopChain();
      },
    });
  }
  return createClient(url, key);
}

// Browser client (uses anon key)
export const supabase = createSafeClient(supabaseUrl, supabaseAnonKey);

// Server client with service role (for API routes)
export const supabaseAdmin = createSafeClient(supabaseUrl, supabaseServiceKey);
