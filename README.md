# Romain Aubert — Portfolio (React + Supabase)

Portfolio repositionné autour du rôle **builder / développement assisté par IA** (conseil en construction d'outils métier sur-mesure). Front React (Vite), backend Supabase pour le formulaire de contact, CV en téléchargement.

## Stack
- **Front** : React 18 + Vite
- **Backend** : Supabase (table `contacts`, RLS insert-only anonyme)
- **Déploiement** : Netlify ou Vercel (config Netlify incluse)

## Lancer en local
```bash
npm install
cp .env.example .env   # puis colle tes clés Supabase
npm run dev
```

## Configurer Supabase (5 min)
1. Dashboard Supabase > **SQL Editor** > colle le contenu de `supabase_setup.sql` > **Run**.
   Ça crée la table `contacts` et la policy qui autorise UNIQUEMENT l'insertion anonyme.
2. Dashboard > **Project Settings > API** (ou **API Keys**) : copie l'**URL** du projet et la
   clé **publishable / anon**.
3. Colle-les dans `.env` :
   ```
   VITE_SUPABASE_URL=https://bgjayhdkoglzulskrctj.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_xxx...
   ```

> ⚠️ **Sécurité** : n'utilise QUE la clé *publishable / anon* côté front. Ne mets JAMAIS la clé
> *secret* (`sb_secret_...`) dans ce projet ni dans le repo — elle donne un accès admin total.
> Les messages reçus se lisent depuis le **Table editor** du Dashboard (protégé par ton login).

## Déployer
- **Netlify** : connecte le repo, build `npm run build`, publish `dist`.
  Ajoute `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans *Site settings > Environment variables*.
- **Vercel** : framework Vite détecté automatiquement. Mêmes variables d'env.

## Remplacer le CV
Dépose ton PDF dans `public/cv_romain_aubert.pdf` (garde ce nom, ou adapte `CV_FILE` dans `src/App.jsx`).

## Phase 2 — Assistant IA sur le profil
Prévu : un chatbot qui répond aux questions sur le profil / la personnalité de Romain.
Le point d'insertion est déjà préparé dans la section `Contact` de `src/App.jsx`.
Architecture cible : Supabase Edge Function (clé LLM gardée côté serveur) + RAG sur un corpus
profil (CV, projets, bio). Le front appellera l'Edge Function, jamais l'API LLM directement.
```

## Structure
```
public/            CV + images
src/App.jsx        page unique (sections + formulaire)
src/index.css      styles
src/supabaseClient.js  client Supabase (clés via env)
supabase_setup.sql     schéma + RLS
```
