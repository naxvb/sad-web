// Standard Supabase browser client — anon key + Row Level Security (RLS).
// The anon key is safe to ship to the browser; protect data with RLS policies
// on each table, NOT by hiding the key. (This is intentionally the plain,
// idiomatic Supabase setup — not a custom server-side proxy.)
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Warn (don't throw): a missing key is a config mistake, not a runtime condition. The
  // placeholder fallback below keeps `createClient` from throwing at import time — so unit
  // tests (which mock the data layer) run without a real `.env`. Real requests still need
  // valid credentials from `.env`.
  console.warn('[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — copy .env.example to .env');
}

export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  anonKey ?? 'placeholder-anon-key',
);
