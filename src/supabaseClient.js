import { createClient } from '@supabase/supabase-js'

// Les clés sont lues depuis les variables d'environnement (fichier .env).
// On n'utilise QUE la clé publishable / anon côté front. Jamais la clé secrète.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null
