# Phase 2 — Assistant IA (chatbot sur le profil)

Section "Assistant IA" du site : le visiteur pose une question (à gauche), la réponse
s'affiche à droite. Réponse générée par **Gemini**, **uniquement** à partir du contexte
profil (CV + tes instructions). La clé API reste **côté serveur** dans une Supabase Edge
Function — jamais dans le front.

---

## ✅ Voie recommandée : tout depuis le navigateur (AUCUN Node requis)

Tu n'as pas Node installé → pas besoin. On déploie via le Dashboard Supabase, et le front
part via `git push` (Vercel build dans le cloud).

### 1. Créer la clé Gemini
https://aistudio.google.com/apikey → "Create API key" (gratuit). Copie-la.

### 2. Déployer la fonction depuis le Dashboard
1. Supabase Dashboard → projet → **Edge Functions** → **Create a new function**.
2. Nomme-la exactement **`ask`**.
3. Efface le code d'exemple, et colle TOUT le contenu du fichier
   `supabase/functions/ask/index.standalone.ts`.
4. **Deploy**.

### 3. Enregistrer la clé Gemini comme secret
Dashboard → **Edge Functions** → **Secrets** (ou Project Settings → Edge Functions) →
ajoute : nom `GEMINI_API_KEY`, valeur = ta clé. Save.
> La clé n'est jamais dans le code ni dans le front.

### 4. Si erreur 401 depuis le site
Dans les réglages de la fonction `ask`, désactive **Verify JWT** (toggle), puis redeploy.

### 5. Pousser le front
```powershell
git add .
git commit -m "Phase 2 : section assistant IA"
git push
```
Vercel redéploie. Teste la section "Assistant IA". Aucune variable d'env Vercel à ajouter.

### Mettre à jour les réponses du bot
Édite le bloc `PROFILE` directement dans l'éditeur de la fonction sur le Dashboard
(ou dans `index.standalone.ts` puis recolle), et redeploy. Le front ne bouge pas.

---

## Alternative : CLI (si tu installes Node un jour)
Avec Node + `npm i -g supabase` : `supabase login`, `supabase link --project-ref
zrlveuundxvnqbsoqmtm`, `supabase secrets set GEMINI_API_KEY=...`, `supabase functions
deploy ask`. Utilise alors les fichiers séparés `index.ts` + `profile.ts`.

## Modèle
`gemini-2.0-flash` par défaut (rapide, free tier). Changeable en haut du fichier (const MODEL).
