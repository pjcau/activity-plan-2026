/**
 * Standalone health check per i provider di gare.
 * Non scrive nulla nel DB: solo fetch + parse, riporta esito per ciascuno.
 *
 * Uso:
 *   npm run test-providers          # esce 1 se almeno un provider non funziona
 *   npm run test-providers -- --warn # esce sempre 0, solo log
 */
import * as cheerio from "cheerio";

type Fonte = "Calendario Podismo" | "US Nave" | "TrailRunning.it";

interface ProviderResult {
  fonte: Fonte;
  url: string;
  ok: boolean;
  httpStatus: number | null;
  raceCount: number;
  trailCount: number;
  monthsCovered: number[];
  sample: { data: string; nome: string; localita: string; distanza: number }[];
  error: string | null;
}

const MESI_MAP: Record<string, number> = {
  "01": 1, "02": 2, "03": 3, "04": 4, "05": 5, "06": 6,
  "07": 7, "08": 8, "09": 9, "10": 10, "11": 11, "12": 12,
};
const MESI_IT: Record<string, number> = {
  gennaio: 1, febbraio: 2, marzo: 3, aprile: 4, maggio: 5, giugno: 6,
  luglio: 7, agosto: 8, settembre: 9, ottobre: 10, novembre: 11, dicembre: 12,
};
const MESI_IT_SHORT: Record<string, number> = {
  gen: 1, feb: 2, mar: 3, apr: 4, mag: 5, giu: 6,
  lug: 7, ago: 8, set: 9, ott: 10, nov: 11, dic: 12,
};

function getMesiTarget(): number[] {
  const now = new Date();
  const m = now.getMonth() + 1;
  return Array.from({ length: 4 }, (_, i) => ((m - 1 + i) % 12) + 1);
}

const MESI_TARGET = getMesiTarget();
const TRAIL_KEYWORDS = ["trail", "ultra", "skyrace", "ecomaratona", "ecotrail", "crossing"];

function isTrail(nome: string): boolean {
  const n = nome.toLowerCase();
  return TRAIL_KEYWORDS.some((k) => n.includes(k));
}

async function fetchHtml(
  url: string,
  ua = "ActivityPlan2026/1.0"
): Promise<{ html: string | null; status: number | null; error: string | null }> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": ua } });
    if (!res.ok) {
      return { html: null, status: res.status, error: `HTTP ${res.status}` };
    }
    return { html: await res.text(), status: res.status, error: null };
  } catch (err) {
    return { html: null, status: null, error: String(err) };
  }
}

// --- Provider: Calendario Podismo ---
async function checkCalendarioPodismo(): Promise<ProviderResult> {
  const fonte: Fonte = "Calendario Podismo";
  const result: ProviderResult = {
    fonte,
    url: "",
    ok: false,
    httpStatus: null,
    raceCount: 0,
    trailCount: 0,
    monthsCovered: [],
    sample: [],
    error: null,
  };
  const anno = new Date().getFullYear();
  const months = new Set<number>();
  const races: ProviderResult["sample"] = [];
  let lastStatus: number | null = null;

  for (const mese of MESI_TARGET) {
    const meseStr = String(mese).padStart(2, "0");
    const ultimoGiorno = new Date(anno, mese, 0).getDate();
    const url = `https://www.calendariopodismo.it/?da=${anno}-${meseStr}-01&a=${anno}-${meseStr}-${ultimoGiorno}&localita=toscana`;
    if (!result.url) result.url = url;

    const { html, status, error } = await fetchHtml(url);
    lastStatus = status;
    if (!html) {
      result.error = error;
      result.httpStatus = status;
      return result;
    }

    const $ = cheerio.load(html);
    $(".gara").each((_, el) => {
      const dataAttr = $(el).attr("data-data") || "";
      const parts = dataAttr.split("-");
      if (parts.length !== 3) return;
      const m = MESI_MAP[parts[1]];
      const giorno = String(parseInt(parts[2]));
      if (!m) return;

      const nome = $(el).find(".gara-titolo a").text().trim();
      if (!nome) return;

      const localitaDistanza = $(el).find(".gara-localita").text().trim();
      const localita = (localitaDistanza.split("/")[0] || "").replace(/\s*\([^)]*\)\s*$/, "").trim();
      const distMatch = localitaDistanza.match(/(\d+(?:[.,]\d+)?)\s*km/i);
      const distanza = distMatch ? Math.round(parseFloat(distMatch[1].replace(",", "."))) : 0;
      if (distanza === 0) return;

      months.add(m);
      if (races.length < 3 && isTrail(nome)) {
        races.push({ data: `${giorno}/${parts[1]}`, nome, localita, distanza });
      }
      result.raceCount += 1;
      if (isTrail(nome)) result.trailCount += 1;
    });
  }

  result.httpStatus = lastStatus;
  result.monthsCovered = [...months].sort((a, b) => a - b);
  result.sample = races;
  result.ok = result.raceCount > 0 && result.monthsCovered.length >= MESI_TARGET.length;
  if (!result.ok && !result.error) {
    result.error = result.raceCount === 0
      ? "Parser non ha trovato gare"
      : `Coprono solo ${result.monthsCovered.length}/${MESI_TARGET.length} mesi target`;
  }
  return result;
}

// --- Provider: US Nave ---
async function checkUSNave(): Promise<ProviderResult> {
  const fonte: Fonte = "US Nave";
  const url = "https://usnave.it/gare.aspx";
  const result: ProviderResult = {
    fonte, url, ok: false, httpStatus: null, raceCount: 0, trailCount: 0,
    monthsCovered: [], sample: [], error: null,
  };

  const { html, status, error } = await fetchHtml(url);
  result.httpStatus = status;
  if (!html) {
    result.error = error;
    return result;
  }

  const $ = cheerio.load(html);
  const months = new Set<number>();
  const races: ProviderResult["sample"] = [];

  $(".datagara").each((_, el) => {
    const txt = $(el).text().trim();
    const m = txt.match(/(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})/i);
    if (!m) return;
    const giorno = parseInt(m[1]);
    const mese = MESI_IT[m[2].toLowerCase()];
    if (!mese || !MESI_TARGET.includes(mese)) return;

    const container = $(el).closest(".row, .col-9, div[class*='col']").first();
    const nome = container.find(".desgara").text().trim().replace(/\s*-?\s*CHIUSURA ISCRIZIONI.*/i, "").trim();
    if (!nome) return;

    const luogo = container.find(".luogogara").text().trim();
    const localita = luogo.split(",")[0].trim() || "Toscana";

    const fullText = container.text();
    const distMatch = fullText.match(/(\d+(?:[.,]\d+)?)\s*km/i);
    let distanza = distMatch ? Math.round(parseFloat(distMatch[1].replace(",", "."))) : 0;
    if (distanza === 0 && /maratonina|mezza\s*marat/i.test(nome)) distanza = 21;
    if (distanza === 0 && /marat/i.test(nome) && !/mezza|mini/i.test(nome)) distanza = 42;
    if (distanza === 0) return;

    months.add(mese);
    if (races.length < 3) races.push({ data: `${giorno}/${String(mese).padStart(2, "0")}`, nome, localita, distanza });
    result.raceCount += 1;
    if (isTrail(nome)) result.trailCount += 1;
  });

  result.monthsCovered = [...months].sort((a, b) => a - b);
  result.sample = races;
  result.ok = result.raceCount > 0;
  if (!result.ok) result.error = "Parser non ha trovato gare nei mesi target";
  return result;
}

// --- Provider: TrailRunning.it ---
async function checkTrailRunningIt(): Promise<ProviderResult> {
  const fonte: Fonte = "TrailRunning.it";
  const anno = new Date().getFullYear();
  const url = `https://trailrunning.it/gare/gare-trail-toscana-${anno}/`;
  const result: ProviderResult = {
    fonte, url, ok: false, httpStatus: null, raceCount: 0, trailCount: 0,
    monthsCovered: [], sample: [], error: null,
  };

  // Browser-like UA: il sito ha un WAF aggressivo che 403-a UA generici.
  const ua = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
  const { html, status, error } = await fetchHtml(url, ua);
  result.httpStatus = status;
  if (!html) {
    result.error = error;
    return result;
  }

  const $ = cheerio.load(html);
  const months = new Set<number>();
  const races: ProviderResult["sample"] = [];

  $(".ect-list-posts").each((_, el) => {
    const moText = $(el).find("span.ev-mo").text().trim().toLowerCase();
    const dayText = $(el).find("span.ev-day").text().trim();
    const mese = MESI_IT_SHORT[moText];
    if (!mese || !MESI_TARGET.includes(mese)) return;
    const giorno = parseInt(dayText);
    if (isNaN(giorno)) return;

    const linkEl = $(el).find("a.ect-event-url");
    const nome = linkEl.text().trim();
    if (!nome) return;

    const distMatch = nome.match(/(\d+(?:[.,]\d+)?)\s*k/i);
    const distanza = distMatch ? Math.round(parseFloat(distMatch[1].replace(",", "."))) : 0;

    months.add(mese);
    if (races.length < 3) {
      races.push({ data: `${giorno}/${String(mese).padStart(2, "0")}`, nome, localita: "", distanza });
    }
    result.raceCount += 1;
    if (isTrail(nome)) result.trailCount += 1;
  });

  result.monthsCovered = [...months].sort((a, b) => a - b);
  result.sample = races;
  result.ok = result.raceCount > 0;
  if (!result.ok) {
    result.error = result.raceCount === 0 && result.httpStatus === 200
      ? "Pagina raggiungibile ma il parser non ha trovato gare (selettori cambiati?)"
      : `Nessuna gara trovata (HTTP ${result.httpStatus})`;
  }
  return result;
}

function fmt(r: ProviderResult): string {
  const status = r.ok ? "OK    " : "FAIL  ";
  const http = r.httpStatus ?? "—";
  const months = r.monthsCovered.length > 0
    ? r.monthsCovered.map((m) => String(m).padStart(2, "0")).join(",")
    : "—";
  const lines = [
    `[${status}] ${r.fonte.padEnd(20)} HTTP ${String(http).padEnd(4)} gare=${String(r.raceCount).padStart(3)} (trail=${r.trailCount}) mesi=${months}`,
    `         URL: ${r.url}`,
  ];
  if (r.error) lines.push(`         ERRORE: ${r.error}`);
  if (r.sample.length > 0) {
    lines.push(`         Esempi:`);
    for (const s of r.sample) {
      lines.push(`           - ${s.data} ${s.nome} (${s.localita || "—"}, ${s.distanza}km)`);
    }
  }
  return lines.join("\n");
}

async function main() {
  const warnOnly = process.argv.includes("--warn");
  console.log("=== Test provider gare ===");
  console.log(`Data: ${new Date().toISOString()}`);
  console.log(`Mesi target: ${MESI_TARGET.join(", ")}\n`);

  const results = await Promise.all([
    checkCalendarioPodismo(),
    checkUSNave(),
    checkTrailRunningIt(),
  ]);

  for (const r of results) {
    console.log(fmt(r));
    console.log("");
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`=== Riepilogo: ${results.length - failed.length}/${results.length} provider OK ===`);
  if (failed.length > 0) {
    console.log(`Provider in errore: ${failed.map((r) => r.fonte).join(", ")}`);
  }

  if (failed.length > 0 && !warnOnly) process.exit(1);
}

main().catch((err) => {
  console.error("Errore fatale:", err);
  process.exit(1);
});
