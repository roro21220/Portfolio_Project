import { createClient } from '@supabase/supabase-js'

// Keys come from environment variables (.env locally, Vercel env vars in production).
// Only the publishable / anon key is used on the front end. Never the secret key.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key ? createClient(url, key) : null
