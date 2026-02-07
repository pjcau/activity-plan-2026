"use client";

import { useState, useMemo } from "react";
import ricetteData from "@/data/ricette.json";

type Ricetta = (typeof ricetteData.ricette)[number];

const categorie = [
  { value: "", label: "Tutte" },
  { value: "colazione", label: "Colazione" },
  { value: "pranzo", label: "Pranzo" },
  { value: "cena", label: "Cena" },
  { value: "snack", label: "Snack" },
  { value: "post-workout", label: "Post-Workout" },
];

export default function Ricette() {
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tagSelezionati, setTagSelezionati] = useState<string[]>([]);
  const [ricercaTesto, setRicercaTesto] = useState("");
  const [ricettaAperta, setRicettaAperta] = useState<number | null>(null);

  // Estrai tutti i tag unici e ordinali
  const tuttiTag = useMemo(() => {
    const tagSet = new Set<string>();
    ricetteData.ricette.forEach((r) => r.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, "it"));
  }, []);

  // Filtra le ricette
  const ricetteFiltrate = useMemo(() => {
    return ricetteData.ricette.filter((r) => {
      // Filtro categoria
      if (categoriaFiltro && r.categoria !== categoriaFiltro) return false;

      // Filtro tag (AND: la ricetta deve avere TUTTI i tag selezionati)
      if (
        tagSelezionati.length > 0 &&
        !tagSelezionati.every((tag) => r.tags.includes(tag))
      )
        return false;

      // Filtro testo
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
  }, [categoriaFiltro, tagSelezionati, ricercaTesto]);

  const toggleTag = (tag: string) => {
    setTagSelezionati((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetFiltri = () => {
    setCategoriaFiltro("");
    setTagSelezionati([]);
    setRicercaTesto("");
  };

  const getCategoriaLabel = (cat: string) => {
    const found = categorie.find((c) => c.value === cat);
    return found ? found.label : cat;
  };

  const getCategoriaColor = (cat: string) => {
    switch (cat) {
      case "colazione":
        return "bg-amber-100 text-amber-800";
      case "pranzo":
        return "bg-blue-100 text-blue-800";
      case "cena":
        return "bg-purple-100 text-purple-800";
      case "snack":
        return "bg-orange-100 text-orange-800";
      case "post-workout":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Ricette Plant-Based per Atleti
          </h1>
          <p className="text-gray-600">
            30 ricette dal libro{" "}
            <span className="font-semibold">
              &quot;{ricetteData.fonte}&quot;
            </span>
            . Filtra per categoria o ingrediente per trovare la ricetta perfetta
            per il tuo allenamento.
          </p>
        </div>

        {/* Filtri */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-emerald-700">Filtri</h2>
            {(categoriaFiltro ||
              tagSelezionati.length > 0 ||
              ricercaTesto) && (
              <button
                onClick={resetFiltri}
                className="text-sm text-red-600 hover:text-red-800 cursor-pointer"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Categorie */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
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
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag ingredienti */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
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
                      : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteggio risultati */}
        <div className="mb-4 text-sm text-gray-600">
          {ricetteFiltrate.length} ricett{ricetteFiltrate.length === 1 ? "a" : "e"}{" "}
          trovat{ricetteFiltrate.length === 1 ? "a" : "e"}
        </div>

        {/* Griglia ricette */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {ricetteFiltrate.map((ricetta) => (
            <div
              key={ricetta.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Header ricetta */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-2">
                    {ricetta.nome}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getCategoriaColor(ricetta.categoria)}`}
                  >
                    {getCategoriaLabel(ricetta.categoria)}
                  </span>
                </div>

                {/* Info rapide */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                  <span>&#9201; {ricetta.tempoPreparazione}</span>
                  <span>&#127860; {ricetta.porzioni} porz.</span>
                  <span>{ricetta.calorie} kcal</span>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-blue-50 rounded p-2 text-center">
                    <div className="text-xs text-blue-600 font-medium">
                      Proteine
                    </div>
                    <div className="text-sm font-bold text-blue-800">
                      {ricetta.proteine}g
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded p-2 text-center">
                    <div className="text-xs text-amber-600 font-medium">
                      Carbo
                    </div>
                    <div className="text-sm font-bold text-amber-800">
                      {ricetta.carboidrati}g
                    </div>
                  </div>
                  <div className="bg-red-50 rounded p-2 text-center">
                    <div className="text-xs text-red-600 font-medium">
                      Grassi
                    </div>
                    <div className="text-sm font-bold text-red-800">
                      {ricetta.grassi}g
                    </div>
                  </div>
                  <div className="bg-green-50 rounded p-2 text-center">
                    <div className="text-xs text-green-600 font-medium">
                      Fibre
                    </div>
                    <div className="text-sm font-bold text-green-800">
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
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
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
                  className="text-emerald-600 hover:text-emerald-800 text-sm font-medium cursor-pointer"
                >
                  {ricettaAperta === ricetta.id
                    ? "Nascondi dettagli"
                    : "Mostra ingredienti e preparazione"}
                </button>
              </div>

              {/* Dettagli espandibili */}
              {ricettaAperta === ricetta.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {/* Ingredienti */}
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Ingredienti
                  </h4>
                  <ul className="mb-4 space-y-1">
                    {ricetta.ingredienti.map((ing, i) => (
                      <li key={i} className="text-sm text-gray-700 flex">
                        <span className="text-emerald-600 mr-2">&#8226;</span>
                        <span>
                          <span className="font-medium">{ing.quantita}</span>{" "}
                          {ing.nome}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Preparazione */}
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Preparazione
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {ricetta.istruzioni}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No results */}
        {ricetteFiltrate.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg mb-2">
              Nessuna ricetta trovata
            </p>
            <p className="text-gray-400 text-sm">
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
        <div className="bg-emerald-700 text-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-emerald-200 text-sm mb-1">
            Ricette da
          </p>
          <p className="text-lg font-semibold">
            &quot;The Plant-Based Athlete&quot;
          </p>
          <p className="text-emerald-200 text-sm">
            Matt Frazier &amp; Robert Cheeke
          </p>
        </div>
      </main>
    </div>
  );
}
