// Supabase Edge Function "ask" — assistant IA sur le profil de Romain.
// La clé Gemini reste cote serveur (secret Supabase GEMINI_API_KEY).
// Reponse EN STREAMING (token par token) pour reduire la latence percue.
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
