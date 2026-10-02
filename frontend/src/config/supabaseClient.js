import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  typeof supabaseUrl === 'string' &&
  typeof supabaseAnonKey === 'string' &&
  supabaseUrl.trim().startsWith('http') &&
  supabaseAnonKey.trim().length > 10 &&
  !supabaseUrl.includes('placeholder')
);

let client = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
      auth: {
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: typeof window !== 'undefined',
      },
    });
    console.log('⚡ Supabase client initialized with endpoint:', supabaseUrl);
  } catch (err) {
    console.warn('Could not initialize Supabase client:', err);
    client = null;
  }
} else {
  console.log('ℹ️ Supabase not configured in client environment. Using hybrid/local fallback.');
}

export const supabase = client;
