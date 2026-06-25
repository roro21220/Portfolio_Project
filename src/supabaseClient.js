import { createClient } from '@supabase/supabase-js'

// Les clés sont lues depuis les variables d'environnement (fichier .env en local,
// ou variables d'environnement Vercel en production).
// On n'utilise QUE la clé publishable / anon côté front. Jamais la clé secrète.
const url = import.meta.env.VITE_SUPABASE_URL
const key =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
