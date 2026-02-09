"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

type Ricetta = {
  id: number;
  nome: string;
  categoria: string;
  tempo_preparazione: string;
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

const categorie = [
  { value: "", label: "Tutte" },
  { value: "colazione", label: "Colazione" },
  { value: "pranzo", label: "Pranzo" },
  { value: "cena", label: "Cena" },
  { value: "snack", label: "Snack" },
  { value: "pre-workout", label: "Pre-Workout" },
  { value: "post-workout", label: "Post-Workout" },
];

export default function Ricette() {
  const { supabase } = useAuth();
  const [ricette, setRicette] = useState<Ricetta[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tagSelezionati, setTagSelezionati] = useState<string[]>([]);
  const [ricercaTesto, setRicercaTesto] = useState("");
  const [ricettaAperta, setRicettaAperta] = useState<number | null>(null);
  const [ordinamento, setOrdinamento] = useState<{
    campo: "proteine" | "carboidrati" | "grassi" | "fibre" | "";
    direzione: "asc" | "desc";
  }>({ campo: "", direzione: "desc" });

  useEffect(() => {
    if (!supabase) return;
    const load = async () => {
      const { data } = await supabase.from("ricette").select("*").order("id");
      if (data) setRicette(data as Ricetta[]);
      setLoading(false);
    };
    load();
  }, [supabase]);

  // Estrai tutti i tag unici e ordinali
  const tuttiTag = useMemo(() => {
    const tagSet = new Set<string>();
    ricette.forEach((r) => r.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, "it"));
  }, [ricette]);

  // Filtra e ordina le ricette
  const ricetteFiltrate = useMemo(() => {
    const filtrate = ricette.filter((r) => {
      if (categoriaFiltro && r.categoria !== categoriaFiltro) return false;
      if (
        tagSelezionati.length > 0 &&
        !tagSelezionati.every((tag) => r.tags.includes(tag))
      )
        return false;
      if (ricercaTesto) {
        const testo = ricercaTesto.toLowerCase();
        const match =
          r.nome.toLowerCase().includes(testo) ||
          r.ingredienti.some((i) => i.nome.toLowerCase().includes(testo)) ||
          r.tags.some((t) => t.toLowerCase().includes(testo));
        if (!match) return false;
      }
      return true;
    });
    if (ordinamento.campo) {
      filtrate.sort((a, b) => {
        const va = a[ordinamento.campo as keyof Ricetta] as number;
        const vb = b[ordinamento.campo as keyof Ricetta] as number;
        return ordinamento.direzione === "desc" ? vb - va : va - vb;
      });
    }
    return filtrate;
  }, [ricette, categoriaFiltro, tagSelezionati, ricercaTesto, ordinamento]);

  const toggleTag = (tag: string) => {
    setTagSelezionati((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetFiltri = () => {
    setCategoriaFiltro("");
    setTagSelezionati([]);
    setRicercaTesto("");
    setOrdinamento({ campo: "", direzione: "desc" });
  };

  const toggleOrdinamento = (campo: "proteine" | "carboidrati" | "grassi" | "fibre") => {
    setOrdinamento((prev) => {
      if (prev.campo === campo) {
        if (prev.direzione === "desc") return { campo, direzione: "asc" };
        return { campo: "", direzione: "desc" };
      }
      return { campo, direzione: "desc" };
    });
  };

  const getCategoriaLabel = (cat: string) => {
    const found = categorie.find((c) => c.value === cat);
    return found ? found.label : cat;
  };

  const getCategoriaColor = (cat: string) => {
    switch (cat) {
      case "colazione":
        return "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200";
      case "pranzo":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "cena":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "snack":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "pre-workout":
        return "bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200";
      case "post-workout":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Ricette Plant-Based per Atleti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {ricette.length} ricette dal libro{" "}
            <span className="font-semibold">
              &quot;The Plant-Based Athlete &mdash; Matt Frazier &amp; Robert Cheeke&quot;
            </span>
            . Filtra per categoria o ingrediente per trovare la ricetta perfetta
            per il tuo allenamento.
          </p>
        </div>

        {/* Filtri */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">Filtri</h2>
            {(categoriaFiltro ||
              tagSelezionati.length > 0 ||
              ricercaTesto ||
              ordinamento.campo) && (
              <button
                onClick={resetFiltri}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 cursor-pointer"
              >
                Resetta filtri
              </button>
            )}
          </div>

          {/* Ricerca testo */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cerca per nome o ingrediente..."
              value={ricercaTesto}
              onChange={(e) => setRicercaTesto(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Categorie */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {categorie.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoriaFiltro(cat.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    categoriaFiltro === cat.value
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag ingredienti */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Ingredienti ({tagSelezionati.length} selezionati)
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {tuttiTag.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    tagSelezionati.includes(tag)
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Ordinamento per macronutrienti */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Ordina per macronutrienti
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleOrdinamento("proteine")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  ordinamento.campo === "proteine"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                }`}
              >
                Proteine
                {ordinamento.campo === "proteine" && (
                  <span className="text-xs">{ordinamento.direzione === "desc" ? "\u2193" : "\u2191"}</span>
                )}
              </button>
              <button
                onClick={() => toggleOrdinamento("carboidrati")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  ordinamento.campo === "carboidrati"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800"
                }`}
              >
                Carboidrati
                {ordinamento.campo === "carboidrati" && (
                  <span className="text-xs">{ordinamento.direzione === "desc" ? "\u2193" : "\u2191"}</span>
                )}
              </button>
              <button
                onClick={() => toggleOrdinamento("grassi")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  ordinamento.campo === "grassi"
                    ? "bg-red-600 text-white"
                    : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
                }`}
              >
                Grassi
                {ordinamento.campo === "grassi" && (
                  <span className="text-xs">{ordinamento.direzione === "desc" ? "\u2193" : "\u2191"}</span>
                )}
              </button>
              <button
                onClick={() => toggleOrdinamento("fibre")}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  ordinamento.campo === "fibre"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
                }`}
              >
                Fibre
                {ordinamento.campo === "fibre" && (
                  <span className="text-xs">{ordinamento.direzione === "desc" ? "\u2193" : "\u2191"}</span>
                )}
              </button>
            </div>
            {ordinamento.campo && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ordinate per {ordinamento.campo} ({ordinamento.direzione === "desc" ? "pi\u00f9 alto prima" : "pi\u00f9 basso prima"}) &mdash; clicca di nuovo per invertire, un terzo click per rimuovere
              </p>
            )}
          </div>
        </div>

        {/* Conteggio risultati */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {ricetteFiltrate.length} ricett{ricetteFiltrate.length === 1 ? "a" : "e"}{" "}
          trovat{ricetteFiltrate.length === 1 ? "a" : "e"}
        </div>

        {/* Griglia ricette */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {ricetteFiltrate.map((ricetta) => (
            <div
              key={ricetta.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-colors"
            >
              {/* Header ricetta */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex-1 mr-2">
                    {ricetta.nome}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getCategoriaColor(ricetta.categoria)}`}
                  >
                    {getCategoriaLabel(ricetta.categoria)}
                  </span>
                </div>

                {/* Info rapide */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>&#9201; {ricetta.tempo_preparazione}</span>
                  <span>&#127860; {ricetta.porzioni} porz.</span>
                  <span>{ricetta.calorie} kcal</span>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-2 text-center">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Proteine
                    </div>
                    <div className="text-sm font-bold text-blue-800 dark:text-blue-200">
                      {ricetta.proteine}g
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/30 rounded p-2 text-center">
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      Carbo
                    </div>
                    <div className="text-sm font-bold text-amber-800 dark:text-amber-200">
                      {ricetta.carboidrati}g
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/30 rounded p-2 text-center">
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Grassi
                    </div>
                    <div className="text-sm font-bold text-red-800 dark:text-red-200">
                      {ricetta.grassi}g
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded p-2 text-center">
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Fibre
                    </div>
                    <div className="text-sm font-bold text-green-800 dark:text-green-200">
                      {ricetta.fibre}g
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {ricetta.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (!tagSelezionati.includes(tag)) toggleTag(tag);
                      }}
                      className={`px-2 py-0.5 rounded-full text-xs cursor-pointer ${
                        tagSelezionati.includes(tag)
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Toggle dettagli */}
                <button
                  onClick={() =>
                    setRicettaAperta(
                      ricettaAperta === ricetta.id ? null : ricetta.id
                    )
                  }
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 text-sm font-medium cursor-pointer"
                >
                  {ricettaAperta === ricetta.id
                    ? "Nascondi dettagli"
                    : "Mostra ingredienti e preparazione"}
                </button>
              </div>

              {/* Dettagli espandibili */}
              {ricettaAperta === ricetta.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
                  {/* Ingredienti */}
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Ingredienti
                  </h4>
                  <ul className="mb-4 space-y-1">
                    {ricetta.ingredienti.map((ing, i) => (
                      <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex">
                        <span className="text-emerald-600 dark:text-emerald-400 mr-2">&#8226;</span>
                        <span>
                          <span className="font-medium">{ing.quantita}</span>{" "}
                          {ing.nome}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Preparazione */}
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Preparazione
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {ricetta.istruzioni}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No results */}
        {ricetteFiltrate.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Nessuna ricetta trovata
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Prova a modificare i filtri o la ricerca
            </p>
            <button
              onClick={resetFiltri}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
            >
              Resetta filtri
            </button>
          </div>
        )}

        {/* Footer fonte */}
        <div className="bg-emerald-700 dark:bg-gray-800 text-white rounded-lg shadow-lg p-6 text-center transition-colors">
          <p className="text-emerald-200 dark:text-gray-400 text-sm mb-1">
            Ricette da
          </p>
          <p className="text-lg font-semibold">
            &quot;The Plant-Based Athlete&quot;
          </p>
          <p className="text-emerald-200 dark:text-gray-400 text-sm">
            Matt Frazier &amp; Robert Cheeke
          </p>
        </div>
      </main>
    </div>
  );
}
