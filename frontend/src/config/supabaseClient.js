import { createClient } from '@supabase/supabase-js';

// Vercel auto-injects SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL
// Custom Vite envs use VITE_SUPABASE_URL
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
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

if (isSupabaseConfigured) {
  console.log('⚡ Supabase client initialized with endpoint:', supabaseUrl);
} else {
  console.log('ℹ️ Supabase not configured in client environment. Using hybrid/local fallback.');
}
