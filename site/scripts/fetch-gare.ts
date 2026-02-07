import * as cheerio from "cheerio";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Fonte = "Calendario Podismo" | "US Nave";

type Gara = {
  data: string;
  nome: string;
  distanza: number;
  tipo: "Trail" | "Strada";
  localita: string;
  mese: number;
  fonti: Fonte[];
};

type GareData = {
  ultimoAggiornamento: string;
  gare: Gara[];
};

const DATA_FILE = join(__dirname, "../src/data/gare.json");

// Finestra di 3 mesi: mese corrente + prossimi 2
function getMesiTarget(): number[] {
  const now = new Date();
  const meseCorrente = now.getMonth() + 1; // 1-12
  return [0, 1, 2].map((offset) => ((meseCorrente - 1 + offset) % 12) + 1);
}

const MESI_TARGET = getMesiTarget();

const MESI_MAP: Record<string, number> = {
  "01": 1, "02": 2, "03": 3, "04": 4, "05": 5, "06": 6,
  "07": 7, "08": 8, "09": 9, "10": 10, "11": 11, "12": 12,
};

const MESI_SHORT: Record<number, string> = {
  1: "gen", 2: "feb", 3: "mar", 4: "apr", 5: "mag", 6: "giu",
  7: "lug", 8: "ago", 9: "set", 10: "ott", 11: "nov", 12: "dic",
};

const TRAIL_KEYWORDS = ["trail", "ultra", "skyrace", "ecomaratona", "ecotrail", "crossing"];

function detectTipo(nome: string): "Trail" | "Strada" {
  const lower = nome.toLowerCase();
  return TRAIL_KEYWORDS.some((kw) => lower.includes(kw)) ? "Trail" : "Strada";
}

function formatData(giorno: number, mese: number): string {
  return `${giorno} ${MESI_SHORT[mese]}`;
}

function loadExistingData(): GareData {
  try {
    const raw = readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { ultimoAggiornamento: "", gare: [] };
  }
}

// --- Scraper Calendario Podismo Toscana ---
async function fetchCalendarioPodismo(): Promise<Gara[]> {
  const url = "https://www.calendariopodismo.it/regione/toscana";
  console.log(`[CalendarioPodismo] Fetching ${url}...`);

  const res = await fetch(url, {
    headers: { "User-Agent": "ActivityPlan2026/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const html = await res.text();
  const $ = cheerio.load(html);
  const gare: Gara[] = [];

  $(".gara").each((_, el) => {
    try {
      const dataText = $(el).find(".css-giorno").text().trim(); // "08/02"
      if (!dataText) return;

      const [giorno, meseStr] = dataText.split("/");
      const mese = MESI_MAP[meseStr];
      if (!mese || !MESI_TARGET.includes(mese)) return;

      const nome = $(el).find(".gara-titolo a").text().trim();
      if (!nome) return;

      const localitaDistanza = $(el).find(".gara-localita").text().trim();
      // Format: "Firenze (Fi) / 5 km" or "Montalcino (Si) / 45 km"
      const parts = localitaDistanza.split("/");
      const localita = (parts[0] || "").replace(/\s*\([^)]*\)\s*$/, "").trim();

      let distanza = 0;
      const distMatch = localitaDistanza.match(/(\d+(?:[.,]\d+)?)\s*km/i);
      if (distMatch) {
        distanza = Math.round(parseFloat(distMatch[1].replace(",", ".")));
      }
      if (distanza === 0) return;

      gare.push({
        data: formatData(parseInt(giorno), mese),
        nome,
        distanza,
        tipo: detectTipo(nome),
        localita: localita || "Toscana",
        mese,
        fonti: ["Calendario Podismo"],
      });
    } catch {
      // Ignora gare con dati malformati
    }
  });

  console.log(`[CalendarioPodismo] Trovate ${gare.length} gare`);
  return gare;
}

// --- Scraper US Nave ---
async function fetchUSNave(): Promise<Gara[]> {
  const url = "https://usnave.it/gare.aspx";
  console.log(`[USNave] Fetching ${url}...`);

  const res = await fetch(url, {
    headers: { "User-Agent": "ActivityPlan2026/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const html = await res.text();
  const $ = cheerio.load(html);
  const gare: Gara[] = [];

  const MESI_IT: Record<string, number> = {
    gennaio: 1, febbraio: 2, marzo: 3, aprile: 4, maggio: 5, giugno: 6,
    luglio: 7, agosto: 8, settembre: 9, ottobre: 10, novembre: 11, dicembre: 12,
  };

  // US Nave usa una struttura semplice con testo e link
  // Cerchiamo pattern di date nel formato "DD mese YYYY"
  const bodyText = $("body").html() || "";
  const datePattern = /(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+2026/gi;

  let match;
  const datePositions: { giorno: number; mese: number; index: number }[] = [];
  while ((match = datePattern.exec(bodyText)) !== null) {
    datePositions.push({
      giorno: parseInt(match[1]),
      mese: MESI_IT[match[2].toLowerCase()],
      index: match.index,
    });
  }

  // Per ogni data trovata, cerca il link alla gara più vicino
  $('a[href*="gara.aspx?"]').each((_, el) => {
    try {
      const nome = $(el).text().trim();
      if (!nome || nome.length < 3) return;

      // Risali al contenitore per trovare la data
      const parentHtml = $(el).parent().html() || "";
      const localDateMatch = parentHtml.match(
        /(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+2026/i
      );

      if (!localDateMatch) return;
      const giorno = parseInt(localDateMatch[1]);
      const mese = MESI_IT[localDateMatch[2].toLowerCase()];
      if (!mese || !MESI_TARGET.includes(mese)) return;

      // Cerca distanza nel nome o nel testo circostante
      let distanza = 0;
      const distMatch = parentHtml.match(/(\d+(?:[.,]\d+)?)\s*km/i);
      if (distMatch) {
        distanza = Math.round(parseFloat(distMatch[1].replace(",", ".")));
      }

      // Per mezze maratone senza km espliciti
      if (distanza === 0 && /mezza\s*marat|half\s*marat/i.test(nome)) {
        distanza = 21;
      }
      if (distanza === 0 && /marat/i.test(nome) && !/mezza|half|mini/i.test(nome)) {
        distanza = 42;
      }
      // Se non troviamo la distanza, skippiamo
      if (distanza === 0) return;

      // Cerca località
      const locMatch = parentHtml.match(/(?:a|presso|–|-)\s+([A-Z][a-zà-ú]+(?:\s+[a-zà-ú]+)*)/);
      const localita = locMatch ? locMatch[1].trim() : "";

      gare.push({
        data: formatData(giorno, mese),
        nome,
        distanza,
        tipo: detectTipo(nome),
        localita: localita || "Toscana",
        mese,
        fonti: ["US Nave"],
      });
    } catch {
      // Ignora gare con dati malformati
    }
  });

  console.log(`[USNave] Trovate ${gare.length} gare`);
  return gare;
}

// --- Merge & Dedup ---
function mergeGare(sources: Gara[][]): Gara[] {
  const merged = new Map<string, Gara>();

  for (const gare of sources) {
    for (const gara of gare) {
      // Chiave di dedup: data + nome normalizzato
      const nomeNorm = gara.nome.toLowerCase().replace(/[^a-zà-ú0-9]/g, "");
      const key = `${gara.data}-${nomeNorm}`;

      // Prova anche un match più lasco per gare con nomi leggermente diversi
      const existing = merged.get(key);
      if (existing) {
        // Unisci le fonti
        for (const f of gara.fonti) {
          if (!existing.fonti.includes(f)) {
            existing.fonti.push(f);
          }
        }
      } else {
        // Cerca match per data + località simile
        let found = false;
        for (const [, ex] of merged) {
          if (
            ex.data === gara.data &&
            ex.localita.toLowerCase() === gara.localita.toLowerCase() &&
            (ex.nome.toLowerCase().includes(nomeNorm.slice(0, 8)) ||
              nomeNorm.includes(ex.nome.toLowerCase().replace(/[^a-zà-ú0-9]/g, "").slice(0, 8)))
          ) {
            for (const f of gara.fonti) {
              if (!ex.fonti.includes(f)) ex.fonti.push(f);
            }
            found = true;
            break;
          }
        }
        if (!found) {
          merged.set(key, { ...gara });
        }
      }
    }
  }

  return Array.from(merged.values()).sort((a, b) => {
    if (a.mese !== b.mese) return a.mese - b.mese;
    const dayA = parseInt(a.data);
    const dayB = parseInt(b.data);
    return dayA - dayB;
  });
}

// --- Main ---
async function main() {
  console.log("=== Aggiornamento dati gare ===");
  console.log(`Data: ${new Date().toISOString()}`);
  const mesiNomi = ["", "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  console.log(`Mesi target: ${MESI_TARGET.map((m) => mesiNomi[m]).join(", ")}\n`);

  const existing = loadExistingData();
  // Filtra i dati esistenti ai soli mesi target
  const existingBySource: Record<Fonte, Gara[]> = {
    "Calendario Podismo": existing.gare.filter((g) => g.fonti.includes("Calendario Podismo") && MESI_TARGET.includes(g.mese)),
    "US Nave": existing.gare.filter((g) => g.fonti.includes("US Nave") && MESI_TARGET.includes(g.mese)),
  };

  const sources: Gara[][] = [];

  // Fetch Calendario Podismo
  try {
    const cp = await fetchCalendarioPodismo();
    sources.push(cp.length > 0 ? cp : existingBySource["Calendario Podismo"]);
    if (cp.length === 0) {
      console.warn("[CalendarioPodismo] Nessuna gara trovata, uso dati precedenti");
    }
  } catch (err) {
    console.error(`[CalendarioPodismo] Errore: ${err}`);
    console.log("[CalendarioPodismo] Uso dati precedenti");
    sources.push(existingBySource["Calendario Podismo"]);
  }

  // Fetch US Nave
  try {
    const usn = await fetchUSNave();
    sources.push(usn.length > 0 ? usn : existingBySource["US Nave"]);
    if (usn.length === 0) {
      console.warn("[USNave] Nessuna gara trovata, uso dati precedenti");
    }
  } catch (err) {
    console.error(`[USNave] Errore: ${err}`);
    console.log("[USNave] Uso dati precedenti");
    sources.push(existingBySource["US Nave"]);
  }

  const merged = mergeGare(sources);

  const output: GareData = {
    ultimoAggiornamento: new Date().toISOString(),
    gare: merged,
  };

  writeFileSync(DATA_FILE, JSON.stringify(output, null, 2) + "\n");
  console.log(`\nSalvate ${merged.length} gare in ${DATA_FILE}`);
  console.log(`Ultimo aggiornamento: ${output.ultimoAggiornamento}`);
}

main().catch((err) => {
  console.error("Errore fatale:", err);
  process.exit(1);
});
