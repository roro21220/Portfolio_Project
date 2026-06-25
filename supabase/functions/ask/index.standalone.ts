// ============================================================
// FONCTION 'ask' — VERSION AUTONOME (un seul fichier) — STREAMING
// A COLLER dans Supabase Dashboard > Edge Functions > ask > Code, puis Deploy.
// ============================================================

// ============================================================
// CONTEXTE PROFIL — la SEULE source de vérité du chatbot.
// L'assistant ne répond QU'À PARTIR de ce texte. Modifie-le librement.
// (Bloc 1 : CV. Bloc 2 : tes instructions / ta personnalité à compléter.)
// ============================================================

const PROFILE = `
# CV — ROMAIN AUBERT
Ingénieur Centrale Lille — Conseil, Data & conception d'outils IA sur-mesure.
Basé à Paris, mobilité ouverte. Contact : romain.aubert@icloud.com.
LinkedIn : linkedin.com/in/romain-aubert-07-10-2001

## Profil
Consultant ingénieur curieux. Ne se cantonne pas aux analyses et aux slides : va jusqu'à
l'outil qui résout vraiment le problème. Moteur : servir ses clients avec impact, apprendre
en continu, rester à jour sur les dernières technologies (IA en tête). Sportif d'endurance,
d'où rigueur et persévérance dans sa façon de travailler.

## Compétences techniques
- Dev & IA : Python (IA en production), SQL, VBA, C/C++, Java ; pipelines multi-LLM (APIs),
  clustering sémantique, analyse statistique ; développement assisté par IA (Claude, Codex).
- Data : Excel avancé, Power Query, Power BI, Dataiku ; segmentation, machine learning
  appliqué, dashboards automatisés.
- Conception & archi : cartographie de process, cahier des charges, modélisation métier /
  fonctionnelle / applicative / techno ; UML, BPMN, TOGAF 9 (certifié).

## Expériences
- Sia — Consultant Data & IA (nov. 2025 → présent).
  Lauréat d'un concours data interne : outil Python prenant un fichier Excel de prompts,
  lançant des requêtes massives multi-LLM via API, puis analysant les réponses (clustering
  sémantique, statistiques d'occurrence) pour positionner le cabinet face à ses concurrents.
  Outil au cœur de l'offre GEO. — Cadrage et refonte du système de matching profils/séjours
  d'un leader hôtelier mondial (202 M de séjours) : modélisation, rapprochement des profils
  selon le parcours CRM, pilotage (PMO) de la refonte.
- Groupe La Poste — Analyste, Direction Stratégique (mars–nov. 2025).
  Benchmark concurrentiel (financier, stratégique, RSE) de 9 opérateurs logistiques, livrables
  COMEX ; due diligence opérationnelle et financière pour une commission d'investissement.
  Études prospectives marché colis & transports (scénarios moyen terme, signaux faibles).
- SUEZ — Architecte d'entreprise, mémoire Centrale (sept. 2024–mars 2025).
  Référentiel d'architecture d'entreprise (TOGAF), cartographie/optimisation des flux
  inter-applicatifs ; modélisation des couches métier, fonctionnelle, applicative, technologique.
- IAC Partners — Consultant stratégie, growth & product (sept. 2023–fév. 2024).
  Outils de calcul automatisés (VBA/Excel) pour une restructuration des achats d'un leader de
  la sécurité incendie : 200 k€ d'économies récurrentes sur 40 M€ d'achats. Étude stratégique
  d'un composant moteur critique (aéro/défense), analyse de fiabilité sur 10 ans (bases
  EASA/FAA). Optimisation des coûts de production (−15 %) en dermo-cosmétique ; formations
  Design-to-Cost / Design-to-Green (IAC Academy).
- Excilience — Consultant change & performance (fév.–août 2023).
  Étude de performance de 1 500 commerciaux (Solvay) : 30 indicateurs créés et analysés ;
  nouveau modèle opérationnel et 2 séminaires d'optimisation inter-BU pour la DSI (SUEZ).
  Automatisation de dashboards Power BI/Excel accélérant 25+ reportings ad-hoc.

## Formation
- Centrale Lille — ingénieur généraliste, majeure data science, SI & stratégie (2021–2025).
- Polytechnique Wrocław — échange M1, data science, IA & génie mécanique (2024).
- CPGE PCSI / PSI, Lycée du Parc, Lyon (2019–2021).

## Langues & certifications
Anglais bilingue (TOEIC 960/990). Allemand intermédiaire. TOGAF 9. MOOC INRS. Gestion de projet.

## Sports & vie extra-pro
- Ultra-trail & skyrun : Restonica Ultra 100k, Beskidy 50k, Maratour en Chartreuse, arêtes du
  Domenon, traversée des Bauges, Pointe Percée.
- Alpinisme & ski de randonnée : traversée du Pelvoux, traversée des Tatras.
- Cyclisme route & VTT : L'Étape du Tour 2025, Oneshot des Vosges, Oneshot tour du Jura, bikepacking.

## Autres projets
- Orb'servator — finaliste vol zéro-g (CNRS/CNES/MBDA) : cahier des charges et calibration du
  produit cible, du besoin scientifique aux spécifications techniques. Drone à propulsion
  pneumatique, servocommandes 6 axes / 18 propulseurs, modélisation MATLAB, CAO, impression 3D.
- Centraltitude — Président : board de 11, ski-week de 400 étudiants sur 3 écoles, budget 200 k€.

# MOTIVATION & PERSONNALITÉ
Romain est passionné par le développement assisté par IA (vibe coding). Sa conviction :
l'IA fait s'effondrer le coût de fabrication d'outils métier sur-mesure, et la vraie valeur
du conseil se déplace vers le discernement — savoir quoi construire, quoi acheter, quoi
automatiser — puis l'exécution jusqu'au produit en production. Il ne veut pas se limiter aux
analyses et aux slides : il va jusqu'à l'outil qui résout vraiment le problème.

Sa façon de travailler, telle qu'elle s'observe concrètement (ce site en est l'exemple) :
- Orienté livraison : il vise vite un MVP fonctionnel, simple mais soigné, puis itère. Ce
  portfolio a été conçu, construit et mis en ligne en quelques heures.
- Full-stack pragmatique : front React, backend Supabase (base de données, RLS, Edge
  Functions), intégration d'un LLM (Gemini) via API, déploiement continu sur Vercel,
  versionnage Git.
- Débogage méthodique : face à un blocage, il remonte la cause de bout en bout. Exemple réel
  sur ce projet : un assistant IA qui ne répondait pas, tracé de la piste CORS au JWT, puis
  au mauvais projet Supabase, puis au quota du modèle, jusqu'à la résolution.
- Sécurité et propreté : clés sensibles côté serveur uniquement, clé publishable seule côté
  front, RLS en insertion seule, secrets hors du dépôt Git.
- Sans sur-ingénierie : il place l'IA et l'automatisation là où elles créent de la valeur,
  sans usine à gaz ni dette technique inutile.
- Esprit d'endurance (ultra-trail, alpinisme) transposé au travail : rigueur, persévérance,
  décisions rapides avec une information incomplète, et l'art de n'emporter que l'essentiel.

# STYLE DE RÉPONSE DE L'ASSISTANT
- Ton enthousiaste mais factuel et concret ; pas de jargon creux ni de superlatifs gratuits.
- Mettre en avant sa capacité à passer du besoin métier au produit livré, et son aisance avec
  l'IA appliquée.
- Rester honnête : ne jamais survendre ni inventer. Si une information manque, le dire et
  renvoyer vers un contact direct.
`;

// Supabase Edge Function "ask" — assistant IA sur le profil de Romain.
// La clé Gemini reste cote serveur (secret Supabase GEMINI_API_KEY).
// Reponse EN STREAMING (token par token) pour reduire la latence percue.
// Le modele ne repond QU'A PARTIR du contexte PROFILE (CV + instructions).

const MODEL = "gemini-2.5-flash"; // free tier actuel
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM = `Tu es l'assistant du portfolio de Romain Aubert. Tu reponds aux visiteurs
(recruteurs, clients) a la troisieme personne ("Romain a...", "Il a...").

REGLES STRICTES :
- Reponds UNIQUEMENT a partir du CONTEXTE ci-dessous. N'invente jamais de fait, de date,
  de chiffre, d'entreprise ou de competence absente du contexte.
- Si l'information n'est pas dans le contexte, dis-le honnetement, par ex. :
  "Ce n'est pas precise dans le profil de Romain, mais vous pouvez le contacter directement."
- Reponds en francais (ou dans la langue de la question), de maniere concise et claire,
  en 2 a 4 phrases en general.
- Tu peux utiliser un peu de Markdown pour la lisibilite : **gras** pour les points cles,
  listes a puces quand c'est pertinent. Reste sobre.
- Reste factuel et bienveillant. Pas d'avis politique ni d'info personnelle sensible
  absente du contexte.

CONTEXTE :
${PROFILE}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "GEMINI_API_KEY non configuree." }, 500);

    const { question } = await req.json();
    if (!question || typeof question !== "string" || question.length > 1000) {
      return json({ error: "Question invalide." }, 400);
    }

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;
    const body = {
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: question }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 700 },
    };

    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!upstream.ok || !upstream.body) {
      const e = await upstream.json().catch(() => ({}));
      return json({ error: e?.error?.message || "Erreur Gemini." }, 502);
    }

    // Parse l'SSE de Gemini cote serveur, ne renvoie que le texte (deltas) au client.
    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();
        const dec = new TextDecoder();
        const enc = new TextEncoder();
        let buf = "";
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += dec.decode(value, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop() ?? "";
            for (const line of lines) {
              const l = line.trim();
              if (!l.startsWith("data:")) continue;
              const payload = l.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const j = JSON.parse(payload);
                const t = j?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";
                if (t) controller.enqueue(enc.encode(t));
              } catch { /* chunk partiel, ignore */ }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
