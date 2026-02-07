import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MESI_SHORT_TO_NUM: Record<string, number> = {
  gen: 1, feb: 2, mar: 3, apr: 4, mag: 5, giu: 6,
  lug: 7, ago: 8, set: 9, ott: 10, nov: 11, dic: 12,
};

/**
 * Converte "8 feb" + anno in una Date
 */
function parseDataGara(data: string, anno: number): Date | null {
  const parts = data.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const giorno = parseInt(parts[0]);
  const mese = MESI_SHORT_TO_NUM[parts[1].toLowerCase()];
  if (!giorno || !mese) return null;
  return new Date(anno, mese - 1, giorno);
}

async function main() {
  console.log("=== Cleanup gare vecchie ===");
  console.log(`Data: ${new Date().toISOString()}\n`);

  const now = new Date();
  const anno = now.getFullYear();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 7);
  console.log(`Cutoff: gare prima del ${cutoff.toLocaleDateString("it-IT")}`);

  // 1. Carica tutte le gare
  const { data: gare, error: gareError } = await supabase
    .from("gare")
    .select("id, data, nome, mese");

  if (gareError) {
    console.error("Errore caricamento gare:", gareError.message);
    process.exit(1);
  }

  if (!gare || gare.length === 0) {
    console.log("Nessuna gara trovata. Nulla da fare.");
    return;
  }

  console.log(`Gare totali in DB: ${gare.length}`);

  // 2. Carica tutte le user_gare (gare salvate dagli utenti)
  const { data: userGare, error: ugError } = await supabase
    .from("user_gare")
    .select("gara_nome, gara_data");

  if (ugError) {
    console.error("Errore caricamento user_gare:", ugError.message);
    process.exit(1);
  }

  // Crea un Set di chiavi "nome::data" per lookup veloce
  const savedKeys = new Set(
    (userGare ?? []).map((ug) => `${ug.gara_nome}::${ug.gara_data}`)
  );
  console.log(`Gare salvate dagli utenti: ${savedKeys.size}`);

  // 3. Trova gare vecchie (> 1 settimana) e non referenziate in user_gare
  const idsDaEliminare: number[] = [];

  for (const gara of gare) {
    const dataGara = parseDataGara(gara.data, anno);
    if (!dataGara) continue;

    // La gara è passata da più di 7 giorni?
    if (dataGara >= cutoff) continue;

    // La gara è referenziata da un utente?
    const key = `${gara.nome}::${gara.data}`;
    if (savedKeys.has(key)) continue;

    idsDaEliminare.push(gara.id);
  }

  console.log(`\nGare da eliminare: ${idsDaEliminare.length}`);

  if (idsDaEliminare.length === 0) {
    console.log("Nessuna gara da eliminare.");
    return;
  }

  // 4. Elimina in batch da 100
  const BATCH_SIZE = 100;
  let eliminati = 0;

  for (let i = 0; i < idsDaEliminare.length; i += BATCH_SIZE) {
    const batch = idsDaEliminare.slice(i, i + BATCH_SIZE);
    const { error: delError, count } = await supabase
      .from("gare")
      .delete()
      .in("id", batch);

    if (delError) {
      console.error(`Errore eliminazione batch ${i / BATCH_SIZE + 1}:`, delError.message);
    } else {
      eliminati += count ?? batch.length;
    }
  }

  console.log(`Eliminate ${eliminati} gare vecchie non referenziate.`);
  console.log("Cleanup completato.");
}

main().catch((err) => {
  console.error("Errore fatale:", err);
  process.exit(1);
});
