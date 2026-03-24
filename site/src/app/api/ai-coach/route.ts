import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL_PRIMARY = "llama-3.3-70b-versatile";
const GROQ_MODEL_FALLBACK = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `Sei un AI Coach esperto di running, ultra-trail e nutrizione plant-based.
Rispondi in italiano (o nella lingua dell'utente se scrive in inglese).
Basa le tue risposte sulla knowledge base fornita qui sotto. Se la domanda non è coperta dalla KB, rispondi comunque con le tue conoscenze generali ma specificalo.
Sii conciso, pratico e amichevole. Usa elenchi puntati quando utile.
Non inventare dati specifici (tempi, distanze, calorie) se non sei sicuro.
I libri di riferimento sono: "The Plant-Based Athlete" (Matt Frazier & Robert Cheeke), "Eat & Run" (Scott Jurek), "Finding Ultra" (Rich Roll), "Andiamo a correre" (Fulvio Massini).`;

type KBEntry = { categoria: string; domande: string[]; risposta: string; fonte: string };

// 70B ha context window più grande: risposte fino a 300 char
function buildKBFull(kb: KBEntry[]): string {
  const grouped: Record<string, string[]> = {};
  for (const entry of kb) {
    const cat = entry.categoria;
    if (!grouped[cat]) grouped[cat] = [];
    const answer = entry.risposta.length > 300 ? entry.risposta.slice(0, 300) + "..." : entry.risposta;
    grouped[cat].push(`- ${entry.domande[0]}: ${answer} [${entry.fonte}]`);
  }
  return Object.entries(grouped)
    .map(([cat, entries]) => `## ${cat}\n${entries.join("\n")}`)
    .join("\n");
}

// 8B ha context window più piccolo: risposte troncate a 150 char
function buildKBCompact(kb: KBEntry[]): string {
  const grouped: Record<string, string[]> = {};
  for (const entry of kb) {
    const cat = entry.categoria;
    if (!grouped[cat]) grouped[cat] = [];
    const answer = entry.risposta.length > 150 ? entry.risposta.slice(0, 150) + "..." : entry.risposta;
    grouped[cat].push(`- ${entry.domande[0]}: ${answer}`);
  }
  return Object.entries(grouped)
    .map(([cat, entries]) => `## ${cat}\n${entries.join("\n")}`)
    .join("\n");
}

function buildMessages(
  systemContent: string,
  userMessages: { role: string; content: string }[],
  maxHistory: number
) {
  return [
    { role: "system", content: systemContent },
    ...userMessages.slice(-maxHistory).map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];
}

export async function POST(req: NextRequest) {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return Response.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
  }

  const { messages } = await req.json();
  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: "messages array required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: kb } = await supabase
    .from("ai_knowledge_base")
    .select("categoria, domande, risposta, fonte")
    .order("ordine");

  const kbEntries = (kb || []) as KBEntry[];

  const callGroq = async (model: string, msgs: { role: string; content: string }[]) => {
    return fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: msgs,
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      }),
    });
  };

  // Try 70B with full KB and 10 messages of history
  const kbFull = buildKBFull(kbEntries);
  const msgs70B = buildMessages(
    `${SYSTEM_PROMPT}\n\n--- KNOWLEDGE BASE ---\n${kbFull}`,
    messages,
    10
  );
  let response = await callGroq(GROQ_MODEL_PRIMARY, msgs70B);

  // Fallback to 8B with compact KB and 6 messages of history
  if (!response.ok && (response.status === 429 || response.status === 413 || response.status >= 500)) {
    const kbCompact = buildKBCompact(kbEntries);
    const msgs8B = buildMessages(
      `${SYSTEM_PROMPT}\n\n--- KB ---\n${kbCompact}`,
      messages,
      6
    );
    response = await callGroq(GROQ_MODEL_FALLBACK, msgs8B);
  }

  if (!response.ok) {
    if (response.status === 429) {
      return Response.json(
        { error: "Troppe richieste. Riprova tra qualche secondo." },
        { status: 429 }
      );
    }
    const err = await response.text();
    return Response.json(
      { error: `Groq API error: ${response.status}`, details: err },
      { status: response.status }
    );
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
