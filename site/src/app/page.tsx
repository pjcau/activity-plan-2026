"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

type Fonte = "Calendario Podismo" | "US Nave";

type Gara = {
  id: number;
  data: string;
  nome: string;
  distanza: number;
  tipo: "Trail" | "Strada";
  localita: string;
  mese: number;
  fonti: Fonte[];
  competitiva: boolean;
  federazione: string;
  distanza_fi: number | null;
};

const mesiNomi: Record<number, string> = {
  1: "Gennaio",
  2: "Febbraio",
  3: "Marzo",
  4: "Aprile",
  5: "Maggio",
  6: "Giugno",
  7: "Luglio",
  8: "Agosto",
  9: "Settembre",
  10: "Ottobre",
  11: "Novembre",
  12: "Dicembre",
};

const fonteBadge: Record<Fonte, { bg: string; text: string; short: string }> = {
  "Calendario Podismo": { bg: "bg-emerald-100 dark:bg-emerald-900", text: "text-emerald-700 dark:text-emerald-300", short: "CP" },
  "US Nave": { bg: "bg-purple-100 dark:bg-purple-900", text: "text-purple-700 dark:text-purple-300", short: "USN" },
};

const MESI_SHORT_TO_NUM: Record<string, number> = {
  gen: 0, feb: 1, mar: 2, apr: 3, mag: 4, giu: 5,
  lug: 6, ago: 7, set: 8, ott: 9, nov: 10, dic: 11,
};

function parseDataGara(data: string): Date | null {
  const parts = data.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const giorno = parseInt(parts[0]);
  const mese = MESI_SHORT_TO_NUM[parts[1].toLowerCase()];
  if (!giorno || mese === undefined) return null;
  return new Date(2026, mese, giorno);
}

const FILTERS_KEY = "gare-filtri";
const FILTER_DEFAULTS = {
  meseSelezionato: () => new Date().getMonth() + 1,
  distanzaMin: 20,
  distanzaMax: 80,
  maxDistDaFirenze: 150,
  fontiAttive: ["Calendario Podismo", "US Nave"] as Fonte[],
  filtroCompetitiva: "tutte" as const,
  nascondiPassate: true,
};

type SavedFilters = {
  meseSelezionato?: number;
  distanzaMin?: number;
  distanzaMax?: number;
  maxDistDaFirenze?: number;
  fontiAttive?: string[];
  filtroCompetitiva?: string;
  federazioniAttive?: string[];
  nascondiPassate?: boolean;
};

function loadSavedFilters(): SavedFilters | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(FILTERS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function FonteBadge({ fonte }: { fonte: Fonte }) {
  const { bg, text, short } = fonteBadge[fonte];
  return (
    <span className={`${bg} ${text} px-1.5 py-0.5 rounded text-xs font-medium`} title={fonte}>
      {short}
    </span>
  );
}

function garaKey(gara: Gara): string {
  return `${gara.nome}::${gara.data}`;
}

function GareTable({
  gare,
  savedKeys,
  onToggle,
}: {
  gare: Gara[];
  savedKeys?: Set<string>;
  onToggle?: (gara: Gara) => void;
}) {
  if (gare.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Nessuna gara trovata con i filtri selezionati
      </div>
    );
  }

  const showStar = !!onToggle;

  const garePerMese = gare.reduce((acc, gara) => {
    if (!acc[gara.mese]) acc[gara.mese] = [];
    acc[gara.mese].push(gara);
    return acc;
  }, {} as Record<number, Gara[]>);

  return (
    <>
      {Object.entries(garePerMese)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([mese, gareDelMese]) => {
          gareDelMese.sort((a, b) => parseInt(a.data) - parseInt(b.data));
          return (
          <div key={mese} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">
              {mesiNomi[Number(mese)]} 2026
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-emerald-600 dark:bg-emerald-900 text-white">
                    {showStar && <th className="p-3 w-10"></th>}
                    <th className="p-3 text-left">Data</th>
                    <th className="p-3 text-left">Gara</th>
                    <th className="p-3 text-left">Distanza</th>
                    <th className="p-3 text-left">Tipo</th>
                    <th className="p-3 text-left">Localit&agrave;</th>
                    <th className="p-3 text-left">Da FI</th>
                    <th className="p-3 text-left">Fonte</th>
                  </tr>
                </thead>
                <tbody>
                  {gareDelMese.map((gara, i) => {
                    const saved = savedKeys?.has(garaKey(gara));
                    return (
                      <tr key={gara.id} className={`${i % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-900"} hover:bg-emerald-50 dark:hover:bg-gray-800 transition-colors`}>
                        {showStar && (
                          <td className="p-3 border-b dark:border-gray-700 text-center">
                            <button
                              onClick={() => onToggle(gara)}
                              className={`text-xl transition-colors ${
                                saved
                                  ? "text-yellow-500 hover:text-yellow-600"
                                  : "text-gray-300 dark:text-gray-600 hover:text-yellow-400"
                              }`}
                              title={saved ? "Rimuovi dalle mie gare" : "Aggiungi alle mie gare"}
                            >
                              {saved ? "\u2605" : "\u2606"}
                            </button>
                          </td>
                        )}
                        <td className="p-3 border-b dark:border-gray-700 dark:text-gray-300">{gara.data}</td>
                        <td className="p-3 border-b dark:border-gray-700 font-medium">
                          <Link
                            href={`/gare/${gara.id}`}
                            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 hover:underline"
                          >
                            {gara.nome}
                          </Link>
                          <div className="flex gap-1 mt-1">
                            {gara.federazione && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                                {gara.federazione}
                              </span>
                            )}
                            {!gara.competitiva && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                Non comp.
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 border-b dark:border-gray-700 dark:text-gray-300">{gara.distanza} km</td>
                        <td className="p-3 border-b dark:border-gray-700">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              gara.tipo === "Trail"
                                ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                                : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            }`}
                          >
                            {gara.tipo}
                          </span>
                        </td>
                        <td className="p-3 border-b dark:border-gray-700 dark:text-gray-300">{gara.localita}</td>
                        <td className="p-3 border-b dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                          {gara.distanza_fi !== null
                            ? `${gara.distanza_fi} km`
                            : "\u2014"}
                        </td>
                        <td className="p-3 border-b dark:border-gray-700">
                          <div className="flex gap-1">
                            {gara.fonti.map((f) => (
                              <FonteBadge key={f} fonte={f} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          );
        })}
    </>
  );
}

export default function Home() {
  const { user, supabase } = useAuth();
  const [gare, setGare] = useState<Gara[]>([]);
  const [ultimoAggiornamento, setUltimoAggiornamento] = useState("");
  const [loadingGare, setLoadingGare] = useState(true);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [initialFilters] = useState(loadSavedFilters);
  const [meseSelezionato, setMeseSelezionato] = useState<number>(
    initialFilters?.meseSelezionato ?? FILTER_DEFAULTS.meseSelezionato()
  );
  const [distanzaMin, setDistanzaMin] = useState<number>(
    initialFilters?.distanzaMin ?? FILTER_DEFAULTS.distanzaMin
  );
  const [distanzaMax, setDistanzaMax] = useState<number>(
    initialFilters?.distanzaMax ?? FILTER_DEFAULTS.distanzaMax
  );
  const [maxDistDaFirenze, setMaxDistDaFirenze] = useState<number>(
    initialFilters?.maxDistDaFirenze ?? FILTER_DEFAULTS.maxDistDaFirenze
  );
  const [fontiAttive, setFontiAttive] = useState<Set<Fonte>>(
    new Set((initialFilters?.fontiAttive ?? FILTER_DEFAULTS.fontiAttive) as Fonte[])
  );
  const [filtroCompetitiva, setFiltroCompetitiva] = useState<"tutte" | "si" | "no">(
    (initialFilters?.filtroCompetitiva as "tutte" | "si" | "no") ?? FILTER_DEFAULTS.filtroCompetitiva
  );
  const [federazioniAttive, setFederazioniAttive] = useState<Set<string>>(
    new Set(initialFilters?.federazioniAttive ?? [])
  );
  const [nascondiPassate, setNascondiPassate] = useState<boolean>(
    initialFilters?.nascondiPassate ?? FILTER_DEFAULTS.nascondiPassate
  );
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  // Carica gare da Supabase
  useEffect(() => {
    if (!supabase) return;
    const loadGare = async () => {
      const [gareRes, metaRes] = await Promise.all([
        supabase.from("gare").select("id, data, nome, distanza, tipo, localita, mese, fonti, competitiva, federazione, distanza_fi").order("mese").order("data"),
        supabase.from("metadata").select("value").eq("key", "ultimoAggiornamento").single(),
      ]);
      if (gareRes.data) setGare(gareRes.data as Gara[]);
      if (metaRes.data) setUltimoAggiornamento(metaRes.data.value);
      setLoadingGare(false);
    };
    loadGare();
  }, [supabase]);

  const mesiDisponibili = useMemo(
    () => [...new Set(gare.map((g) => g.mese))].sort((a, b) => a - b),
    [gare]
  );

  const federazioniDisponibili = useMemo(
    () => [...new Set(gare.map((g) => g.federazione).filter(Boolean))].sort(),
    [gare]
  );

  // Salva filtri in sessionStorage quando cambiano
  useEffect(() => {
    try {
      sessionStorage.setItem(FILTERS_KEY, JSON.stringify({
        meseSelezionato,
        distanzaMin,
        distanzaMax,
        maxDistDaFirenze,
        fontiAttive: [...fontiAttive],
        filtroCompetitiva,
        federazioniAttive: [...federazioniAttive],
        nascondiPassate,
      }));
    } catch {}
  }, [meseSelezionato, distanzaMin, distanzaMax, maxDistDaFirenze, fontiAttive, filtroCompetitiva, federazioniAttive, nascondiPassate]);

  // Carica gare salvate dall'utente
  useEffect(() => {
    if (!user || !supabase) return;
    const load = async () => {
      const { data } = await supabase
        .from("user_gare")
        .select("gara_nome, gara_data");
      if (data) {
        setSavedKeys(new Set(data.map((r) => `${r.gara_nome}::${r.gara_data}`)));
      }
    };
    load();
  }, [user, supabase]);

  const toggleGara = useCallback(
    async (gara: Gara) => {
      if (!user || !supabase) return;
      const key = garaKey(gara);
      if (savedKeys.has(key)) {
        await supabase
          .from("user_gare")
          .delete()
          .eq("gara_nome", gara.nome)
          .eq("gara_data", gara.data);
        setSavedKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      } else {
        await supabase.from("user_gare").insert({
          user_id: user.id,
          gara_nome: gara.nome,
          gara_data: gara.data,
          gara_distanza: gara.distanza,
          gara_tipo: gara.tipo,
          gara_localita: gara.localita,
          gara_mese: gara.mese,
        });
        setSavedKeys((prev) => new Set(prev).add(key));
      }
    },
    [user, supabase, savedKeys]
  );

  const toggleFonte = (fonte: Fonte) => {
    setFontiAttive((prev) => {
      const next = new Set(prev);
      if (next.has(fonte)) {
        if (next.size > 1) next.delete(fonte);
      } else {
        next.add(fonte);
      }
      return next;
    });
  };

  const toggleFederazione = (fed: string) => {
    setFederazioniAttive((prev) => {
      const next = new Set(prev);
      if (next.has(fed)) {
        next.delete(fed);
      } else {
        next.add(fed);
      }
      return next;
    });
  };

  const hasNonDefaultFilters =
    meseSelezionato !== FILTER_DEFAULTS.meseSelezionato() ||
    distanzaMin !== FILTER_DEFAULTS.distanzaMin ||
    distanzaMax !== FILTER_DEFAULTS.distanzaMax ||
    maxDistDaFirenze !== FILTER_DEFAULTS.maxDistDaFirenze ||
    filtroCompetitiva !== FILTER_DEFAULTS.filtroCompetitiva ||
    fontiAttive.size !== FILTER_DEFAULTS.fontiAttive.length ||
    federazioniAttive.size > 0 ||
    nascondiPassate !== FILTER_DEFAULTS.nascondiPassate;

  const resetFiltri = () => {
    setMeseSelezionato(FILTER_DEFAULTS.meseSelezionato());
    setDistanzaMin(FILTER_DEFAULTS.distanzaMin);
    setDistanzaMax(FILTER_DEFAULTS.distanzaMax);
    setMaxDistDaFirenze(FILTER_DEFAULTS.maxDistDaFirenze);
    setFontiAttive(new Set(FILTER_DEFAULTS.fontiAttive));
    setFiltroCompetitiva(FILTER_DEFAULTS.filtroCompetitiva);
    setFederazioniAttive(new Set());
    setNascondiPassate(FILTER_DEFAULTS.nascondiPassate);
    sessionStorage.removeItem(FILTERS_KEY);
  };

  const oggi = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const gareFiltrate = gare.filter((gara) => {
    if (nascondiPassate) {
      const dataGara = parseDataGara(gara.data);
      if (dataGara && dataGara < oggi) return false;
    }
    const matchMese = meseSelezionato === 0 || gara.mese === meseSelezionato;
    const matchDistanza = gara.distanza >= distanzaMin && gara.distanza <= distanzaMax;
    const matchFonte = gara.fonti.some((f) => fontiAttive.has(f));
    const matchDistFirenze = gara.distanza_fi === null || gara.distanza_fi <= maxDistDaFirenze;
    const matchCompetitiva =
      filtroCompetitiva === "tutte" ||
      (filtroCompetitiva === "si" && gara.competitiva) ||
      (filtroCompetitiva === "no" && !gara.competitiva);
    const matchFederazione =
      federazioniAttive.size === 0 ||
      federazioniAttive.has(gara.federazione);
    return matchMese && matchDistanza && matchFonte && matchDistFirenze && matchCompetitiva && matchFederazione;
  });

  const dataAggiornamento = mounted && ultimoAggiornamento
    ? new Date(ultimoAggiornamento).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Filtri */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold dark:text-gray-100">Filtri</h2>
            {mounted && hasNonDefaultFilters && (
              <button
                onClick={resetFiltri}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Reset filtri
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Filtro Mese */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mese
              </label>
              <select
                value={meseSelezionato}
                onChange={(e) => setMeseSelezionato(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={0}>Tutti i mesi</option>
                {mesiDisponibili.map((num) => (
                  <option key={num} value={num}>
                    {mesiNomi[num]}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro Distanza Min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Distanza minima: {distanzaMin} km
              </label>
              <input
                type="range"
                min="0"
                max="80"
                value={distanzaMin}
                onChange={(e) => setDistanzaMin(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Filtro Distanza Max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Distanza massima: {distanzaMax} km
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={distanzaMax}
                onChange={(e) => setDistanzaMax(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Filtro Distanza da Firenze */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max da Firenze: {maxDistDaFirenze} km
              </label>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={maxDistDaFirenze}
                onChange={(e) => setMaxDistDaFirenze(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>

          {/* Seconda riga filtri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Filtro Fonte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fonte dati
              </label>
              <div className="flex flex-col gap-2">
                {(Object.keys(fonteBadge) as Fonte[]).map((fonte) => {
                  const active = fontiAttive.has(fonte);
                  const { bg, text } = fonteBadge[fonte];
                  return (
                    <button
                      key={fonte}
                      onClick={() => toggleFonte(fonte)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
                        active
                          ? `${bg} ${text} border-current`
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {fonte}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtro Competitiva */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Competitiva
              </label>
              <div className="flex flex-col gap-2">
                {([
                  { value: "tutte", label: "Tutte" },
                  { value: "si", label: "Solo competitive" },
                  { value: "no", label: "Solo non competitive" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFiltroCompetitiva(opt.value)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
                      filtroCompetitiva === opt.value
                        ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro Federazione */}
            {federazioniDisponibili.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Federazione
                </label>
                <div className="flex flex-col gap-2">
                  {federazioniDisponibili.map((fed) => (
                    <button
                      key={fed}
                      onClick={() => toggleFederazione(fed)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
                        federazioniAttive.has(fed)
                          ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      {fed}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nascondi gare passate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gare passate
              </label>
              <button
                onClick={() => setNascondiPassate((v) => !v)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
                  nascondiPassate
                    ? "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600"
                }`}
              >
                {nascondiPassate ? "Nascoste" : "Visibili"}
              </button>
            </div>
          </div>

          {/* Riepilogo filtri */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando <span className="font-semibold text-emerald-600 dark:text-emerald-400">{gareFiltrate.length}</span> gare
              {meseSelezionato > 0 && <> di <span className="font-semibold">{mesiNomi[meseSelezionato]}</span></>}
              {" "}tra <span className="font-semibold">{distanzaMin} km</span> e <span className="font-semibold">{distanzaMax} km</span>
              {" "}entro <span className="font-semibold">{maxDistDaFirenze} km</span> da Firenze
            </p>
            <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span><span className="font-semibold text-emerald-700 dark:text-emerald-400">CP</span> = Calendario Podismo</span>
              <span><span className="font-semibold text-purple-700 dark:text-purple-400">USN</span> = US Nave</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400" suppressHydrationWarning>
            Ultimo aggiornamento dati: {dataAggiornamento}
          </p>
        </div>

        {/* Tabella Gare */}
        {loadingGare ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <GareTable
            gare={gareFiltrate}
            savedKeys={user ? savedKeys : undefined}
            onToggle={user ? toggleGara : undefined}
          />
        )}
      </main>
    </div>
  );
}
