import { pipeline as _pipeline, FeatureExtractionPipeline } from "@huggingface/transformers";
const loadPipeline = _pipeline as unknown as (...args: unknown[]) => Promise<FeatureExtractionPipeline>;

type KBEntry = {
  id: number;
  categoria: string;
  domande: string[];
  risposta: string;
  fonte: string;
  ordine: number;
};

type KBEntryWithEmbeddings = KBEntry & {
  embeddings: number[][]; // one embedding per domanda
};

type CachedIndex = {
  version: string; // hash of KB ids to detect changes
  entries: { id: number; embeddings: number[][] }[];
};

const CACHE_DB = "ai-coach-cache";
const CACHE_STORE = "embeddings";
const CACHE_KEY = "kb-index";

let extractor: FeatureExtractionPipeline | null = null;
let knowledgeBase: KBEntryWithEmbeddings[] = [];
let isReady = false;

// --- IndexedDB helpers ---
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(CACHE_DB, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(CACHE_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getCachedIndex(): Promise<CachedIndex | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(CACHE_STORE, "readonly");
      const store = tx.objectStore(CACHE_STORE);
      const req = store.get(CACHE_KEY);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveCachedIndex(index: CachedIndex): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(CACHE_STORE, "readwrite");
    const store = tx.objectStore(CACHE_STORE);
    store.put(index, CACHE_KEY);
  } catch {
    // Cache save failed, non-critical
  }
}

function computeVersion(kb: KBEntry[]): string {
  return kb.map((e) => `${e.id}:${e.domande.length}`).join(",");
}

// --- Math helpers ---
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embed(text: string): Promise<number[]> {
  if (!extractor) throw new Error("Model not loaded");
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array).slice(0, output.dims[1]);
}

function findTopK(
  queryEmbedding: number[],
  k: number = 3
): { entry: KBEntry; score: number }[] {
  const scores: { entry: KBEntry; score: number }[] = [];

  for (const kbEntry of knowledgeBase) {
    let bestScore = -1;
    for (const emb of kbEntry.embeddings) {
      const score = cosineSimilarity(queryEmbedding, emb);
      if (score > bestScore) bestScore = score;
    }
    scores.push({ entry: kbEntry, score: bestScore });
  }

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, k);
}

// --- Main handler ---
self.onmessage = async (e: MessageEvent) => {
  const { type, data } = e.data;

  if (type === "init") {
    try {
      // Step 1: Load model (cached by Transformers.js in browser storage after first download)
      self.postMessage({ type: "status", data: "Caricamento modello AI..." });

      extractor = await loadPipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        progress_callback: (progress: any) => {
          if (progress.status === "progress" && progress.progress !== undefined) {
            self.postMessage({
              type: "progress",
              data: { percent: Math.round(progress.progress), file: progress.file },
            });
          }
        },
      });

      // Step 2: Check cached embeddings
      const kb: KBEntry[] = data.knowledgeBase;
      const version = computeVersion(kb);
      const cached = await getCachedIndex();

      if (cached && cached.version === version) {
        // Use cached embeddings - instant load
        self.postMessage({ type: "status", data: "Caricamento indice dalla cache..." });

        const embMap = new Map(cached.entries.map((e) => [e.id, e.embeddings]));
        for (const entry of kb) {
          const embeddings = embMap.get(entry.id);
          if (embeddings) {
            knowledgeBase.push({ ...entry, embeddings });
          }
        }

        isReady = true;
        self.postMessage({ type: "ready" });
        return;
      }

      // Step 3: Compute embeddings (first time or KB changed)
      self.postMessage({ type: "status", data: "Indicizzazione domande (solo la prima volta)..." });

      const total = kb.reduce((sum, entry) => sum + entry.domande.length, 0);
      let done = 0;
      const cacheEntries: { id: number; embeddings: number[][] }[] = [];

      for (const entry of kb) {
        const embeddings: number[][] = [];
        for (const domanda of entry.domande) {
          const emb = await embed(domanda);
          embeddings.push(emb);
          done++;
          if (done % 10 === 0 || done === total) {
            self.postMessage({
              type: "indexing",
              data: { done, total },
            });
          }
        }
        knowledgeBase.push({ ...entry, embeddings });
        cacheEntries.push({ id: entry.id, embeddings });
      }

      // Save to IndexedDB for next time
      await saveCachedIndex({ version, entries: cacheEntries });

      isReady = true;
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({
        type: "error",
        data: `Errore inizializzazione: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  if (type === "reset") {
    try {
      const db = await openDB();
      const tx = db.transaction(CACHE_STORE, "readwrite");
      const store = tx.objectStore(CACHE_STORE);
      store.delete(CACHE_KEY);
      knowledgeBase = [];
      isReady = false;
      extractor = null;
      self.postMessage({ type: "reset-done" });
    } catch {
      self.postMessage({ type: "reset-done" });
    }
    return;
  }

  if (type === "query") {
    if (!isReady) {
      self.postMessage({ type: "error", data: "Il modello non è ancora pronto" });
      return;
    }

    try {
      self.postMessage({ type: "thinking" });

      const queryEmbedding = await embed(data.text);
      const results = findTopK(queryEmbedding, 3);

      const threshold = 0.35;
      const relevant = results.filter((r) => r.score >= threshold);

      if (relevant.length === 0) {
        self.postMessage({
          type: "answer",
          data: {
            text: "Non ho trovato informazioni specifiche su questo argomento nella mia knowledge base. Prova a riformulare la domanda, oppure chiedi qualcosa su nutrizione plant-based, allenamento running/trail, o i libri di riferimento (The Plant-Based Athlete, Eat & Run, Finding Ultra, Andiamo a correre).",
            sources: [],
          },
        });
        return;
      }

      self.postMessage({
        type: "answer",
        data: {
          text: relevant[0].entry.risposta,
          sources: relevant.map((r) => ({
            fonte: r.entry.fonte,
            categoria: r.entry.categoria,
            score: Math.round(r.score * 100),
          })),
          related:
            relevant.length > 1
              ? relevant.slice(1).map((r) => ({
                  risposta: r.entry.risposta,
                  fonte: r.entry.fonte,
                  score: Math.round(r.score * 100),
                }))
              : [],
        },
      });
    } catch (err) {
      self.postMessage({
        type: "error",
        data: `Errore ricerca: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }
};
