import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

type Fonte = "Calendario Podismo" | "US Nave";

type Gara = {
  data: string;
  nome: string;
  distanza: number;
  tipo: "Trail" | "Strada";
  localita: string;
  mese: number;
  fonti: Fonte[];
  competitiva: boolean;
  federazione: string;
  descrizione: string | null;
  link_sito: string | null;
  link_iscrizione: string | null;
  locandina_url: string | null;
  pdf_url: string | null;
  immagini: string[] | null;
  _detailUrl?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Finestra di 3 mesi: mese corrente + prossimi 2
function getMesiTarget(): number[] {
  const now = new Date();
  const meseCorrente = now.getMonth() + 1;
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

// --- Filtro immagini pubblicitarie ---
function isAdImage(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.endsWith(".gif")
    || lower.includes("banner")
    || lower.includes("arconate")
    || lower.includes("loghi-associazioni")
    || lower.includes("icona");
}

/** Normalizza nome per merge: rimuove accenti, numeri edizione, punteggiatura */
function normalizeForMerge(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/^\d+/, "");
}

// --- Rate-limited fetch per pagine dettaglio ---
const DETAIL_FETCH_DELAY_MS = 1500;
const DETAIL_FETCH_TIMEOUT_MS = 10000;

async function fetchWithDelay(url: string, delayMs = DETAIL_FETCH_DELAY_MS): Promise<string | null> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DETAIL_FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      headers: { "User-Agent": "ActivityPlan2026/1.0" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.warn(`  [Detail] HTTP ${res.status} per ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.warn(`  [Detail] Errore fetch ${url}: ${err}`);
    return null;
  }
}

// --- Carica gare esistenti dal DB (tutti i campi + id) ---
async function loadExistingGare(): Promise<(Gara & { id: number })[]> {
  const { data } = await supabase
    .from("gare")
    .select("id, data, nome, distanza, tipo, localita, mese, fonti, competitiva, federazione, descrizione, link_sito, link_iscrizione, locandina_url, pdf_url, immagini")
    .in("mese", MESI_TARGET);
  return (data as (Gara & { id: number })[]) ?? [];
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
      // Data: dalla struttura .gara-col-sx contiene due div (giorno settimana + data)
      // oppure dall'attributo data-data="2026-02-08"
      const dataAttr = $(el).attr("data-data") || "";
      let giorno = "";
      let meseStr = "";

      if (dataAttr) {
        // data-data="2026-02-08"
        const parts = dataAttr.split("-");
        if (parts.length === 3) {
          meseStr = parts[1];
          giorno = String(parseInt(parts[2]));
        }
      }

      if (!giorno) {
        // Fallback: testo dentro .gara-col-sx
        const colSxText = $(el).find(".gara-col-sx").text().trim();
        const dateMatch = colSxText.match(/(\d{1,2})\/(\d{2})/);
        if (dateMatch) {
          giorno = dateMatch[1];
          meseStr = dateMatch[2];
        }
      }

      if (!giorno || !meseStr) return;
      const mese = MESI_MAP[meseStr];
      if (!mese || !MESI_TARGET.includes(mese)) return;

      const titolo = $(el).find(".gara-titolo a");
      const nome = titolo.text().trim();
      if (!nome) return;

      // Detail page URL
      const detailHref = titolo.attr("href") || "";
      const detailUrl = detailHref
        ? (detailHref.startsWith("http") ? detailHref : `https://www.calendariopodismo.it${detailHref}`)
        : "";

      // Federazione dal logo
      const fedImg = $(el).find("img.cp-assoc-logo");
      let federazione = "";
      if (fedImg.length > 0) {
        const alt = (fedImg.attr("alt") || "").trim().toUpperCase();
        if (["FIDAL", "UISP", "CSI", "EPS"].includes(alt)) {
          federazione = alt;
        }
      }

      // Competitiva: da attributo data-competitiva o trofeo
      const dataComp = $(el).attr("data-competitiva");
      const competitiva = dataComp === "1"
        || $(el).find(".cp-ico-trophy").length > 0;

      // Località e distanza
      const localitaDistanza = $(el).find(".gara-localita").text().trim();
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
        competitiva,
        federazione,
        descrizione: null,
        link_sito: null,
        link_iscrizione: null,
        locandina_url: null,
        pdf_url: null,
        immagini: null,
        _detailUrl: detailUrl || undefined,
      });
    } catch {
      // Ignora gare con dati malformati
    }
  });

  console.log(`[CalendarioPodismo] Trovate ${gare.length} gare`);
  return gare;
}

// --- Detail pages Calendario Podismo ---
async function fetchCalendarioPodismoDetails(gare: Gara[]): Promise<void> {
  const toFetch = gare.filter((g) => g._detailUrl);
  console.log(`[CalendarioPodismo] Fetching ${toFetch.length} pagine dettaglio...`);

  for (let i = 0; i < toFetch.length; i++) {
    const gara = toFetch[i];
    console.log(`  [${i + 1}/${toFetch.length}] ${gara.nome}`);

    const html = await fetchWithDelay(gara._detailUrl!);
    if (!html) continue;

    try {
      const $ = cheerio.load(html);

      // Descrizione: paragrafi nell'area contenuto principale
      const paragraphs: string[] = [];
      $(".entry-content p, .gara-descrizione p, article p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 20 && !text.includes("cookie") && !text.includes("privacy")) {
          paragraphs.push(text);
        }
      });
      if (paragraphs.length > 0) {
        gara.descrizione = paragraphs.slice(0, 3).join("\n\n");
      }

      // Link sito e iscrizione: pattern <strong>Label:</strong> <span class="info-valore"><a href="...">
      $("strong").each((_, el) => {
        const label = $(el).text().trim().toLowerCase();
        const nextLink = $(el).next(".info-valore").find("a").attr("href")
          || $(el).parent().find(".info-valore a").attr("href")
          || "";
        if (!nextLink || !nextLink.startsWith("http") || nextLink.includes("calendariopodismo")) return;

        if (label.includes("sito") && !gara.link_sito) {
          gara.link_sito = nextLink;
        }
        if (label.includes("iscri") && !gara.link_iscrizione) {
          gara.link_iscrizione = nextLink;
        }
      });

      // PDF regolamento: link <a> o <img> con .pdf nell'URL
      $("a[href*='.pdf'], a[href*='.PDF']").each((_, el) => {
        if (gara.pdf_url) return;
        const href = $(el).attr("href") || "";
        if (href) {
          gara.pdf_url = href.startsWith("http")
            ? href
            : `https://www.calendariopodismo.it${href}`;
        }
      });
      // A volte il PDF è referenziato come src di un <img>
      if (!gara.pdf_url) {
        $("img[src*='.pdf'], img[src*='.PDF']").each((_, el) => {
          if (gara.pdf_url) return;
          const src = $(el).attr("src") || "";
          if (src) {
            gara.pdf_url = src.startsWith("http")
              ? src
              : `https://www.calendariopodismo.it${src}`;
          }
        });
      }

      // Locandina: nella gallery dedicata .acf-gallery-volantino
      // oppure immagini significative (no banner, gif, loghi, icone)
      const imgs: string[] = [];

      // Prima: gallery specifica
      $(".acf-gallery-volantino img").each((_, el) => {
        const src = $(el).attr("src") || "";
        if (!src || src.endsWith(".gif")) return;
        const fullUrl = src.startsWith("http") ? src : `https://www.calendariopodismo.it${src}`;
        imgs.push(fullUrl);
      });

      // Se non trovate nella gallery, cerca nel contenuto principale
      if (imgs.length === 0) {
        $("article img, .entry-content img").each((_, el) => {
          const src = $(el).attr("src") || "";
          if (!src) return;
          const lower = src.toLowerCase();
          // Filtra: gif (spesso ads), banner, loghi, icone, gravatar, plugin
          if (lower.endsWith(".gif")) return;
          if (lower.includes("banner")) return;
          if (lower.includes("logo")) return;
          if (lower.includes("icona")) return;
          if (lower.includes("icon")) return;
          if (lower.includes("avatar")) return;
          if (lower.includes("gravatar")) return;
          if (lower.includes("wp-content/plugins")) return;
          if (lower.includes("loghi-associazioni")) return;
          if (lower.includes(".pdf")) return; // PDF renderizzato come img
          // Tieni solo jpg/png/webp con "upload" nel path
          if (!lower.includes("upload")) return;
          if (!/\.(jpg|jpeg|png|webp)$/i.test(lower)) return;

          const fullUrl = src.startsWith("http") ? src : `https://www.calendariopodismo.it${src}`;
          imgs.push(fullUrl);
        });
      }

      // Tutte le immagini vanno in immagini (no duplicati con locandina_url)
      if (imgs.length > 0) {
        gara.immagini = imgs;
      }
    } catch (err) {
      console.warn(`  Errore parsing dettaglio ${gara.nome}: ${err}`);
    }
  }
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

  // Ogni gara è in un contenitore con .datagara, .desgara, .luogogara
  $(".datagara").each((_, el) => {
    try {
      const dataText = $(el).text().trim(); // "08 febbraio 2026"
      const localDateMatch = dataText.match(
        /(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+2026/i
      );
      if (!localDateMatch) return;
      const giorno = parseInt(localDateMatch[1]);
      const mese = MESI_IT[localDateMatch[2].toLowerCase()];
      if (!mese || !MESI_TARGET.includes(mese)) return;

      // Il contenitore è il parent comune (.col-9 o .row)
      const container = $(el).closest(".row, .col-9, div[class*='col']").first();
      if (container.length === 0) return;

      // Nome dalla classe .desgara
      const nomeRaw = container.find(".desgara").text().trim();
      if (!nomeRaw || nomeRaw.length < 3) return;
      // Pulisci nome: rimuovi info chiusura iscrizioni
      const nome = nomeRaw.replace(/\s*-?\s*CHIUSURA ISCRIZIONI.*/i, "").trim();

      // Località dalla classe .luogogara
      const luogo = container.find(".luogogara").text().trim();
      // Estrai solo il nome della città (prima parola significativa)
      const localitaMatch = luogo.match(/^([A-ZÀ-Ú][A-ZÀ-Úa-zà-ú\s]+?)(?:\s+\d|,|\s+IN\s|\s+FI|\s+PI|\s+PO)/i);
      const localita = localitaMatch ? localitaMatch[1].trim() : luogo.split(",")[0].trim();

      // Detail page URL
      const detailLink = container.find("a[href*='gara.aspx?']");
      const detailHref = detailLink.attr("href") || "";
      const detailUrl = detailHref
        ? (detailHref.startsWith("http") ? detailHref : `https://usnave.it/${detailHref.replace(/^\.\//, "")}`)
        : "";

      // Distanza: dal nome o dal testo
      const fullText = container.text();
      let distanza = 0;
      const distMatch = fullText.match(/(\d+(?:[.,]\d+)?)\s*km/i);
      if (distMatch) {
        distanza = Math.round(parseFloat(distMatch[1].replace(",", ".")));
      }
      if (distanza === 0 && /mezza\s*marat|half\s*marat|halfmarat/i.test(nome)) {
        distanza = 21;
      }
      if (distanza === 0 && /maratonina/i.test(nome)) {
        distanza = 21;
      }
      if (distanza === 0 && /marat/i.test(nome) && !/mezza|half|mini/i.test(nome)) {
        distanza = 42;
      }
      if (distanza === 0) return;

      // Immagini (no gif/banner) - tutte in immagini, niente in locandina_url
      const rowContainer = $(el).closest(".row");
      const listingImgs: string[] = [];
      rowContainer.find("img[src*='upload/gare'], img[src*='immagini']").each((_, imgEl) => {
        const src = $(imgEl).attr("src") || "";
        if (!src) return;
        const lower = src.toLowerCase();
        if (lower.endsWith(".gif") || lower.includes("banner") || lower.includes("logo")) return;
        const fullUrl = src.startsWith("http") ? src : `https://usnave.it/${src.replace(/^\.\//, "")}`;
        if (!listingImgs.includes(fullUrl)) listingImgs.push(fullUrl);
      });

      // Competitiva: heuristic dal nome
      const competitiva = /competitiva/i.test(nome);

      gare.push({
        data: formatData(giorno, mese),
        nome,
        distanza,
        tipo: detectTipo(nome),
        localita: localita || "Toscana",
        mese,
        fonti: ["US Nave"],
        competitiva,
        federazione: "",
        descrizione: null,
        link_sito: null,
        link_iscrizione: null,
        locandina_url: null,
        pdf_url: null,
        immagini: listingImgs.length > 0 ? listingImgs : null,
        _detailUrl: detailUrl || undefined,
      });
    } catch {
      // Ignora gare con dati malformati
    }
  });

  console.log(`[USNave] Trovate ${gare.length} gare`);
  return gare;
}

// --- Detail pages US Nave ---
async function fetchUSNaveDetails(gare: Gara[]): Promise<void> {
  const toFetch = gare.filter((g) => g._detailUrl);
  console.log(`[USNave] Fetching ${toFetch.length} pagine dettaglio...`);

  for (let i = 0; i < toFetch.length; i++) {
    const gara = toFetch[i];
    console.log(`  [${i + 1}/${toFetch.length}] ${gara.nome}`);

    const html = await fetchWithDelay(gara._detailUrl!);
    if (!html) continue;

    try {
      const $ = cheerio.load(html);
      const bodyText = $("body").text().replace(/\s+/g, " ").trim();

      // Descrizione: categorie, percorso, partenza
      const descParts: string[] = [];
      const percorsoMatch = bodyText.match(/(?:percorso|partenza|ritrovo|categori)[^.]{10,300}\./gi);
      if (percorsoMatch) {
        descParts.push(...percorsoMatch.slice(0, 3));
      }
      if (descParts.length > 0) {
        gara.descrizione = descParts.join(" ").trim();
      }

      // Competitiva: check sul contenuto della pagina dettaglio
      if (/non\s*competitiva/i.test(bodyText) && !/competitiva/i.test(bodyText.replace(/non\s*competitiva/gi, ""))) {
        gara.competitiva = false;
      } else if (/competitiva/i.test(bodyText)) {
        gara.competitiva = true;
      }

      // Immagini dalla pagina dettaglio (no gif/banner) - aggiungi a immagini
      const detailImgs: string[] = gara.immagini ? [...gara.immagini] : [];
      $("img[src*='upload/gare'], img[src*='immagini']").each((_, el) => {
        const src = $(el).attr("src") || "";
        if (!src) return;
        const lower = src.toLowerCase();
        if (lower.endsWith(".gif") || lower.includes("banner") || lower.includes("logo")) return;
        const fullUrl = src.startsWith("http")
          ? src
          : `https://usnave.it/${src.replace(/^\.\//, "")}`;
        if (!detailImgs.includes(fullUrl)) detailImgs.push(fullUrl);
      });
      if (detailImgs.length > 0) gara.immagini = detailImgs;
    } catch (err) {
      console.warn(`  Errore parsing dettaglio ${gara.nome}: ${err}`);
    }
  }
}

// --- Merge helper per campi dettaglio ---
function mergeDetailFields(target: Gara, source: Gara): void {
  if (!target.descrizione && source.descrizione) target.descrizione = source.descrizione;
  if (!target.link_sito && source.link_sito) target.link_sito = source.link_sito;
  if (!target.link_iscrizione && source.link_iscrizione) target.link_iscrizione = source.link_iscrizione;
  if (!target.pdf_url && source.pdf_url) target.pdf_url = source.pdf_url;
  // Immagini: combina senza duplicati
  if (source.immagini && source.immagini.length > 0) {
    const existing = target.immagini ?? [];
    const merged = [...existing];
    for (const img of source.immagini) {
      if (!merged.includes(img)) merged.push(img);
    }
    target.immagini = merged;
  }
  if (source.competitiva) target.competitiva = true;
  if (!target.federazione && source.federazione) target.federazione = source.federazione;
}

// --- Merge & Dedup ---
function mergeGare(sources: Gara[][]): Gara[] {
  const merged = new Map<string, Gara>();

  for (const gare of sources) {
    for (const gara of gare) {
      const nomeNorm = normalizeForMerge(gara.nome);
      const key = `${gara.data}-${nomeNorm}`;

      const existing = merged.get(key);
      if (existing) {
        for (const f of gara.fonti) {
          if (!existing.fonti.includes(f)) {
            existing.fonti.push(f);
          }
        }
        mergeDetailFields(existing, gara);
      } else {
        let found = false;
        for (const [, ex] of merged) {
          const exNorm = normalizeForMerge(ex.nome);
          if (
            ex.data === gara.data &&
            (
              // Stessa località + nome parzialmente uguale
              (ex.localita.toLowerCase() === gara.localita.toLowerCase() &&
                (nomeNorm.includes(exNorm.slice(0, 12)) || exNorm.includes(nomeNorm.slice(0, 12)))) ||
              // Nomi normalizzati molto simili (uno contiene l'altro)
              (nomeNorm.length > 12 && exNorm.length > 12 &&
                (nomeNorm.includes(exNorm) || exNorm.includes(nomeNorm)))
            )
          ) {
            for (const f of gara.fonti) {
              if (!ex.fonti.includes(f)) ex.fonti.push(f);
            }
            mergeDetailFields(ex, gara);
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

  const existingGare = await loadExistingGare();
  const existingBySource: Record<Fonte, Gara[]> = {
    "Calendario Podismo": existingGare.filter((g) => g.fonti.includes("Calendario Podismo")),
    "US Nave": existingGare.filter((g) => g.fonti.includes("US Nave")),
  };

  // Fetch listing pages
  let cpGare: Gara[] = [];
  try {
    cpGare = await fetchCalendarioPodismo();
    if (cpGare.length === 0) {
      console.warn("[CalendarioPodismo] Nessuna gara trovata, uso dati precedenti");
      cpGare = existingBySource["Calendario Podismo"];
    }
  } catch (err) {
    console.error(`[CalendarioPodismo] Errore: ${err}`);
    cpGare = existingBySource["Calendario Podismo"];
  }

  let usnGare: Gara[] = [];
  try {
    usnGare = await fetchUSNave();
    if (usnGare.length === 0) {
      console.warn("[USNave] Nessuna gara trovata, uso dati precedenti");
      usnGare = existingBySource["US Nave"];
    }
  } catch (err) {
    console.error(`[USNave] Errore: ${err}`);
    usnGare = existingBySource["US Nave"];
  }

  // Fetch detail pages (rate-limited)
  if (cpGare.length > 0 && cpGare !== existingBySource["Calendario Podismo"]) {
    await fetchCalendarioPodismoDetails(cpGare);
  }
  if (usnGare.length > 0 && usnGare !== existingBySource["US Nave"]) {
    await fetchUSNaveDetails(usnGare);
  }

  const merged = mergeGare([cpGare, usnGare]);

  // --- Upsert incrementale: preserva gare non toccate dallo scraping ---
  const existingLookup = new Map<string, Gara & { id: number }>();
  for (const g of existingGare) {
    existingLookup.set(`${g.data}-${normalizeForMerge(g.nome)}`, g);
  }

  const idsToReplace: number[] = [];
  for (const gara of merged) {
    const key = `${gara.data}-${normalizeForMerge(gara.nome)}`;
    const existing = existingLookup.get(key);
    if (existing) {
      idsToReplace.push(existing.id);
      // Preserva dati dettaglio manuali dal DB
      if (!gara.descrizione && existing.descrizione) gara.descrizione = existing.descrizione;
      if (!gara.link_sito && existing.link_sito) gara.link_sito = existing.link_sito;
      if (!gara.link_iscrizione && existing.link_iscrizione) gara.link_iscrizione = existing.link_iscrizione;
      if (!gara.pdf_url && existing.pdf_url) gara.pdf_url = existing.pdf_url;
      // Preserva immagini dal DB (inclusa vecchia locandina_url migrata in immagini)
      const existingImgs: string[] = [];
      if (existing.locandina_url && !isAdImage(existing.locandina_url)) existingImgs.push(existing.locandina_url);
      if (existing.immagini) {
        for (const url of existing.immagini as string[]) {
          if (!isAdImage(url) && !existingImgs.includes(url)) existingImgs.push(url);
        }
      }
      if (existingImgs.length > 0 && (!gara.immagini || gara.immagini.length === 0)) {
        gara.immagini = existingImgs;
      }
      if (!gara.federazione && existing.federazione) gara.federazione = existing.federazione;
      if (existing.competitiva && !gara.competitiva) gara.competitiva = existing.competitiva;
    }
  }

  // Usa _detailUrl come fallback per link_sito (link alla fonte)
  for (const gara of merged) {
    if (!gara.link_sito && gara._detailUrl) {
      gara.link_sito = gara._detailUrl;
    }
  }

  // Strip campo interno _detailUrl prima dell'inserimento
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rowsToInsert = merged.map(({ _detailUrl, ...rest }) => rest);

  // Cancella SOLO le gare che stiamo per re-inserire con dati aggiornati
  // Le gare non toccate dallo scraping restano intatte nel DB
  console.log(`\nGare da aggiornare: ${idsToReplace.length}, nuove: ${rowsToInsert.length - idsToReplace.length}`);

  if (idsToReplace.length > 0) {
    const BATCH = 100;
    for (let i = 0; i < idsToReplace.length; i += BATCH) {
      const batch = idsToReplace.slice(i, i + BATCH);
      const { error: delError } = await supabase.from("gare").delete().in("id", batch);
      if (delError) {
        console.error("Errore cancellazione gare:", delError.message);
        process.exit(1);
      }
    }
  }

  if (rowsToInsert.length > 0) {
    const { error: insError } = await supabase.from("gare").insert(rowsToInsert);
    if (insError) {
      console.error("Errore inserimento gare:", insError.message);
      process.exit(1);
    }
  }

  // Aggiorna metadata
  const now = new Date().toISOString();
  await supabase.from("metadata").upsert({
    key: "ultimoAggiornamento",
    value: now,
    updated_at: now,
  });

  // Riepilogo
  const conDescrizione = rowsToInsert.filter((g) => g.descrizione).length;
  const conLink = rowsToInsert.filter((g) => g.link_sito).length;
  const conImmagini = rowsToInsert.filter((g) => g.immagini && g.immagini.length > 0).length;
  const totImmagini = rowsToInsert.reduce((acc, g) => acc + (g.immagini?.length ?? 0), 0);
  const conFederazione = rowsToInsert.filter((g) => g.federazione).length;

  console.log(`\n=== Risultato ===`);
  console.log(`Salvate ${rowsToInsert.length} gare su Supabase`);
  console.log(`  Con descrizione: ${conDescrizione}`);
  console.log(`  Con link sito: ${conLink}`);
  console.log(`  Con immagini: ${conImmagini} gare (${totImmagini} immagini totali)`);
  console.log(`  Con federazione: ${conFederazione}`);
  console.log(`Ultimo aggiornamento: ${now}`);
}

main().catch((err) => {
  console.error("Errore fatale:", err);
  process.exit(1);
});
