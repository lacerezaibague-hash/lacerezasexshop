import { createClient } from '@supabase/supabase-js';

// Access credentials from environment variables injected by Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Flag to check if configuration is present
export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));

if (!isSupabaseConfigured) {
    console.warn("⚠️ Supabase credentials missing or invalid. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your Netlify Environment Variables.");
}

// Create client only if keys are present, otherwise create a dummy client that warns on use
// This prevents the app from crashing entirely on load if keys are missing.
export const supabase = isSupabaseConfigured 
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : createClient("https://placeholder.supabase.co", "placeholder");
