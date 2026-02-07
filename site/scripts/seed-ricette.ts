import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type RicettaJSON = {
  id: number;
  nome: string;
  categoria: string;
  tempoPreparazione: string;
  porzioni: number;
  calorie: number;
  proteine: number;
  carboidrati: number;
  grassi: number;
  fibre: number;
  ingredienti: { nome: string; quantita: string }[];
  tags: string[];
  istruzioni: string;
};

async function main() {
  console.log("=== Seed ricette su Supabase ===");

  const raw = readFileSync(join(__dirname, "../src/data/ricette.json"), "utf-8");
  const data = JSON.parse(raw) as { ricette: RicettaJSON[] };

  console.log(`Trovate ${data.ricette.length} ricette nel JSON`);

  // Mappa camelCase -> snake_case
  const rows = data.ricette.map((r) => ({
    nome: r.nome,
    categoria: r.categoria,
    tempo_preparazione: r.tempoPreparazione,
    porzioni: r.porzioni,
    calorie: r.calorie,
    proteine: r.proteine,
    carboidrati: r.carboidrati,
    grassi: r.grassi,
    fibre: r.fibre,
    ingredienti: r.ingredienti,
    tags: r.tags,
    istruzioni: r.istruzioni,
  }));

  // Pulisci tabella e reinserisci
  const { error: delError } = await supabase.from("ricette").delete().gte("id", 0);
  if (delError) {
    console.error("Errore pulizia tabella:", delError.message);
    process.exit(1);
  }

  const { error: insError, count } = await supabase
    .from("ricette")
    .insert(rows);

  if (insError) {
    console.error("Errore inserimento:", insError.message);
    process.exit(1);
  }

  console.log(`Inserite ${count ?? rows.length} ricette con successo`);
}

main().catch((err) => {
  console.error("Errore fatale:", err);
  process.exit(1);
});
