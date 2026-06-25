// Supabase Edge Function "ask" — assistant IA sur le profil de Romain.
// La clé Gemini reste cote serveur (secret Supabase GEMINI_API_KEY).
// Le modele ne repond QU'A PARTIR du contexte PROFILE (CV + instructions).
import { PROFILE } from "./profile.ts";

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
- Reponds en francais (ou dans la langue de la question), de maniere concise, claire et
  professionnelle. 1 a 4 phrases en general.
- Reste factuel et bienveillant. Ne donne pas d'avis politique, ni d'information personnelle
  sensible non presente dans le contexte.

CONTEXTE :
${PROFILE}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return json({ error: "GEMINI_API_KEY non configuree (supabase secrets set)." }, 500);
    }
    const { question } = await req.json();
    if (!question || typeof question !== "string" || question.length > 1000) {
      return json({ error: "Question invalide." }, 400);
    }

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    const body = {
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: question }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 700 },
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!r.ok) {
      return json({ error: data?.error?.message || "Erreur Gemini." }, 502);
    }
    const answer =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ??
      "Pas de reponse.";
    return json({ answer });
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
